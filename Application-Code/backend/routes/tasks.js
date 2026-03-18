const express = require("express");
const router = express.Router();
const Task = require("../models/task");

//
// 🔹 HELPER: Async wrapper
//
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//
// 🔹 Middleware: Validate ObjectId
//
const validateObjectId = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID format",
    });
  }
  next();
};

//
// 🔹 CREATE TASK
//
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate, tags, createdBy } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      tags,
      createdBy,
    });

    res.status(201).json({ success: true, data: task });
  })
);

//
// 🔹 GET ALL TASKS (pagination + filtering + search)
//
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sort = "-createdAt",
    } = req.query;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.$text = { $search: search }; // full-text search

    const tasks = await Task.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      results: tasks.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: tasks,
    });
  })
);

//
// 🔹 GET SINGLE TASK
//
router.get(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  })
);

//
// 🔹 UPDATE TASK
//
router.put(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "completed",
      "status",
      "priority",
      "dueDate",
      "tags",
      "reminder",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.json({ success: true, data: task });
  })
);

//
// 🔹 DELETE TASK (soft delete)
//
router.delete(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.isDeleted = true;
    await task.save();

    res.json({ success: true, message: "Task deleted successfully" });
  })
);

//
// 🔹 MARK AS COMPLETED
//
router.patch(
  "/:id/complete",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.markCompleted();

    res.json({ success: true, data: task });
  })
);

//
// 🔹 ADD TAG TO TASK
//
router.patch(
  "/:id/add-tag",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const { tag } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.addTag(tag);

    res.json({ success: true, data: task });
  })
);

//
// 🔹 GET OVERDUE TASKS
//
router.get(
  "/stats/overdue",
  asyncHandler(async (req, res) => {
    const tasks = await Task.findOverdue();

    res.json({ success: true, results: tasks.length, data: tasks });
  })
);

//
// 🔹 GET TASKS BY TAG
//
router.get(
  "/stats/tag/:tag",
  asyncHandler(async (req, res) => {
    const tasks = await Task.findByTag(req.params.tag);

    res.json({ success: true, results: tasks.length, data: tasks });
  })
);

module.exports = router;
