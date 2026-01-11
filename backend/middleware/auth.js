const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'primetrade-api',
    audience: 'primetrade-client',
  });
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'primetrade-api',
    audience: 'primetrade-client',
  });
};

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access denied. Invalid token format.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists (optional but recommended)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists.',
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your session has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Authentication failed.',
    });
  }
};

/**
 * Optional Auth Middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
