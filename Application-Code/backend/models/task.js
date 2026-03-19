const mongoose = require("mongoose");

/**
 * 🔹 TASK SCHEMA 🔹
 * Designed for High Performance & Soft Deletes
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
      index: true, // Speeds up searches by title
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description too long"],
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    tags: [{ type: String, trim: true }],

    // 🔹 Ownership (For future Azure AD/Auth integration)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 🔹 Soft Delete logic (Keeps data safe in DB but hidden from App)
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Hidden by default from API results
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, // Ensures "isOverdue" shows up in the browser
    toObject: { virtuals: true }
  }
);

/* -------------------------------------------------------------------------- */
/* 🔥 PERFORMANCE                              */
/* -------------------------------------------------------------------------- */

// Indexes make searching 100x faster when your DB grows
taskSchema.index({ status: 1, isDeleted: 1 });
taskSchema.index({ dueDate: 1 });

/* -------------------------------------------------------------------------- */
/* 🔥 SMART LOGIC                               */
/* -------------------------------------------------------------------------- */

// 🔹 MIDDLEWARE: Runs automatically before every "save"
taskSchema.pre("save", function (next) {
  // 1. Sync completed date
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? new Date() : null;
    if (this.completed) this.status = "completed";
  }
  next();
});

// 🔹 VIRTUALS: Computed values that don't take up space in the DB
taskSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.dueDate < new Date() && !this.completed;
});

/* -------------------------------------------------------------------------- */
/* 🔥 HELPER METHODS                            */
/* -------------------------------------------------------------------------- */

// Mark task as done
taskSchema.methods.markAsCompleted = function () {
  this.completed = true;
  this.status = "completed";
  return this.save();
};

// Soft delete
taskSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

module.exports = mongoose.model("Task", taskSchema);