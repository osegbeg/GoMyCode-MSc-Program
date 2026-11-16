import React, { useState, useEffect } from 'react';

/**
 * TaskForm Component
 * Handles creating new tasks and editing existing ones with input validation.
 */
function TaskForm({ onAddTask, onUpdateTask, taskToEdit, onCancelEdit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Populate form fields whenever a task is selected for editing
  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description);
      setError('');
    } else {
      setName('');
      setDescription('');
      setError('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure both fields are filled
    if (!name.trim() || !description.trim()) {
      setError('Both task name and description are required.');
      return;
    }

    if (taskToEdit) {
      // Update existing task
      onUpdateTask({
        ...taskToEdit,
        name: name.trim(),
        description: description.trim(),
      });
    } else {
      // Add new task
      onAddTask({
        name: name.trim(),
        description: description.trim(),
      });
    }

    // Clear fields and error message after submission
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="task-name">Task Name</label>
        <input
          id="task-name"
          type="text"
          placeholder="e.g., Complete React Checkpoint"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          rows="3"
          placeholder="Add details about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {taskToEdit ? 'Save Changes' : 'Add Task'}
        </button>

        {taskToEdit && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;