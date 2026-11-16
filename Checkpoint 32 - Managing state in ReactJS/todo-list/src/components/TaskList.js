import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * Renders a list of TaskItem components or an empty state message.
 */
function TaskList({ tasks, onToggleComplete, onEditClick, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditClick={onEditClick}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default TaskList;