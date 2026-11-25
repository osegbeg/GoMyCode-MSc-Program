<script setup>
import { ref } from 'vue';

const priorities = ['Low', 'Medium', 'High'];
const tasks = ref([{ id: 'init-1', name: 'Review sprint backlog', priority: 'High' }]);
const name = ref('');
const priority = ref('Medium');
const editingId = ref(null);
const editName = ref('');
const editPriority = ref('Medium');
const metric = ref('Ready');

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

function addTask() {
  const trimmed = name.value.trim();
  if (!trimmed) return;
  tasks.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    name: trimmed,
    priority: priority.value,
  });
  name.value = '';
}

function startEdit(task) {
  editingId.value = task.id;
  editName.value = task.name;
  editPriority.value = task.priority;
}

function saveEdit(id) {
  const trimmed = editName.value.trim();
  if (!trimmed) return;
  const target = tasks.value.find((t) => t.id === id);
  if (target) {
    target.name = trimmed;
    target.priority = editPriority.value;
  }
  editingId.value = null;
}

function removeTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
}

async function runRenderBenchmark(count) {
  const ms = await measurePaint(() => {
    tasks.value = createSampleTasks(count);
  });
  metric.value = `Render ${count} tasks: ${ms} ms`;
}

async function runUpdate50() {
  const ms = await measurePaint(() => {
    tasks.value.slice(0, 50).forEach((t, idx) => {
      t.name = `${t.name} [Updated]`;
      t.priority = idx % 2 === 0 ? 'High' : 'Low';
    });
  });
  metric.value = `Update up to 50 tasks: ${ms} ms`;
}

async function runDelete50() {
  const ms = await measurePaint(() => {
    tasks.value = tasks.value.slice(50);
  });
  metric.value = `Delete up to 50 tasks: ${ms} ms`;
}
</script>

<template>
  <main style="max-width: 760px; margin: 2rem auto; font-family: sans-serif; padding: 0 1rem;">
    <h1>Vue To-Do Benchmark</h1>
    <p><strong>Last Benchmark:</strong> {{ metric }} | <strong>Total Tasks:</strong> {{ tasks.length }}</p>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
      <button type="button" @click="runRenderBenchmark(100)">Seed 100</button>
      <button type="button" @click="runRenderBenchmark(500)">Seed 500</button>
      <button type="button" @click="runRenderBenchmark(1000)">Seed 1000</button>
      <button type="button" @click="runUpdate50">Update 50</button>
      <button type="button" @click="runDelete50">Delete 50</button>
    </div>

    <form @submit.prevent="addTask" style="display: flex; gap: 8px; margin-bottom: 16px;">
      <input v-model="name" placeholder="New task name..." required />
      <select v-model="priority">
        <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
      </select>
      <button type="submit">Add Task</button>
    </form>

    <ul v-if="tasks.length > 0" style="list-style: none; padding: 0;">
      <li
        v-for="task in tasks"
        :key="task.id"
        style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"
      >
        <div v-if="editingId === task.id" style="display: flex; gap: 8px;">
          <input v-model="editName" />
          <select v-model="editPriority">
            <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
          </select>
          <button type="button" @click="saveEdit(task.id)">Save</button>
          <button type="button" @click="editingId = null">Cancel</button>
        </div>
        <template v-else>
          <span><strong>{{ task.name }}</strong> — <em>{{ task.priority }}</em></span>
          <div style="display: flex; gap: 6px;">
            <button type="button" @click="startEdit(task)">Edit</button>
            <button type="button" @click="removeTask(task.id)">Delete</button>
          </div>
        </template>
      </li>
    </ul>
  </main>
</template>
