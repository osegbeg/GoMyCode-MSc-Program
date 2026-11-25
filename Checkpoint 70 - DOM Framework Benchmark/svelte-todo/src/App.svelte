<script>
  const priorities = ['Low', 'Medium', 'High'];
  let tasks = [{ id: 'init-1', name: 'Review sprint backlog', priority: 'High' }];
  let name = '';
  let priority = 'Medium';
  let editingId = null;
  let editName = '';
  let editPriority = 'Medium';
  let metric = 'Ready';

  function createSampleTasks(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      name: `Task #${i + 1}`,
      priority: priorities[i % priorities.length],
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

  function addTask(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    tasks = [{ id: `${Date.now()}-${Math.random()}`, name: trimmed, priority }, ...tasks];
    name = '';
  }

  function startEdit(task) {
    editingId = task.id;
    editName = task.name;
    editPriority = task.priority;
  }

  function saveEdit(id) {
    const trimmed = editName.trim();
    if (!trimmed) return;
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, name: trimmed, priority: editPriority } : t
    );
    editingId = null;
  }

  function removeTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
  }

  async function runRenderBenchmark(count) {
    const batch = createSampleTasks(count);
    const ms = await measurePaint(() => {
      tasks = batch;
    });
    metric = `Render ${count} tasks: ${ms} ms`;
  }

  async function runUpdate50() {
    const ms = await measurePaint(() => {
      tasks = tasks.map((t, idx) =>
        idx < 50
          ? { ...t, name: `${t.name} [Updated]`, priority: idx % 2 === 0 ? 'High' : 'Low' }
          : t
      );
    });
    metric = `Update up to 50 tasks: ${ms} ms`;
  }

  async function runDelete50() {
    const ms = await measurePaint(() => {
      tasks = tasks.slice(50);
    });
    metric = `Delete up to 50 tasks: ${ms} ms`;
  }
</script>

<main style="max-width: 760px; margin: 2rem auto; font-family: sans-serif; padding: 0 1rem;">
  <h1>Svelte To-Do Benchmark</h1>
  <p><strong>Last Benchmark:</strong> {metric} | <strong>Total Tasks:</strong> {tasks.length}</p>

  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
    <button type="button" on:click={() => runRenderBenchmark(100)}>Seed 100</button>
    <button type="button" on:click={() => runRenderBenchmark(500)}>Seed 500</button>
    <button type="button" on:click={() => runRenderBenchmark(1000)}>Seed 1000</button>
    <button type="button" on:click={runUpdate50}>Update 50</button>
    <button type="button" on:click={runDelete50}>Delete 50</button>
  </div>

  <form on:submit={addTask} style="display: flex; gap: 8px; margin-bottom: 16px;">
    <input bind:value={name} placeholder="New task name..." required />
    <select bind:value={priority}>
      {#each priorities as p}
        <option value={p}>{p}</option>
      {/each}
    </select>
    <button type="submit">Add Task</button>
  </form>

  {#if tasks.length > 0}
    <ul style="list-style: none; padding: 0;">
      {#each tasks as task (task.id)}
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          {#if editingId === task.id}
            <div style="display: flex; gap: 8px;">
              <input bind:value={editName} />
              <select bind:value={editPriority}>
                {#each priorities as p}
                  <option value={p}>{p}</option>
                {/each}
              </select>
              <button type="button" on:click={() => saveEdit(task.id)}>Save</button>
              <button type="button" on:click={() => (editingId = null)}>Cancel</button>
            </div>
          {:else}
            <span><strong>{task.name}</strong> — <em>{task.priority}</em></span>
            <div style="display: flex; gap: 6px;">
              <button type="button" on:click={() => startEdit(task)}>Edit</button>
              <button type="button" on:click={() => removeTask(task.id)}>Delete</button>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</main>
