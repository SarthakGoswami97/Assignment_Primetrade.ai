const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validators');
const { asyncHandler, NotFoundError } = require('../middleware/errorHandler');

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.json({
    status: 'success',
    data: user,
  });
}));

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', 
  authMiddleware, 
  validateProfileUpdate,
  asyncHandler(async (req, res) => {
    const { name, bio, avatar } = req.body;
    
    // Build update object with only provided fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    updateFields.updatedAt = Date.now();
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update localStorage user data on client
    res.json({ 
      status: 'success',
      message: 'Profile updated successfully', 
      data: user,
    });
  })
);

/**
 * @route   PUT /api/user/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide current password, new password, and confirmation',
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'New passwords do not match',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password must be at least 6 characters',
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isValidPassword = await user.comparePassword(currentPassword);
  if (!isValidPassword) {
    return res.status(401).json({
      status: 'fail',
      message: 'Current password is incorrect',
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    status: 'success',
    message: 'Password updated successfully',
  });
}));

/**
 * @route   DELETE /api/user/account
 * @desc    Delete user account and all associated data
 * @access  Private
 */
router.delete('/account', authMiddleware, asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your password to confirm account deletion',
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({
      status: 'fail',
      message: 'Password is incorrect',
    });
  }

  // Delete user's tasks
  const Task = require('../models/Task');
  await Task.deleteMany({ userId: user._id });

  // Delete user
  await User.findByIdAndDelete(user._id);

  res.json({
    status: 'success',
    message: 'Account deleted successfully',
  });
}));

module.exports = router;
