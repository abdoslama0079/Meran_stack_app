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
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"], // added "urgent"
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Due date must be in the future",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reminder: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.dueDate || value < this.dueDate;
        },
        message: "Reminder must be before the due date",
      },
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

// 🔹 Indexes
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ dueDate: 1, priority: 1 });
taskSchema.index({ status: 1 });

// 🔹 Instance methods
taskSchema.methods.markCompleted = function () {
  this.completed = true;
  this.status = "completed";
  return this.save();
};

taskSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

// 🔹 Static methods
taskSchema.statics.findByTag = function (tag) {
  return this.find({ tags: tag.toLowerCase() });
};

taskSchema.statics.findOverdue = function () {
  return this.find({ dueDate: { $lt: Date.now() }, completed: false });
};

// 🔹 Middleware hooks
taskSchema.pre("save", function (next) {
  if (!this.title) {
    this.title = "Untitled Task";
  }
  if (this.completed) {
    this.status = "completed";
  }
  next();
});

taskSchema.post("save", function (doc) {
  console.log(`✅ Task "${doc.title}" saved at ${doc.createdAt}`);
});

taskSchema.post("remove", function (doc) {
  console.log(`🗑️ Task "${doc.title}" was deleted`);
});

module.exports = mongoose.model("Task", taskSchema);
