import React, { useState } from 'react';
import axios from '../api';

const QUARTERS = ['Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026'];

export default function GoalModal({ goal, quarter, onClose, onSaved }) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [weightage, setWeightage] = useState(goal?.weightage ?? 20);
  const [selectedQuarter, setSelectedQuarter] = useState(
    goal?.quarter || quarter || 'Q1-2026'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const weight = Number(weightage);

    if (!title.trim()) {
      setError('Please enter a goal title.');
      return;
    }

    if (!Number.isFinite(weight) || weight < 10 || weight > 100) {
      setError('Weightage must be between 10 and 100.');
      return;
    }

    setSaving(true);

    try {
      if (goal) {
        await axios.put(`/api/goals/${goal.id}`, {
          title: title.trim(),
          description,
          weightage: weight,
        });
      } else {
        await axios.post('/api/goals', {
          title: title.trim(),
          description,
          weightage: weight,
          quarter: selectedQuarter,
        });
      }

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Could not save the goal. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={styles.modal}>
        <h2 style={styles.heading}>
          {goal ? 'Edit Goal' : 'Create New Goal'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Goal Title</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Improve API Performance"
            required
            autoFocus
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to achieve..."
            rows={4}
          />

          <label style={styles.label}>Weightage (%)</label>
          <input
            style={styles.input}
            type="number"
            min="10"
            max="100"
            value={weightage}
            onChange={(e) => setWeightage(e.target.value)}
            required
          />

          {!goal && (
            <>
              <label style={styles.label}>Quarter</label>
              <select
                style={styles.input}
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
              >
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" style={styles.save} disabled={saving}>
              {saving ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxSizing: 'border-box',
    color: '#111827',
  },
  heading: {
    margin: '0 0 20px',
    fontSize: '21px',
    fontWeight: 700,
  },
  label: {
    display: 'block',
    margin: '14px 0 6px',
    fontSize: '13px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    boxSizing: 'border-box',
    fontSize: '14px',
    background: '#ffffff',
    color: '#111827',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    boxSizing: 'border-box',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
    color: '#111827',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px',
  },
  cancel: {
    padding: '10px 15px',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    background: '#ffffff',
    cursor: 'pointer',
  },
  save: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '7px',
    background: '#6366f1',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
    marginTop: '12px',
  },
};
