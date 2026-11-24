const taskStore = require("../models/taskStore");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return next(new AppError("Task title is required.", 400));
  }

  const task = taskStore.create({
    title: title.trim(),
    description: description ? String(description).trim() : "",
    ownerId: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { task },
  });
});

exports.getMyTasks = catchAsync(async (req, res, next) => {
  const tasks = taskStore.findAllByOwner(req.user.id);

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = taskStore.findById(req.params.id);

  if (!task) {
    return next(new AppError("No task found with that ID.", 404));
  }

  // Enforce strict ownership access control
  if (task.ownerId !== req.user.id) {
    return next(new AppError("Forbidden: You do not have permission to delete this task.", 403));
  }

  taskStore.deleteById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully.",
  });
});