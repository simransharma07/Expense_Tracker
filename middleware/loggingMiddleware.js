const fs = require('fs');
const path = require('path');
const requestLogger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}\n`;
  
  console.log(logMessage.trim());
  const logPath = path.join(__dirname, '../data/activity.log');
  const logStream = fs.createWriteStream(logPath, { flags: 'a' }); 
  
  logStream.write(logMessage);
  logStream.end();
  
  next();
};

const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`Request to ${req.url} took ${duration}ms`);
  });
  
  next();
};
const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, userid');
  
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
