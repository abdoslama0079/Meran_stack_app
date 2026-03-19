const express = require("express");
const router = express.Router();
const Task = require("../models/task");

//
// 🔥 HELPER: Async wrapper (no try/catch everywhere)
//
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//
// 🔥 CREATE TASK
//
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      tags,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  })
);

//
// 🔥 GET ALL TASKS (pagination + filtering + search)
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

    const query = {};

    // Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Search (title)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Soft delete filter
    query.isDeleted = false;

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
// 🔥 GET SINGLE TASK
//
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

//
// 🔥 UPDATE TASK
//
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "completed",
      "status",
      "priority",
      "dueDate",
      "tags",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.json({
      success: true,
      data: task,
    });
  })
);

//
// 🔥 DELETE TASK (soft delete)
//
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.softDelete();

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  })
);

//
// 🔥 MARK AS COMPLETED
//
router.patch(
  "/:id/complete",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.markAsCompleted();

    res.json({
      success: true,
      data: task,
    });
  })
);

//
// 🔥 GET OVERDUE TASKS
//
router.get(
  "/stats/overdue",
  asyncHandler(async (req, res) => {
    const tasks = await Task.getOverdueTasks();

    res.json({
      success: true,
      results: tasks.length,
      data: tasks,
    });
  })
);

module.exports = router;
