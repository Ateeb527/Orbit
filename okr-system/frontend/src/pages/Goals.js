import React, { useEffect, useState } from 'react';
import axios from '../api';

const QUARTERS = ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026'];

function GoalModal({ goal, onClose, onSaved }) {
  const [form, setForm] = useState(goal || { title: '', description: '', weightage: 10, quarter: 'Q1-2026' });
  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    try {
      if (goal?.id) {
        await axios.put(`/api/goals/${goal.id}`, form);
      } else {
        await axios.post('/api/goals', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{goal?.id ? 'Edit Goal' : 'New Goal'}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>×</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="e.g. Increase customer retention by 15%" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Describe what success looks like..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Weightage (%)</label>
            <input className="form-input" type="number" min="10" max="100" value={form.weightage}
              onChange={e => setForm({ ...form, weightage: parseInt(e.target.value) })} />
            <div className="form-hint">Between 10 and 100</div>
          </div>
          <div className="form-group">
            <label className="form-label">Quarter</label>
            <select className="form-select" value={form.quarter} onChange={e => setForm({ ...form, quarter: e.target.value })}>
              {QUARTERS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save Goal</button>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [modal, setModal] = useState(null);
  const [quarter, setQuarter] = useState('Q1-2026');

  const load = () => axios.get(`/api/goals?quarter=${quarter}`).then(r => setGoals(r.data));
  useEffect(() => { load(); }, [quarter]);

  const submit = async (id) => {
    await axios.post(`/api/goals/${id}/submit`);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    await axios.delete(`/api/goals/${id}`);
    load();
  };

  // ── Derived values — declared BEFORE return ──────────────────────
  const safeGoals = Array.isArray(goals) ? goals : [];
  const filteredGoals = safeGoals.filter(g => g.status !== 'rejected');
  const totalW = filteredGoals.reduce((acc, g) => acc + Number(g.weightage || 0), 0);
  const weightColor =
    totalW === 100 ? 'var(--success)' :
    totalW > 100   ? 'var(--danger)'  :
                     'var(--accent)';

  return (
    <div className="main">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">My Goals</div>
          <div className="page-subtitle">Track and manage your quarterly objectives</div>
        </div>
        <div className="page-actions">
          <select className="form-select" style={{ width: 130 }} value={quarter} onChange={e => setQuarter(e.target.value)}>
            {QUARTERS.map(q => <option key={q}>{q}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Goal
          </button>
        </div>
      </div>

      {/* Weightage bar */}
      <div className="card animate-in" style={{ padding: '16px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text-tertiary)', marginBottom: 4 }}>
              Total Weightage — {quarter}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: weightColor }}>{totalW}%</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/ 100%</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(totalW, 100)}%`,
                height: '100%',
                background: weightColor,
                borderRadius: 999,
                transition: 'width 0.4s var(--ease-out)',
              }} />
            </div>
          </div>
          {totalW === 100 && <span className="badge badge-approved" style={{ fontSize: 12 }}>Perfect allocation</span>}
          {totalW > 100  && <span className="badge badge-rejected" style={{ fontSize: 12 }}>Exceeds 100%</span>}
        </div>
      </div>

      {/* Table */}
      <div className="card animate-in stagger-1" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ borderRadius: 'var(--radius-xl)', border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Weightage</th>
                <th>Quarter</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeGoals.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No goals yet</div>
                      <div style={{ fontSize: 13 }}>Create your first goal to get started</div>
                    </div>
                  </td>
                </tr>
              )}
              {safeGoals.map(g => (
                <tr key={g.id}>
                  <td style={{ maxWidth: 300 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.title}</div>
                    {g.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                        {g.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>{g.weightage}%</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{g.quarter}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${g.status}`}>{g.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {['draft', 'rejected'].includes(g.status) && (
                        <button className="btn btn-outline btn-sm" onClick={() => setModal(g)}>Edit</button>
                      )}
                      {g.status === 'draft' && (
                        <button className="btn btn-primary btn-sm" onClick={() => submit(g.id)}>Submit</button>
                      )}
                      {g.status === 'draft' && (
                        <button className="btn btn-danger btn-sm" onClick={() => del(g.id)}>Delete</button>
                      )}
                      {g.status === 'pending' && (
                        <span className="badge badge-pending" style={{ fontSize: 12 }}>Awaiting review</span>
                      )}
                      {g.status === 'approved' && (
                        <span className="badge badge-locked" style={{ fontSize: 12 }}>Locked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <GoalModal
          goal={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}