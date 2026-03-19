const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
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

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // later we make it required after auth
    },

    isDeleted: {
      type: Boolean,
      default: false, // soft delete
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//
// 🔥 INDEXES (performance)
//
taskSchema.index({ user: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isDeleted: 1 });

//
// 🔥 MIDDLEWARE (HOOKS)
//

// Before saving
taskSchema.pre("save", function (next) {
  // Auto-set completedAt
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? new Date() : null;
  }

  // Sync status with completed
  if (this.completed) {
    this.status = "completed";
  }

  next();
});

//
// 🔥 STATIC METHODS (model-level logic)
//

// Get all active tasks (not deleted)
taskSchema.statics.getActiveTasks = function (userId) {
  return this.find({ user: userId, isDeleted: false });
};

// Get overdue tasks
taskSchema.statics.getOverdueTasks = function () {
  return this.find({
    dueDate: { $lt: new Date() },
    completed: false,
    isDeleted: false,
  });
};

//
// 🔥 INSTANCE METHODS (document-level logic)
//

// Mark task as completed
taskSchema.methods.markAsCompleted = function () {
  this.completed = true;
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Soft delete
taskSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

//
// 🔥 VIRTUALS (computed fields)
//

// Check if overdue
taskSchema.virtual("isOverdue").get(function () {
  return (
    this.dueDate &&
    this.dueDate < new Date() &&
    !this.completed
  );
});

// Format response (hide internal fields)
taskSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.isDeleted;
    return ret;
  },
});

//
// 🔥 QUERY HELPER
//
taskSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model("Task", taskSchema);
