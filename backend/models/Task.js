const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status must be one of: pending, in-progress, completed',
    },
    default: 'pending',
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be one of: low, medium, high',
    },
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true, // Index for faster queries by user
  },
  completedAt: {
    type: Date,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50,
  }],
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound index for common queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Pre-save middleware to set completedAt
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = null;
  }
  next();
});

// Pre-update middleware for findOneAndUpdate
taskSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.status === 'completed') {
    update.completedAt = new Date();
  } else if (update.status && update.status !== 'completed') {
    update.completedAt = null;
  }
  next();
});

// Static method to get tasks by status
taskSchema.statics.findByStatus = function(userId, status) {
  return this.find({ userId, status }).sort({ createdAt: -1 });
};

// Static method to get overdue tasks
taskSchema.statics.findOverdue = function(userId) {
  return this.find({
    userId,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() },
  }).sort({ dueDate: 1 });
};

module.exports = mongoose.model('Task', taskSchema);
