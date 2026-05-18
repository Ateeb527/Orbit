// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from 'recharts';

// export default function ManagerDashboard() {
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

//   const pending = stats.myGoals?.find(
//     g => g.status === 'pending'
//   );

//   return (
//     <div className="main">

//       <div className="page-title">
//         Manager Dashboard
//       </div>

//       <div style={{
//         marginBottom: 24,
//         color: '#64748b',
//       }}>
//         Welcome back, {user.name}! 👋
//       </div>

//       {/* KPI */}
//       <div className="stat-grid">

//         <div className="stat-card">
//           <div className="value">
//             {stats.teamStats?.length || 0}
//           </div>

//           <div className="label">
//             Team Members
//           </div>
//         </div>

//         <div className="stat-card">
//           <div
//             className="value"
//             style={{ color: '#d97706' }}
//           >
//             {pending?.count || 0}
//           </div>

//           <div className="label">
//             Pending Approvals
//           </div>
//         </div>

//         <div className="stat-card">
//           <div
//             className="value"
//             style={{ color: '#16a34a' }}
//           >
//             78%
//           </div>

//           <div className="label">
//             Team Completion
//           </div>
//         </div>

//         <div className="stat-card">
//           <div
//             className="value"
//             style={{ color: '#2563eb' }}
//           >
//             3
//           </div>

//           <div className="label">
//             Pending Check-ins
//           </div>
//         </div>

//       </div>

//       {/* Main */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: 20,
//       }}>

//         {/* Team Performance */}
//         <div className="card">

//           <h3 style={{
//             marginBottom: 16,
//             fontSize: 15,
//             fontWeight: 600,
//           }}>
//             Team Performance
//           </h3>

//           <ResponsiveContainer width="100%" height={260}>

//             <BarChart data={stats.teamStats}>

//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis dataKey="name" />

//               <YAxis />

//               <Tooltip />

//               <Bar
//                 dataKey="approved_goals"
//                 fill="#16a34a"
//                 radius={[4, 4, 0, 0]}
//               />

//             </BarChart>

//           </ResponsiveContainer>
//         </div>

//         {/* Approval Queue */}
//         <div className="card">

//           <h3 style={{
//             marginBottom: 16,
//             fontSize: 15,
//             fontWeight: 600,
//           }}>
//             Approval Queue
//           </h3>

//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 12,
//           }}>

//             {pending?.count > 0 ? (
//               <div className="alert alert-warning">
//                 ⏳ {pending.count} goals require approval
//               </div>
//             ) : (
//               <div className="alert alert-success">
//                 ✅ No pending approvals
//               </div>
//             )}

//             <a
//               href="/team"
//               className="btn btn-primary"
//               style={{
//                 width: 'fit-content',
//                 textDecoration: 'none',
//               }}
//             >
//               Review Team Goals →
//             </a>

//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
  btn: { display: 'inline-block', padding: '9px 16px', background: '#6366f1', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: 'none', cursor: 'pointer' },
};

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => { axios.get('/api/users/stats').then(r => setStats(r.data)); }, []);
  if (!stats) return <div style={S.main}><div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div></div>;

  const pending = stats.myGoals?.find(g => g.status === 'pending');

  return (
    <div style={S.main}>
      <div style={S.heading}>Manager Dashboard</div>
      <div style={S.sub}>Welcome back, {user.name}</div>

      <div style={S.grid4}>
        {[
          { val: stats.teamStats?.length || 0, label: 'Team Members', color: '#0f172a' },
          { val: pending?.count || 0, label: 'Pending Approvals', color: '#f59e0b' },
          { val: '78%', label: 'Team Completion', color: '#10b981' },
          { val: 3, label: 'Pending Check-ins', color: '#6366f1' },
        ].map(({ val, label, color }) => (
          <div key={label} style={S.kpiCard}>
            <div style={{ ...S.kpiVal, color }}>{val}</div>
            <div style={S.kpiLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Team Performance</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.teamStats} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="approved_goals" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Approval Queue</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pending?.count > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                {pending.count} goals require your approval
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '13px', color: '#065f46' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                No pending approvals
              </div>
            )}
            <a href="/team" style={S.btn}>Review Team Goals →</a>
          </div>
        </div>
      </div>
    </div>
  );
}