import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckinModal({ goal, onClose, onSaved }) {
  const [form, setForm] = useState({ achievement_percent: 0, notes: '', status: 'On Track' });
  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    try {
      await axios.post('/api/checkins', { goal_id: goal.id, ...form });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed');
    }
  };

  const pctColor = form.achievement_percent >= 70 ? 'var(--success)' : form.achievement_percent >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Check-in</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{goal.title}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Slider */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Achievement</label>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: pctColor }}>{form.achievement_percent}%</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="range"
              min="0" max="100"
              value={form.achievement_percent}
              onChange={e => setForm({ ...form, achievement_percent: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', height: 4 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Progress Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Not Started', 'On Track', 'Completed'].map(s => (
              <button
                key={s}
                onClick={() => setForm({ ...form, status: s })}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${form.status === s ? 'var(--accent)' : 'var(--border-strong)'}`,
                  background: form.status === s ? 'var(--accent-soft)' : 'var(--surface-0)',
                  color: form.status === s ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'inherit',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Describe your progress, blockers, or next steps…"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Submit Check-in</button>
        </div>
      </div>
    </div>
  );
}

export default function Checkins() {
  const [goals, setGoals] = useState([]);
  const [checkins, setCheckins] = useState({});
  const [modal, setModal] = useState(null);

  const loadGoals = async () => {
    const { data } = await axios.get('/api/goals');
    const approved = data.filter(g => g.status === 'approved');
    setGoals(approved);
    const checks = {};
    await Promise.all(approved.map(async g => {
      const r = await axios.get(`/api/checkins/goal/${g.id}`);
      checks[g.id] = r.data;
    }));
    setCheckins(checks);
  };

  useEffect(() => { loadGoals(); }, []);

  return (
    <div className="main">
      <div className="page-header">
        <div>
          <div className="page-title">Quarterly Check-ins</div>
          <div className="page-subtitle">Log progress on your approved goals</div>
        </div>
      </div>

      {goals.length === 0 && (
        <div className="card animate-in" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No approved goals</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Get your goals approved by your manager first</div>
        </div>
      )}

      {goals.map((g, i) => {
        const history = checkins[g.id] || [];
        const latest = history[0];
        const latestPct = latest?.achievement_percent ?? 0;
        const progressColor = latestPct >= 70 ? 'var(--success)' : latestPct >= 40 ? 'var(--warning)' : 'var(--text-tertiary)';

        return (
          <div className={`card animate-in stagger-${Math.min(i + 1, 4)}`} key={g.id}>
            {/* Goal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{g.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <span>{g.quarter}</span>
                  <span>·</span>
                  <span>{g.weightage}% weight</span>
                  {latest && (
                    <>
                      <span>·</span>
                      <span style={{ color: progressColor, fontWeight: 600 }}>Last: {latestPct}%</span>
                    </>
                  )}
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setModal(g)}>
                + Check-in
              </button>
            </div>

            {/* Progress bar (latest) */}
            {latest && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>Latest progress</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: progressColor }}>{latestPct}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${latestPct}%`, height: '100%', background: progressColor, borderRadius: 999, transition: 'width 0.5s var(--ease-out)' }} />
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 ? (
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-tertiary)', marginBottom: 10 }}>
                  History ({history.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map(c => {
                    const pct = c.achievement_percent;
                    const color = pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)';
                    return (
                      <div key={c.id} style={{
                        background: 'var(--surface-1)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        gap: 14,
                        alignItems: 'flex-start',
                      }}>
                        {/* Pct pill */}
                        <div style={{
                          fontWeight: 800, fontSize: 15, color, letterSpacing: '-0.5px',
                          minWidth: 44, textAlign: 'center',
                          background: color === 'var(--success)' ? 'var(--success-soft)' : color === 'var(--warning)' ? 'var(--warning-soft)' : 'var(--danger-soft)',
                          padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                          flexShrink: 0,
                        }}>
                          {pct}%
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: c.notes ? 6 : 0 }}>
                            <span className={`badge ${c.status === 'Completed' ? 'badge-approved' : c.status === 'On Track' ? 'badge-pending' : 'badge-draft'}`} style={{ fontSize: 11 }}>
                              {c.status || 'On Track'}
                            </span>
                            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                              {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {c.notes && (
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{c.notes}</div>
                          )}
                          {c.manager_comment && (
                            <div style={{
                              fontSize: 12,
                              background: 'var(--warning-soft)',
                              color: '#92400e',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              marginTop: 8,
                              display: 'flex',
                              gap: 6,
                            }}>
                              <span>💬</span>
                              <span><strong>Manager:</strong> {c.manager_comment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '8px 0' }}>No check-ins yet — add your first one above</div>
            )}
          </div>
        );
      })}

      {modal && (
        <CheckinModal
          goal={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadGoals(); }}
        />
      )}
    </div>
  );
}