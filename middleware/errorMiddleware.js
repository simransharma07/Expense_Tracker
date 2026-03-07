// ERROR-HANDLING MIDDLEWARE (from syllabus)
// Must have 4 parameters (err, req, res, next)

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Pass to error handler
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError
};
