import React from 'react';

/**
 * TaskItem Component
 * Displays a single task with options to complete, edit, or delete.
 */
function TaskItem({ task, onToggleComplete, onEditClick, onDeleteTask }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : 'active'}`}>
      {/* Checkbox to mark task completed/active */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        aria-label={`Mark ${task.name} as ${
          task.completed ? 'active' : 'completed'
        }`}
      />

      {/* Clicking the task content triggers edit mode */}
      <div
        className="task-content"
        onClick={() => onEditClick(task)}
        title="Click to edit task"
      >
        <h3>{task.name}</h3>
        <p>{task.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="task-actions">
        <button
          className="btn-edit"
          onClick={() => onEditClick(task)}
        >
          Edit
        </button>
        <button
          className="btn-delete"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;