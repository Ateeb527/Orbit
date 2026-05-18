
import React, { useEffect, useState } from 'react';
import axios from '../../api';
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

 const myGoals = Array.isArray(stats?.myGoals)
  ? stats.myGoals
  : [];

const teamStats = Array.isArray(stats?.teamStats)
  ? stats.teamStats
  : [];

const pending = myGoals.find(g => g.status === 'pending');
  return (
    <div style={S.main}>
      <div style={S.heading}>Manager Dashboard</div>
      <div style={S.sub}>Welcome back, {user.name}</div>

      <div style={S.grid4}>
        {[
         { val: teamStats.length, label: 'Team Members', color: '#0f172a' },
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
         {teamStats.length > 0 ? (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={teamStats} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="approved_goals" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          ) : (
  <div style={{ color: '#64748b', fontSize: '14px' }}>
    No team data available
  </div>
)}
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