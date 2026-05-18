import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReviewModal({ goal, onClose }) {
  const [comment, setComment] = useState('');

  const save = async () => {
    try {
      await axios.post('/api/checkins/review', {
        goal_id: goal.id,
        manager_comment: comment,
      });
      alert('Review saved');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save review');
    }
  };

  const progress = Math.min(goal.weightage * 2, 100);
  const progressColor = progress >= 70 ? 'var(--success)' : progress >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Quarterly Review</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>×</button>
        </div>

        {/* Goal info */}
        <div style={{
          background: 'var(--surface-1)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          marginBottom: 20,
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="avatar" style={{ width: 30, height: 30, fontSize: 12, borderRadius: 8, flexShrink: 0, background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {goal.employee_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{goal.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{goal.employee_name}</div>
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Current Progress</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: progressColor }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: progressColor,
                borderRadius: 999,
                transition: 'width 0.5s var(--ease-out)',
              }} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Manager Feedback</label>
          <textarea
            className="form-textarea"
            placeholder="Share your observations on progress, blockers, and next steps…"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save Review</button>
        </div>
      </div>
    </div>
  );
}

export default function QuarterlyReviews() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/goals/team');
      setGoals(data.filter(g => g.status === 'approved'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="main">
      <div className="page-header">
        <div>
          <div className="page-title">Quarterly Reviews</div>
          <div className="page-subtitle">Review employee progress and leave feedback on approved goals</div>
        </div>
      </div>

      <div className="card animate-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ borderRadius: 'var(--radius-xl)', border: 'none' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              Loading reviews…
            </div>
          ) : goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No approved goals</div>
              <div style={{ fontSize: 13 }}>Goals need to be approved before they appear here</div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Goal</th>
                  <th>Quarter</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {goals?.map(g => {
                  const progress = Math.min(g.weightage * 2, 100);
                  const progressColor = progress >= 70 ? 'var(--success)' : progress >= 40 ? 'var(--warning)' : 'var(--danger)';
                  return (
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
                      <td style={{ maxWidth: 240 }}>
                        <div style={{ fontWeight: 600 }}>{g.title}</div>
                        {g.description && (
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                            {g.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{g.quarter}</span>
                      </td>
                      <td><span className="badge badge-approved">Approved</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 80, height: 6, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: progressColor, borderRadius: 999 }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: progressColor }}>{progress}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedGoal(g)}>
                          Add Feedback
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedGoal && (
        <ReviewModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      )}
    </div>
  );
}