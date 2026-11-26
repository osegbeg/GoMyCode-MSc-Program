export default function TaskList({ tasks, loading }) {
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

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <div key={task._id} className={`task-card priority-${task.priority}`}>
          <div className="task-card-header">
            <span className={`badge status-${task.status}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`badge priority-tag-${task.priority}`}>
              {task.priority} priority
            </span>
          </div>

          <h4>{task.title}</h4>
          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-footer">
            <span>Due: <strong>{formatDate(task.deadline)}</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}