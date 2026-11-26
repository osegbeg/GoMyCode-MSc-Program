const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT protection to all task routes
router.use(protect);

// @desc    Get logged-in user's tasks (with optional filter & sort)
// @route   GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { status, search, sortBy } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'deadline') sortOption = { deadline: 1 };
    if (sortBy === 'priority') sortOption = { priority: 1 };

    const tasks = await Task.find(query).sort(sortOption);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
});

// @desc    Create a new task for logged-in user
// @route   POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline, status, priority } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    const task = await Task.create({
      user: req.user._id,
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

// @desc    Update a task owned by logged-in user
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// @desc    Delete a task owned by logged-in user
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;