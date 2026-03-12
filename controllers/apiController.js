const path = require('path');

exports.getInfo = (req, res) => {
  res.send('Expense Tracker API - Version 1.0');
};

exports.getStatus = (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

exports.downloadSample = (req, res) => {
  const samplePath = path.join(__dirname, '..', 'data', 'expenses.json');
  res.sendFile(samplePath);
};

exports.testError = (req, res, next) => {
  const error = new Error('This is a test error');
  error.statusCode = 400;
  next(error);
};
