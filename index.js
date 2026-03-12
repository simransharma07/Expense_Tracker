const express = require('express');
const path = require('path');
const fs = require('fs');


const { requestLogger, requestTimer, corsMiddleware } = require('./middleware/loggingMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();


app.use(corsMiddleware);       
app.use(requestTimer);         
app.use(requestLogger); 
app.use(express.json());                          
app.use(express.urlencoded({ extended: true }));  


app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  console.log(`Serving: ${req.method} ${req.path}`);
  next();
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/auth', require('./routes/authRoutes'));
app.use('/expenses', require('./routes/expenseRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/files', require('./routes/fileRoutes')); 


app.get('/api/info', (req, res) => {
  res.send('Expense Tracker API - Version 1.0');
});


app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/download-sample', (req, res) => {
  const samplePath = path.join(__dirname, 'data', 'expenses.json');
  res.sendFile(samplePath);
});
app.get('/api/test-error', (req, res, next) => {
  const error = new Error('This is a test error');
  error.statusCode = 400;
  next(error);
});
app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving static files from /public`);
  console.log(`✓ All middleware active`);
  console.log(`✓ File streaming enabled`);
  
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  const logFile = path.join(dataDir, 'activity.log');
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `[${new Date().toISOString()}] Server started\n`);
  }
});

