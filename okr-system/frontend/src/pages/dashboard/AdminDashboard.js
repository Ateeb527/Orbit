// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// export default function AdminDashboard() {
//   const { user } = useAuth();

//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     axios
//       .get("/api/users/admin-stats")
//       .then((r) => setStats(r.data))
//       .catch((err) => console.error(err));
//   }, []);

//   if (!stats) {
//     return <div className="main">Loading...</div>;
//   }

//   const submissionRate =
//     stats.totalGoals > 0
//       ? Math.round((stats.approvedGoals / stats.totalGoals) * 100)
//       : 0;

//   const pieData = [
//     {
//       name: "Approved",
//       value: stats.approvedGoals,
//       color: "#16a34a",
//     },
//     {
//       name: "Pending",
//       value: stats.pendingGoals,
//       color: "#d97706",
//     },
//     {
//       name: "Draft",
//       value: stats.totalGoals - stats.approvedGoals - stats.pendingGoals,
//       color: "#94a3b8",
//     },
//   ];

//   const quarterlyData = [
//     { quarter: "Q1", checkins: 4 },
//     { quarter: "Q2", checkins: 7 },
//     { quarter: "Q3", checkins: 5 },
//     { quarter: "Q4", checkins: stats.totalCheckins },
//   ];

//   return (
//     <div className="main">
//       <div className="page-title">Executive Admin Dashboard</div>

//       <div
//         style={{
//           marginBottom: 24,
//           color: "#64748b",
//           fontSize: 15,
//         }}
//       >
//         Organization-wide performance analytics and governance overview.
//       </div>

//       {/* KPI CARDS */}
//       <div className="stat-grid">
//         <div className="stat-card">
//           <div className="value">{stats.totalUsers}</div>
//           <div className="label">Active Employees</div>
//         </div>

//         <div className="stat-card">
//           <div className="value" style={{ color: "#16a34a" }}>
//             {submissionRate}%
//           </div>
//           <div className="label">Goal Completion</div>
//         </div>

//         <div className="stat-card">
//           <div className="value" style={{ color: "#d97706" }}>
//             {stats.pendingGoals}
//           </div>
//           <div className="label">Pending Reviews</div>
//         </div>

//         <div className="stat-card">
//           <div className="value" style={{ color: "#2563eb" }}>
//             {stats.totalCheckins}
//           </div>
//           <div className="label">Quarterly Check-ins</div>
//         </div>
//       </div>

//       {/* ANALYTICS */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: 20,
//           marginBottom: 20,
//         }}
//       >
//         {/* PIE CHART */}
//         <div className="card">
//           <div
//             style={{
//               marginBottom: 20,
//               fontWeight: 700,
//               fontSize: 18,
//             }}
//           >
//             Goal Status Distribution
//           </div>

//           <div style={{ height: 280 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={90}
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>

//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* BAR CHART */}
//         <div className="card">
//           <div
//             style={{
//               marginBottom: 20,
//               fontWeight: 700,
//               fontSize: 18,
//             }}
//           >
//             Quarterly Review Activity
//           </div>

//           <div style={{ height: 280 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={quarterlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />

//                 <XAxis dataKey="quarter" />

//                 <YAxis />

//                 <Tooltip />

//                 <Bar dataKey="checkins" fill="#2563eb" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* LOWER SECTION */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: 20,
//         }}
//       >
//         {/* ALERTS */}
//         <div className="card">
//           <div
//             style={{
//               marginBottom: 18,
//               fontWeight: 700,
//               fontSize: 18,
//             }}
//           >
//             Escalation Alerts
//           </div>

//           <div className="alert alert-warning">
//             ⚠️ {stats.pendingGoals} goals pending manager approval
//           </div>

//           <div className="alert alert-info" style={{ marginTop: 12 }}>
//             📋 {stats.totalGoals} goals created organization-wide
//           </div>

//           <div className="alert alert-success" style={{ marginTop: 12 }}>
//             ✅ {stats.approvedGoals} goals successfully approved
//           </div>
//         </div>

//         {/* ACTIVITY */}
//         <div className="card">
//           <div
//             style={{
//               marginBottom: 18,
//               fontWeight: 700,
//               fontSize: 18,
//             }}
//           >
//             Recent Audit Activity
//           </div>

//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 14,
//             }}
//           >
//             <div>👥 {stats.totalUsers} employees currently active</div>

//             <div>✅ {stats.approvedGoals} approvals completed</div>

//             <div>📝 {stats.totalCheckins} quarterly reviews submitted</div>

//             <div>🔔 {stats.pendingGoals} approval workflows pending</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const S = {
  main: { padding: '32px', maxWidth: '1200px' },
  heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' },
  sub: { fontSize: '14px', color: '#64748b', marginBottom: '28px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  card: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  kpiCard: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  kpiVal: { fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', color: '#0f172a', lineHeight: 1 },
  kpiLabel: { fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '500' },
  cardTitle: { fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '18px' },
  alertRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '8px' },
  activityRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#374151' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { axios.get("/api/users/admin-stats").then(r => setStats(r.data)).catch(console.error); }, []);
  if (!stats) return <div style={S.main}><div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div></div>;

  const submissionRate = stats.totalGoals > 0 ? Math.round((stats.approvedGoals / stats.totalGoals) * 100) : 0;
  const pieData = [
    { name: "Approved", value: stats.approvedGoals, color: "#10b981" },
    { name: "Pending", value: stats.pendingGoals, color: "#f59e0b" },
    { name: "Draft", value: stats.totalGoals - stats.approvedGoals - stats.pendingGoals, color: "#e2e8f0" },
  ];
  const quarterlyData = [
    { quarter: "Q1", checkins: 4 }, { quarter: "Q2", checkins: 7 },
    { quarter: "Q3", checkins: 5 }, { quarter: "Q4", checkins: stats.totalCheckins },
  ];

  return (
    <div style={S.main}>
      <div style={S.heading}>Admin Dashboard</div>
      <div style={S.sub}>Organization-wide performance analytics and governance overview.</div>

      <div style={S.grid4}>
        {[
          { val: stats.totalUsers, label: 'Active Employees', color: '#0f172a' },
          { val: `${submissionRate}%`, label: 'Goal Completion', color: '#10b981' },
          { val: stats.pendingGoals, label: 'Pending Reviews', color: '#f59e0b' },
          { val: stats.totalCheckins, label: 'Quarterly Check-ins', color: '#6366f1' },
        ].map(({ val, label, color }) => (
          <div key={label} style={S.kpiCard}>
            <div style={{ ...S.kpiVal, color }}>{val}</div>
            <div style={S.kpiLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Goal Status Distribution</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
            {pieData.map(e => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.color }} />
                {e.name}
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Quarterly Review Activity</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
                <Bar dataKey="checkins" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Escalation Alerts</div>
          {[
            { color: '#fef3c7', border: '#fde68a', dot: '#f59e0b', text: `${stats.pendingGoals} goals pending manager approval` },
            { color: '#eff6ff', border: '#bfdbfe', dot: '#6366f1', text: `${stats.totalGoals} goals created organization-wide` },
            { color: '#ecfdf5', border: '#a7f3d0', dot: '#10b981', text: `${stats.approvedGoals} goals successfully approved` },
          ].map(({ color, border, dot, text }) => (
            <div key={text} style={{ ...S.alertRow, background: color, border: `1px solid ${border}`, color: '#374151' }}>
              <div style={{ ...S.dot, background: dot }} />
              {text}
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Recent Audit Activity</div>
          {[
            { dot: '#6366f1', text: `${stats.totalUsers} employees currently active` },
            { dot: '#10b981', text: `${stats.approvedGoals} approvals completed` },
            { dot: '#6366f1', text: `${stats.totalCheckins} quarterly reviews submitted` },
            { dot: '#f59e0b', text: `${stats.pendingGoals} approval workflows pending` },
          ].map(({ dot, text }, i) => (
            <div key={i} style={{ ...S.activityRow, ...(i === 3 ? { borderBottom: 'none' } : {}) }}>
              <div style={{ ...S.dot, background: dot }} />
              <span style={{ fontSize: '13px', color: '#374151' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}