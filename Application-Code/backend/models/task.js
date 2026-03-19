const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Keep this hidden from standard API responses
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    createdBy: {
      type: String, // Changed to String to simplify initial testing, or use mongoose.Schema.Types.ObjectId
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "archived"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for high-performance searching
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ isDeleted: 1, status: 1 });

taskSchema.methods.markCompleted = function () {
  this.completed = true;
  this.status = "completed";
  return this.save();
};

module.exports = mongoose.model("Task", taskSchema);