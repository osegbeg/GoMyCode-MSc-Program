import { useEffect, useMemo, useState } from 'react';
import API from './api';
import AuthForm from './components/AuthForm';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const PRIORITY_WEIGHT = {
  high: 1,
  medium: 2,
  low: 3,
};

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('taskflowUser') || 'null')
  );
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Phase 5: Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  // Compute filtered & sorted list cleanly
  const visibleTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesStatus =
          statusFilter === 'all' || task.status === statusFilter;
        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (sortBy === 'priority') {
          return (PRIORITY_WEIGHT[a.priority] || 99) - (PRIORITY_WEIGHT[b.priority] || 99);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, searchQuery, statusFilter, sortBy]);

  // Quick summary counts
  const counts = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

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
        <div className="stats-strip">
          <div className="stat-pill">
            <span>Total</span>
            <strong>{counts.total}</strong>
          </div>
          <div className="stat-pill">
            <span>Pending</span>
            <strong>{counts.pending}</strong>
          </div>
          <div className="stat-pill">
            <span>In Progress</span>
            <strong>{counts.inProgress}</strong>
          </div>
          <div className="stat-pill">
            <span>Completed</span>
            <strong>{counts.completed}</strong>
          </div>
        </div>

        <TaskForm onTaskCreated={handleTaskCreated} />

        <section className="list-section">
          <div className="section-header">
            <h3>
              Showing {visibleTasks.length} of {tasks.length} Tasks
            </h3>
          </div>

          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          <TaskList
            tasks={visibleTasks}
            loading={loadingTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </section>
      </main>
    </div>
  );
}