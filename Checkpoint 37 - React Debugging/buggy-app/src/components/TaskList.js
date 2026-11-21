import React, { useState } from 'react';

function TaskList({ initialTasks = [] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // FIX 2: Create a new array using spread syntax so React detects the state update and re-renders
    setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
    setNewTask('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '12px' }}>
      <h3>Sprint Tasks ({tasks.length})</h3>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;