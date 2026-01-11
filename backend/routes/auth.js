const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authMiddleware } = require('../middleware/auth');
const { validateSignup, validateLogin, rateLimit } = require('../middleware/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', 
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many signup attempts' }),
  validateSignup,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        status: 'fail',
        message: 'An account with this email already exists' 
      });
    }

    // Create user (password is hashed automatically via pre-save hook)
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password 
    });
    await user.save();

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email 
    });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts. Please try again later.' }),
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and explicitly select password (excluded by default for security)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Invalid email or password' 
      });
    }

    // Check password using bcrypt comparison
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email 
    });

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  res.json({
    status: 'success',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
}));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Private
 */
router.post('/refresh', authMiddleware, asyncHandler(async (req, res) => {
  const token = generateToken({ 
    id: req.user.id, 
    email: req.user.email 
  });

  res.json({
    status: 'success',
    message: 'Token refreshed successfully',
    token,
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint is for logging purposes and future token blacklisting
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

module.exports = router;
