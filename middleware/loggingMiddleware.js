const path = require('fs').promises;
const fs = require('fs');
const pathModule = require('path');

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.path} - ${req.ip}\n`;

  const dataDir = pathModule.join(__dirname, '../data');
  const logFile = pathModule.join(dataDir, 'activity.log');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Log write error:', err);
  });

  console.log(`→ ${req.method} ${req.path}`);
  next();
};

const requestTimer = (req, res, next) => {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`← ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

const apiLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const ipRequests = requests.get(ip).filter(time => time > windowStart);

    if (ipRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }

    ipRequests.push(now);
    requests.set(ip, ipRequests);

    next();
  };
};

module.exports = {
  requestLogger,
  requestTimer,
  corsMiddleware,
  apiLimiter
};
