const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline, status, priority } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      status,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data', error: error.message });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;