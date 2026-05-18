// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const STATUS_COLORS = {
//   draft: '#9ca3af',
//   pending: '#d97706',
//   approved: '#16a34a',
//   rejected: '#dc2626',
// };

// export default function EmployeeDashboard() {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     axios.get('/api/users/stats')
//       .then(r => setStats(r.data));
//   }, []);

//   if (!stats) {
//     return (
//       <div className="main">
//         Loading...
//       </div>
//     );
//   }

//   const goalData = stats.myGoals
//     .map(g => ({
//       name: g.status,
//       value: parseInt(g.count),
//       color: STATUS_COLORS[g.status] || '#9ca3af',
//     }))
//     .filter(g => g.value > 0);

//   const total = goalData.reduce((a, b) => a + b.value, 0);

//   const getCount = (status) => {
//     const found = stats.myGoals.find(g => g.status === status);
//     return found ? parseInt(found.count) : 0;
//   };

//   return (
//     <div className="main">

//       <div className="page-title">
//         Dashboard
//       </div>

//       <div style={{ marginBottom: 24, color: '#64748b' }}>
//         Welcome back, {user?.name}! 👋
//       </div>

//       {/* Stats Grid */}
//       <div className="stat-grid">

//         <div className="stat-card">
//           <div className="value">{total}</div>
//           <div className="label">Total Goals</div>
//         </div>

//         <div className="stat-card">
//           <div className="value" style={{ color: '#16a34a' }}>
//             {getCount('approved')}
//           </div>
//           <div className="label">Approved</div>
//         </div>

//         <div className="stat-card">
//           <div className="value" style={{ color: '#6b7280' }}>
//             {getCount('draft')}
//           </div>
//           <div className="label">Draft Goals</div>
//         </div>

//         {/* 🎯 FIXED: Wrapped properly inside a structured stat-card container */}
//         <div className="stat-card">
//           <div className="value" style={{ color: '#2563eb' }}>
//             {total > 0 ? Math.round((getCount('approved') / total) * 100) : 0}%
//           </div>
//           <div className="label">Completion</div>
//         </div>

//       </div>

//       {/* Charts Grid */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: 20,
//         marginTop: 24
//       }}>

//         <div className="card">
//           <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>
//             Goal Status Breakdown
//           </h3>

//           <ResponsiveContainer width="100%" height={260}>
//             <PieChart>
//               <Pie
//                 data={goalData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={90}
//                 dataKey="value"
//                 label
//               >
//                 {goalData.map((entry, i) => (
//                   <Cell key={i} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="card">
//           <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>
//             Upcoming Actions
//           </h3>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//             <div className="alert alert-success">
//               ✅ Q2 Check-in window open
//             </div>

//             {getCount('draft') > 0 && (
//               <div className="alert alert-warning">
//                 📝 {getCount('draft')} draft goals pending submission
//               </div>
//             )}

//             <div className="alert alert-info">
//               📊 {total} total goals currently assigned
//             </div>
//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = { draft: '#94a3b8', pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

const S = {
  main: { padding: '32px', maxWidth: '1200px' },
  heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' },
  sub: { fontSize: '14px', color: '#64748b', marginBottom: '28px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  kpiCard: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  kpiVal: { fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1 },
  kpiLabel: { fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '500' },
  cardTitle: { fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '18px' },
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => { axios.get('/api/users/stats').then(r => setStats(r.data)); }, []);
  if (!stats) return <div style={S.main}><div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div></div>;

  const goalData = stats.myGoals.map(g => ({ name: g.status, value: parseInt(g.count), color: STATUS_COLORS[g.status] || '#94a3b8' })).filter(g => g.value > 0);
  const total = goalData.reduce((a, b) => a + b.value, 0);
  const getCount = s => parseInt(stats.myGoals.find(g => g.status === s)?.count || 0);
  const completion = total > 0 ? Math.round((getCount('approved') / total) * 100) : 0;

  const alerts = [
    { color: '#ecfdf5', border: '#a7f3d0', dot: '#10b981', text: 'Q2 Check-in window open' },
    ...(getCount('draft') > 0 ? [{ color: '#fef3c7', border: '#fde68a', dot: '#f59e0b', text: `${getCount('draft')} draft goals pending submission` }] : []),
    { color: '#eff6ff', border: '#bfdbfe', dot: '#6366f1', text: `${total} total goals currently assigned` },
  ];

  return (
    <div style={S.main}>
      <div style={S.heading}>Dashboard</div>
      <div style={S.sub}>Welcome back, {user?.name}</div>

      <div style={S.grid4}>
        {[
          { val: total, label: 'Total Goals', color: '#0f172a' },
          { val: getCount('approved'), label: 'Approved', color: '#10b981' },
          { val: getCount('draft'), label: 'Draft Goals', color: '#94a3b8' },
          { val: `${completion}%`, label: 'Completion', color: '#6366f1' },
        ].map(({ val, label, color }) => (
          <div key={label} style={S.kpiCard}>
            <div style={{ ...S.kpiVal, color }}>{val}</div>
            <div style={S.kpiLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Goal Status Breakdown</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={goalData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value">
                {goalData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Upcoming Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alerts.map(({ color, border, dot, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: color, border: `1px solid ${border}`, borderRadius: '8px', fontSize: '13px', color: '#374151' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}