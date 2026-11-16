import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  // Lazy initialize state from localStorage so existing tasks load immediately
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Track which task is currently being edited (null if adding a new task)
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Filter state ('all', 'active', 'completed') - Bonus feature
  const [filter, setFilter] = useState('all');

  // Sync tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskData.name,
      description: taskData.description,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  // Update an existing task
  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null); // Exit edit mode
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task with a browser confirmation prompt
  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    );
    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
      // If the user deletes the task currently open in the edit form, reset the form
      if (taskToEdit && taskToEdit.id === id) {
        setTaskToEdit(null);
      }
    }
  };

  // Filter tasks based on selected status
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Stay organized and track your daily goals</p>
      </header>

      {/* Form handles both adding and updating tasks */}
      <TaskForm
        onAddTask={addTask}
        onUpdateTask={updateTask}
        taskToEdit={taskToEdit}
        onCancelEdit={() => setTaskToEdit(null)}
      />

      {/* Filter Controls */}
      <div className="filter-bar">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Task List Display */}
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleComplete}
        onEditClick={setTaskToEdit}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;