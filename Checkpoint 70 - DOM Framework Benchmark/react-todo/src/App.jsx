import { useState } from 'react';

const PRIORITIES = ['Low', 'Medium', 'High'];

function createSampleTasks(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${i}-${Math.random()}`,
    name: `Task #${i + 1}`,
    priority: PRIORITIES[i % PRIORITIES.length],
  }));
}

function measurePaint(fn) {
  const start = performance.now();
  fn();
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve((performance.now() - start).toFixed(2));
      });
    });
  });
}

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 'init-1', name: 'Review sprint backlog', priority: 'High' },
  ]);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [metric, setMetric] = useState('Ready');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      { id: `${Date.now()}-${Math.random()}`, name: trimmed, priority },
      ...prev,
    ]);
    setName('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditPriority(task.priority);
  };

  const saveEdit = (id) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: trimmed, priority: editPriority } : t))
    );
    setEditingId(null);
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const runRenderBenchmark = async (count) => {
    const batch = createSampleTasks(count);
    const ms = await measurePaint(() => setTasks(batch));
    setMetric(`Render ${count} tasks: ${ms} ms`);
  };

  const runUpdate50 = async () => {
    const ms = await measurePaint(() => {
      setTasks((prev) =>
        prev.map((t, idx) =>
          idx < 50
            ? { ...t, name: `${t.name} [Updated]`, priority: idx % 2 === 0 ? 'High' : 'Low' }
            : t
        )
      );
    });
    setMetric(`Update up to 50 tasks: ${ms} ms`);
  };

  const runDelete50 = async () => {
    const ms = await measurePaint(() => {
      setTasks((prev) => prev.slice(50));
    });
    setMetric(`Delete up to 50 tasks: ${ms} ms`);
  };

  return (
    <main style={{ maxWidth: 760, margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1>React To-Do Benchmark</h1>
      <p><strong>Last Benchmark:</strong> {metric} | <strong>Total Tasks:</strong> {tasks.length}</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" onClick={() => runRenderBenchmark(100)}>Seed 100</button>
        <button type="button" onClick={() => runRenderBenchmark(500)}>Seed 500</button>
        <button type="button" onClick={() => runRenderBenchmark(1000)}>Seed 1000</button>
        <button type="button" onClick={runUpdate50}>Update 50</button>
        <button type="button" onClick={runDelete50}>Delete 50</button>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New task name..."
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <button type="submit">Add Task</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
            {editingId === task.id ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <button type="button" onClick={() => saveEdit(task.id)}>Save</button>
                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span><strong>{task.name}</strong> — <em>{task.priority}</em></span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" onClick={() => startEdit(task)}>Edit</button>
                  <button type="button" onClick={() => removeTask(task.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
