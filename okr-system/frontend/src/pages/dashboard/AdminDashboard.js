
import React, { useEffect, useState } from "react";
import axios from '../../api';
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

 const totalGoals = Number(stats?.totalGoals || 0);
const approvedGoals = Number(stats?.approvedGoals || 0);
const pendingGoals = Number(stats?.pendingGoals || 0);
const totalUsers = Number(stats?.totalUsers || 0);
const totalCheckins = Number(stats?.totalCheckins || 0);

const submissionRate =
  totalGoals > 0
    ? Math.round((approvedGoals / totalGoals) * 100)
    : 0;
  const pieData = [
  { name: "Approved", value: approvedGoals, color: "#10b981" },
  { name: "Pending", value: pendingGoals, color: "#f59e0b" },
  {
    name: "Draft",
    value: Math.max(totalGoals - approvedGoals - pendingGoals, 0),
    color: "#e2e8f0"
  },
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
          { val: totalUsers, label: 'Active Employees', color: '#0f172a' },
{ val: pendingGoals, label: 'Pending Reviews', color: '#f59e0b' },
{ val: totalCheckins, label: 'Quarterly Check-ins', color: '#6366f1' },
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
                 {pieData.map((e, i) => (
  <Cell key={i} fill={e.color} />
))}
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