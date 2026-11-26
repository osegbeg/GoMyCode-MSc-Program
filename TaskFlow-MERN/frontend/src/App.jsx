import { useEffect, useState } from 'react';
import API from './api';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('taskflowUser') || 'null')
  );
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const fetchTasks = async () => {
    if (!user) return;
    setLoadingTasks(true);
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('taskflowUser');
    setUser(null);
    setTasks([]);
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((task) => task._id !== deletedId));
  };

  if (!user) {
    return (
      <div className="app-shell auth-wrapper">
        <AuthForm onAuthSuccess={(userData) => setUser(userData)} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>TaskFlow</h1>
          <span className="tagline">Personal Workflow & Deadline Manager</span>
        </div>
        <div className="user-controls">
          <span>
            Hi, <strong>{user.name}</strong>
          </span>
          <button onClick={handleLogout} className="btn-outline">
            Log Out
          </button>
        </div>
      </header>

      <main className="main-container">
        <TaskForm onTaskCreated={handleTaskCreated} />

        <section className="list-section">
          <div className="section-header">
            <h3>Your Tasks ({tasks.length})</h3>
          </div>
          <TaskList
            tasks={tasks}
            loading={loadingTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </section>
      </main>
    </div>
  );
}