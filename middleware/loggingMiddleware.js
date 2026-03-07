const fs = require('fs');
const path = require('path');

// APPLICATION-LEVEL MIDDLEWARE - Request logging (from syllabus)
const requestLogger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}\n`;
  
  console.log(logMessage.trim());
  
  // Write to log file using File Module and Streams (from syllabus)
  const logPath = path.join(__dirname, '../data/activity.log');
  const logStream = fs.createWriteStream(logPath, { flags: 'a' }); // append mode
  
  logStream.write(logMessage);
  logStream.end();
  
  next();
};

// APPLICATION-LEVEL MIDDLEWARE - Request timing
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  // Log response time after response is sent
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`Request to ${req.url} took ${duration}ms`);
  });
  
  next();
};

// THIRD-PARTY LIKE MIDDLEWARE - CORS handling
const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, userid');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

module.exports = {
  requestLogger,
  requestTimer,
  corsMiddleware
};
