const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createTask,
  toggleTaskCompletion,
  filterByPriority,
} = require('../src/taskManager');

describe('Task Manager Core Functions', () => {
  it('creates a task with trimmed title and valid priority', () => {
    const task = createTask('  Write CI workflow  ', 'High');
    assert.equal(task.title, 'Write CI workflow');
    assert.equal(task.priority, 'High');
    assert.equal(task.completed, false);
    assert.ok(task.id);
  });

  it('throws an error when task title is empty', () => {
    assert.throws(() => createTask('   '), /Task title is required/);
  });

  it('falls back to Medium priority for unknown priority values', () => {
    const task = createTask('Check linter rules', 'Urgent');
    assert.equal(task.priority, 'Medium');
  });

  it('toggles task completion status immutably', () => {
    const original = createTask('Review pull request', 'Low');
    const toggled = toggleTaskCompletion(original);
    assert.equal(toggled.completed, true);
    assert.equal(original.completed, false);
  });

  it('filters tasks by priority level', () => {
    const tasks = [
      createTask('Task A', 'High'),
      createTask('Task B', 'Low'),
      createTask('Task C', 'High'),
    ];
    const highTasks = filterByPriority(tasks, 'High');
    assert.equal(highTasks.length, 2);
  });
});
