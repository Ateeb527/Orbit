import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Reports() {
  const [users, setUsers] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    axios.get('/api/users').then(r => setUsers(r.data));
    axios.get('/api/goals/team').then(r => setGoals(r.data));
  }, []);

  const exportCSV = () => {
    const rows = [['Employee', 'Email', 'Role', 'Goal', 'Weightage', 'Quarter', 'Status']];
    goals.forEach(g => rows.push([g.employee_name, g.employee_email, '', g.title, g.weightage, g.quarter, g.status]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'okr_report.csv'; a.click();
  };

  const byStatus = goals.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1; return acc;
  }, {});

  return (
    <div className="main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="page-title" style={{ margin: 0 }}>Reports</div>
        <button className="btn btn-primary" onClick={exportCSV}>📥 Export CSV</button>
      </div>

      <div className="stat-grid">
        {Object.entries(byStatus).map(([status, count]) => (
          <div className="stat-card" key={status}>
            <div className="value">{count}</div>
            <div className="label" style={{ textTransform: 'capitalize' }}>{status} Goals</div>
          </div>
        ))}
        <div className="stat-card">
          <div className="value">{users.length}</div>
          <div className="label">Total Users</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>All Goals</h3>
        <table className="table">
          <thead>
            <tr><th>Employee</th><th>Goal</th><th>Weight</th><th>Quarter</th><th>Status</th></tr>
          </thead>
          <tbody>
            {goals.map(g => (
              <tr key={g.id}>
                <td>{g.employee_name}</td>
                <td>{g.title}</td>
                <td>{g.weightage}%</td>
                <td>{g.quarter}</td>
                <td><span className={`badge badge-${g.status}`}>{g.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
