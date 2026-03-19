const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/task");

/**
 * 🔹 HELPER: Async Wrapper
 * Prevents the app from crashing and keeps code clean
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 🔹 HELPER: ID Validation
 * Checks if the ID is a real MongoDB ID before searching
 */
const validateId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Task ID format" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📝 CREATE TASK                                                             */
/* -------------------------------------------------------------------------- */
router.post("/", asyncHandler(async (req, res) => {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: "Task created successfully ✨",
      data: task,
    });
}));

/* -------------------------------------------------------------------------- */
/* 📂 GET ALL TASKS (Search, Filter, Paginate)                                */
/* -------------------------------------------------------------------------- */
router.get("/", asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, priority, search, sort = "-createdAt" } = req.query;
    const query = { isDeleted: false }; // Always hide deleted tasks

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: tasks,
    });
}));

/* -------------------------------------------------------------------------- */
/* 🔍 GET SINGLE TASK                                                        */
/* -------------------------------------------------------------------------- */
router.get("/:id", asyncHandler(async (req, res) => {
    validateId(req.params.id, res);
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
}));

/* -------------------------------------------------------------------------- */
/* ✏️ UPDATE TASK                                                            */
/* -------------------------------------------------------------------------- */
router.put("/:id", asyncHandler(async (req, res) => {
    validateId(req.params.id, res);
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // List of fields we allow the user to change
    const updates = ["title", "description", "completed", "status", "priority", "dueDate", "tags"];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    res.json({ success: true, message: "Task updated ✅", data: task });
}));

/* -------------------------------------------------------------------------- */
/* 🗑️ DELETE TASK (Soft Delete)                                              */
/* -------------------------------------------------------------------------- */
router.delete("/:id", asyncHandler(async (req, res) => {
    validateId(req.params.id, res);
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.softDelete();
    res.json({ success: true, message: "Task moved to trash 🗑️" });
}));

/* -------------------------------------------------------------------------- */
/* ✅ TOGGLE COMPLETE                                                        */
/* -------------------------------------------------------------------------- */
router.patch("/:id/complete", asyncHandler(async (req, res) => {
    validateId(req.params.id, res);
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.markAsCompleted();
    res.json({ success: true, message: "Task marked as done! 🎉", data: task });
}));

/* -------------------------------------------------------------------------- */
/* 📊 STATS & OVERDUE                                                        */
/* -------------------------------------------------------------------------- */
router.get("/stats/overdue", asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        dueDate: { $lt: new Date() },
        completed: false,
        isDeleted: false,
    });

    res.json({ success: true, count: tasks.length, data: tasks });
}));

module.exports = router;