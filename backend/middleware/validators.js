/**
 * Input Validation Middleware
 * Provides comprehensive validation for all API inputs
 */

const { ValidationError } = require('./errorHandler');

/**
 * Sanitize and validate email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string - trim and escape basic XSS
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Validate signup request body
 */
const validateSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }
    // Optional: Add password strength requirements
    // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    //   errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    // }
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate login request body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors,
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validate task creation request body
 */
const validateTask = (req, res, next) => {
  const { title, description, priority, status, dueDate } = req.body;
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string') {
    errors.push('Title is required');
  } else if (title.trim().length < 1) {
    errors.push('Title cannot be empty');
  } else if (title.trim().length > 200) {
    errors.push('Title cannot exceed 200 characters');
  }

  // Description validation (optional)
  if (description && typeof description === 'string' && description.length > 2000) {
    errors.push('Description cannot exceed 2000 characters');
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  // Status validation
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    errors.push('Status must be one of: pending, in-progress, completed');
  }

  // Due date validation
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize inputs
  req.body.title = sanitizeString(title);
  if (description) req.body.description = sanitizeString(description);

  next();
};

/**
 * Validate profile update request body
 */
const validateProfileUpdate = (req, res, next) => {
  const { name, bio, avatar } = req.body;
  const errors = [];

  // Name validation
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (name.trim().length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }
  }

  // Bio validation
  if (bio !== undefined && typeof bio === 'string' && bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters');
  }

  // Avatar URL validation
  if (avatar !== undefined && avatar !== '') {
    try {
      new URL(avatar);
    } catch {
      errors.push('Avatar must be a valid URL');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize inputs
  if (name) req.body.name = sanitizeString(name);
  if (bio) req.body.bio = sanitizeString(bio);

  next();
};

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!id || !objectIdRegex.test(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID format',
      });
    }

    next();
  };
};

/**
 * Rate limiting by IP (simple in-memory implementation)
 * For production, use Redis-based rate limiting
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // max requests per window
    message = 'Too many requests, please try again later',
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = rateLimitStore.get(key);

    if (now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      res.set('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        status: 'fail',
        message,
      });
    }

    record.count++;
    next();
  };
};

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

module.exports = {
  validateSignup,
  validateLogin,
  validateTask,
  validateProfileUpdate,
  validateObjectId,
  rateLimit,
  sanitizeString,
  isValidEmail,
};
