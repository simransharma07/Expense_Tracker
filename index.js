const express = require('express');
const path = require('path');
const fs = require('fs');

// Import middleware
const { requestLogger, requestTimer, corsMiddleware } = require('./middleware/loggingMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// ========== MIDDLEWARE LIFECYCLE (from syllabus) ==========

// 1. APPLICATION-LEVEL MIDDLEWARE
app.use(corsMiddleware);        // CORS handling (third-party like)
app.use(requestTimer);          // Request timing
app.use(requestLogger);         // Request logging with file streams

// 2. Built-in Express middleware
app.use(express.json());                           // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));   // Parse URL-encoded bodies

// 3. SERVING STATIC FILES (from syllabus)
app.use(express.static(path.join(__dirname, 'public')));

// Custom middleware to log static file requests
app.use((req, res, next) => {
  console.log(`Serving: ${req.method} ${req.path}`);
  next();
});

// ========== ROUTING (from syllabus) ==========

// Root route - Landing page
app.get('/', (req, res) => {
  // Using res.sendFile() - Response Method from syllabus
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ROUTER-LEVEL MIDDLEWARE - Mount routers
app.use('/auth', require('./routes/authRoutes'));
app.use('/expenses', require('./routes/expenseRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/files', require('./routes/fileRoutes'));  // New file operations route

// ========== DIFFERENT RESPONSE METHODS (from syllabus) ==========

// Demonstrate res.send()
app.get('/api/info', (req, res) => {
  res.send('Expense Tracker API - Version 1.0');
});

// Demonstrate res.json()
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Demonstrate res.sendFile() for file download
app.get('/api/download-sample', (req, res) => {
  const samplePath = path.join(__dirname, 'data', 'expenses.json');
  res.sendFile(samplePath);
});

// ========== HANDLING EXCEPTIONS (from syllabus) ==========

// Route with intentional error for demonstration
app.get('/api/test-error', (req, res, next) => {
  const error = new Error('This is a test error');
  error.statusCode = 400;
  next(error); // Pass to error handler
});

// ========== ERROR-HANDLING MIDDLEWARE (from syllabus) ==========

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last, has 4 parameters
app.use(errorHandler);

// ========== SERVER STARTUP ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving static files from /public`);
  console.log(`✓ All middleware active`);
  console.log(`✓ File streaming enabled`);
  
  // Ensure data directory and files exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Initialize log files
  const logFile = path.join(dataDir, 'activity.log');
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `[${new Date().toISOString()}] Server started\n`);
  }
});

