import { useState } from 'react';
import API from '../api';

export default function TaskList({ tasks, loading, onTaskUpdated, onTaskDeleted }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending',
    priority: 'medium',
  });
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  if (loading) {
    return <p className="empty-state">Loading your tasks...</p>;
  }

  if (!tasks.length) {
    return (
      <div className="empty-state">
        <p>No tasks found yet. Add your first task above to get started!</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const startEditing = (task) => {
    setError('');
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      deadline: toInputDate(task.deadline),
      status: task.status,
      priority: task.priority,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setError('');
  };

  const handleSaveEdit = async (e, id) => {
    e.preventDefault();
    setBusyId(id);
    setError('');
    try {
      const { data } = await API.put(`/tasks/${id}`, editForm);
      onTaskUpdated(data);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setBusyId(null);
    }
  };

  const handleQuickComplete = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    setBusyId(task._id);
    setError('');
    try {
      const { data } = await API.put(`/tasks/${task._id}`, { status: nextStatus });
      onTaskUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    setBusyId(id);
    setError('');
    try {
      await API.delete(`/tasks/${id}`);
      onTaskDeleted(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="task-grid">
        {tasks.map((task) => {
          const isEditing = editingId === task._id;
          const isBusy = busyId === task._id;

          if (isEditing) {
            return (
              <form
                key={task._id}
                onSubmit={(e) => handleSaveEdit(e, task._id)}
                className={`task-card priority-${editForm.priority}`}
              >
                <h4>Edit Task</h4>

                <label>
                  Title *
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    rows="2"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </label>

                <label>
                  Deadline *
                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) =>
                      setEditForm({ ...editForm, deadline: e.target.value })
                    }
                    required
                  />
                </label>

                <div className="edit-row">
                  <label>
                    Status
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </label>

                  <label>
                    Priority
                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm({ ...editForm, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                </div>

                <div className="card-actions">
                  <button type="submit" className="btn-sm btn-save" disabled={isBusy}>
                    {isBusy ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-cancel"
                    onClick={cancelEditing}
                    disabled={isBusy}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div key={task._id} className={`task-card priority-${task.priority}`}>
              <div className="task-card-header">
                <span className={`badge status-${task.status}`}>
                  {task.status.replace('-', ' ')}
                </span>
                <span className={`badge priority-tag-${task.priority}`}>
                  {task.priority} priority
                </span>
              </div>

              <h4 className={task.status === 'completed' ? 'task-done-title' : ''}>
                {task.title}
              </h4>
              {task.description && <p className="task-desc">{task.description}</p>}

              <div className="task-footer">
                <span>
                  Due: <strong>{formatDate(task.deadline)}</strong>
                </span>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn-sm btn-complete"
                  onClick={() => handleQuickComplete(task)}
                  disabled={isBusy}
                >
                  {task.status === 'completed' ? 'Reopen' : 'Complete'}
                </button>
                <button
                  type="button"
                  className="btn-sm btn-edit"
                  onClick={() => startEditing(task)}
                  disabled={isBusy}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-sm btn-delete"
                  onClick={() => handleDelete(task._id, task.title)}
                  disabled={isBusy}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}