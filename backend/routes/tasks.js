const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authMiddleware } = require('../middleware/auth');
const { validateTask, validateObjectId } = require('../middleware/validators');
const { asyncHandler, NotFoundError } = require('../middleware/errorHandler');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user with filters
 * @access  Private
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { 
    status, 
    priority, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    page = 1,
    limit = 50 
  } = req.query;
  
  // Build filter object
  const filter = { userId: req.user.id };
  
  if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
    filter.status = status;
  }
  
  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    filter.priority = priority;
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // Execute query with pagination
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    Task.countDocuments(filter)
  ]);

  res.json({
    status: 'success',
    results: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: tasks,
  });
}));

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for authenticated user
 * @access  Private
 */
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { userId: req.user.id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
      }
    }
  ]);

  const taskStats = stats[0] || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
  };

  res.json({
    status: 'success',
    data: taskStats,
  });
}));

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id', 
  authMiddleware, 
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    
    res.json({
      status: 'success',
      data: task,
    });
  })
);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', 
  authMiddleware, 
  validateTask,
  asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate, status } = req.body;

    const task = new Task({
      title,
      description: description || '',
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    await task.save();
    
    res.status(201).json({ 
      status: 'success',
      message: 'Task created successfully', 
      data: task,
    });
  })
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', 
  authMiddleware, 
  validateObjectId('id'),
  validateTask,
  asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        title, 
        description, 
        status, 
        priority, 
        dueDate, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ 
      status: 'success',
      message: 'Task updated successfully', 
      data: task,
    });
  })
);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status only
 * @access  Private
 */
router.patch('/:id/status', 
  authMiddleware, 
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status must be one of: pending, in-progress, completed',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ 
      status: 'success',
      message: 'Task status updated', 
      data: task,
    });
  })
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', 
  authMiddleware, 
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ 
      status: 'success',
      message: 'Task deleted successfully',
    });
  })
);

/**
 * @route   DELETE /api/tasks
 * @desc    Delete all completed tasks
 * @access  Private
 */
router.delete('/', authMiddleware, asyncHandler(async (req, res) => {
  const result = await Task.deleteMany({
    userId: req.user.id,
    status: 'completed',
  });

  res.json({ 
    status: 'success',
    message: `${result.deletedCount} completed tasks deleted`,
    deletedCount: result.deletedCount,
  });
}));

module.exports = router;
