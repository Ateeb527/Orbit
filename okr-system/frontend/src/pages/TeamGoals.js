import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const QUARTERS = ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026'];

export default function TeamGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [form, setForm] = useState({
    user_id: '', title: '', description: '', weightage: 10, quarter: 'Q1-2026',
  });

  const load = () => {
    setLoading(true);
    axios.get('/api/goals/team').then(r => setGoals(r.data)).finally(() => setLoading(false));
    axios.get('/api/users').then(r => setEmployees((r.data || []).filter(u => u.role === 'employee'));
  };

  useEffect(() => { load(); }, []);

  const review = async (id, action) => {
    try {
      await axios.post(`/api/goals/${id}/review`, { action });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const assignGoal = async () => {
    try {
      await axios.post('/api/goals/assign', form);
      setShowAssign(false);
      setForm({ user_id: '', title: '', description: '', weightage: 10, quarter: 'Q1-2026' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign goal');
    }
  };

 const counts = (goals || []).reduce((acc, g) => {
  acc[g.status] = (acc[g.status] || 0) + 1;
  return acc;
}, {});

 const filtered =
  filter === 'all'
    ? (goals || [])
    : (goals || []).filter(g => g.status === filter);


  const filterOptions = [
    { value: 'all', label: 'All', count: goals.length },
    { value: 'pending', label: 'Pending', count: counts.pending || 0 },
    { value: 'approved', label: 'Approved', count: counts.approved || 0 },
    { value: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
    { value: 'draft', label: 'Draft', count: counts.draft || 0 },
  ];

  return (
    <div className="main">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Team Goals</div>
          <div className="page-subtitle">Review and manage your team's objectives</div>
        </div>
        <div className="page-actions">
          {user?.role === 'manager' && (
            <button className="btn btn-primary" onClick={() => setShowAssign(true)}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Assign Goal
            </button>
          )}
        </div>
      </div>

      {/* Alert */}
      {counts.pending > 0 && (
        <div className="alert alert-warning animate-in">
          <span>⏳</span>
          <span><strong>{counts.pending} goal{counts.pending > 1 ? 's' : ''}</strong> waiting for your review</span>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--surface-2)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
              background: filter === opt.value ? 'var(--surface-0)' : 'transparent',
              color: filter === opt.value ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: filter === opt.value ? 'var(--shadow-xs)' : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {opt.label}
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: filter === opt.value ? 'var(--accent-soft)' : 'transparent',
              color: filter === opt.value ? 'var(--accent)' : 'var(--text-tertiary)',
              padding: '0 5px', borderRadius: 999,
            }}>{opt.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card animate-in stagger-1" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ borderRadius: 'var(--radius-xl)', border: 'none' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 13 }}>Loading team goals…</div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Goal</th>
                  <th>Weightage</th>
                  <th>Quarter</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No goals in this category</div>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 8, flexShrink: 0, background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                          {g.employee_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{g.employee_name}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{g.employee_email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 260 }}>
                      <div style={{ fontWeight: 600 }}>{g.title}</div>
                      {g.description && (
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                          {g.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{g.weightage}%</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{g.quarter}</span>
                    </td>
                    <td><span className={`badge badge-${g.status}`}>{g.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {g.status === 'pending' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => review(g.id, 'approve')}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => review(g.id, 'reject')}>Reject</button>
                          </>
                        )}
                        {g.status !== 'pending' && (
                          <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
                            onClick={async () => {
                              if (!window.confirm('Delete this goal?')) return;
                              await axios.delete(`/api/goals/${g.id}`);
                              load();
                            }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssign && (
        <div className="modal-overlay" onClick={() => setShowAssign(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Assign Goal</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAssign(false)} style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Employee</label>
              <select className="form-select" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}>
                <option value="">Select employee…</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Goal Title</label>
              <input className="form-input" placeholder="e.g. Complete onboarding training" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the goal and success criteria..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Weightage (%)</label>
                <input type="number" className="form-input" value={form.weightage} onChange={e => setForm({ ...form, weightage: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Quarter</label>
                <select className="form-select" value={form.quarter} onChange={e => setForm({ ...form, quarter: e.target.value })}>
                  {QUARTERS.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAssign(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={assignGoal}>Assign Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}