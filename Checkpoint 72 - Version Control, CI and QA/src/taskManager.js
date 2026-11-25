const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

function createTask(title, priority = 'Medium') {
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Task title is required');
  }
  const normalizedPriority = VALID_PRIORITIES.includes(priority) ? priority : 'Medium';
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    priority: normalizedPriority,
    completed: false,
  };
}

function toggleTaskCompletion(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Valid task object is required');
  }
  return {
    ...task,
    completed: !task.completed,
  };
}

function filterByPriority(tasks, priority) {
  if (!Array.isArray(tasks)) {
    return [];
  }
  return tasks.filter((item) => item.priority === priority);
}

module.exports = {
  VALID_PRIORITIES,
  createTask,
  toggleTaskCompletion,
  filterByPriority,
};
