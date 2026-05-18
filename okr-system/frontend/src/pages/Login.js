// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//  const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); 
//     setLoading(true);
//     try {
//       const success = await login(form.email, form.password);
//       if (success) {
//         navigate('/dashboard'); // 🚀 Clean, safe redirect
//       } else {
//         setError('Invalid server response data configuration.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     }
//     setLoading(false);
//   };
//   const quickLogin = (role) => {
//     const creds = {
//       admin: { email: 'admin@company.com', password: 'password' },
//       manager: { email: 'manager@company.com', password: 'password' },
//       employee: { email: 'employee@company.com', password: 'password' },
//     };
//     setForm(creds[role]);
//   };

//   return (
//    <div className="login-page">
//   <div className="login-card">
//     <div className="login-title">Welcome to Orbit 👋</div>
//     <div className="login-sub">
//        Sign in to Orbit Workspace
//     </div>
//         {error && <div className="alert alert-error">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Email</label>
//             <input className="form-input" type="email" value={form.email}
//               onChange={e => setForm({ ...form, email: e.target.value })} required />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input className="form-input" type="password" value={form.password}
//               onChange={e => setForm({ ...form, password: e.target.value })} required />
//           </div>
//           <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
//           <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>DEMO ACCOUNTS</div>
//           {['employee', 'manager', 'admin'].map(r => (
//             <button key={r} className="btn btn-outline btn-sm" style={{ marginRight: 8, textTransform: 'capitalize' }}
//               onClick={() => quickLogin(r)}>{r}</button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(form.email, form.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid server response data configuration.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const quickLogin = (role) => {
    const creds = {
      admin: { email: 'admin@company.com', password: 'password' },
      manager: { email: 'manager@company.com', password: 'password' },
      employee: { email: 'employee@company.com', password: 'password' },
    };
    setForm(creds[role]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.5" fill="white"/></svg>
          </div>
          <span style={styles.brandName}>Orbit</span>
        </div>
        <div style={styles.leftContent}>
          <div style={styles.tagline}>Your workspace,<br />unified.</div>
          <div style={styles.taglineSub}>Manage teams, projects, and operations from one intelligent platform.</div>
        </div>
        <div style={styles.dots}>
          {[...Array(12)].map((_, i) => <div key={i} style={{...styles.dot, opacity: 0.08 + (i % 4) * 0.06}} />)}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Sign in</h1>
            <p style={styles.subtitle}>Welcome back to Orbit</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input}
                type="email"
                value={form.email}
                placeholder="you@company.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={form.password}
                placeholder="••••••••"
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={e => !loading && (e.target.style.background = '#4f46e5')}
              onMouseLeave={e => e.target.style.background = '#6366f1'}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div style={styles.demoSection}>
            <div style={styles.demoLabel}>Demo accounts</div>
            <div style={styles.demoRow}>
              {['employee', 'manager', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => quickLogin(r)}
                  style={styles.demoBtn}
                  onMouseEnter={e => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#94a3b8'; }}
                  onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#e2e8f0'; }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    background: '#fafafa',
  },
  left: {
    width: '420px',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '36px',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    width: '34px',
    height: '34px',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
  },
  brandName: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '-0.3px',
  },
  leftContent: {
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: '60px',
  },
  tagline: {
    color: 'white',
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-1px',
    marginBottom: '16px',
  },
  taglineSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '15px',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  dots: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    position: 'absolute',
    bottom: '36px',
    right: '36px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'white',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  cardHeader: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#0f172a',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  submitBtn: {
    marginTop: '4px',
    padding: '11px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s',
    letterSpacing: '-0.1px',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  demoSection: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9',
  },
  demoLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  },
  demoRow: {
    display: 'flex',
    gap: '8px',
  },
  demoBtn: {
    padding: '7px 14px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
};
