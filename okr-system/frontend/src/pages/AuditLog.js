import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getActionMeta = (action) => {
  if (action.includes('APPROVED')) return { badgeClass: 'badge-approved', dot: 'var(--success)', label: 'Approved' };
  if (action.includes('REJECTED')) return { badgeClass: 'badge-rejected', dot: 'var(--danger)',  label: 'Rejected'  };
  if (action.includes('CREATED'))  return { badgeClass: 'badge-locked',   dot: 'var(--info)',    label: 'Created'   };
  if (action.includes('SUBMITTED'))return { badgeClass: 'badge-pending',  dot: 'var(--warning)', label: 'Submitted' };
  return { badgeClass: 'badge-draft', dot: 'var(--text-tertiary)', label: action };
};

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/audit')
      .then(r => setLogs(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main">
      <div className="page-header">
        <div>
          <div className="page-title">Audit Log</div>
          <div className="page-subtitle">Real-time organisation activity and governance tracking</div>
        </div>
        <div className="page-actions">
          <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            {logs.length} event{logs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="card animate-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ borderRadius: 'var(--radius-xl)', border: 'none' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              Loading activity…
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No activity yet</div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => {
                  const meta = getActionMeta(l.action);
                  return (
                    <tr key={l.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{
                            width: 32, height: 32, fontSize: 12, borderRadius: 9,
                            flexShrink: 0, background: 'var(--accent-soft)', color: 'var(--accent)',
                          }}>
                            {l.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{l.name}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{l.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>
                      </td>
                      <td style={{ maxWidth: 340 }}>
                        <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {l.details}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 12.5, color: 'var(--text-tertiary)',
                          fontWeight: 500, whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-mono, monospace)',
                        }}>
                          {new Date(l.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}