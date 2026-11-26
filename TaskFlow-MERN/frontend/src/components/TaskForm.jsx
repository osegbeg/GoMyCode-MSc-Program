import { useState } from 'react';
import API from '../api';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await API.post('/tasks', {
        title,
        description,
        deadline,
        status,
        priority,
      });

      onTaskCreated(data);
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('pending');
      setPriority('medium');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel-card">
      <h3>Add New Task</h3>
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form-grid">
        <div className="form-group full-width">
          <label>Task Title *</label>
          <input
            type="text"
            placeholder="e.g. Complete Phase 3 React UI"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows="2"
            placeholder="Add details or notes for this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Deadline *</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Initial Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group align-end">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : '+ Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}