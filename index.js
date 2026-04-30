require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');

const { requestLogger, requestTimer, corsMiddleware, apiLimiter } = require('./middleware/loggingMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
const setupSocketIO = require('./sockets/expenseSocket');
const initPostgres = require('./config/postgres-init');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    credentials: true
  }
});

connectDB();
initPostgres();

app.use(corsMiddleware);
app.use(requestTimer);
app.use(requestLogger);
app.use(apiLimiter(100, 15 * 60 * 1000));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

sessionConfig(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use((req, res, next) => {
  console.log(`Serving: ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/expenses', require('./routes/expenseRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/files', require('./routes/fileRoutes'));
app.use('/api', require('./routes/apiRoutes'));
app.use('/', require('./routes/viewRoutes'));
app.use('/api', require('./routes/postgresRoutes'));

app.use(notFoundHandler);
app.use(errorHandler);

setupSocketIO(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving static files from /public`);
  console.log(`✓ EJS views enabled`);
  console.log(`✓ Socket.IO enabled`);
  console.log(`✓ All middleware active`);
  console.log(`✓ File streaming enabled`);

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const logFile = path.join(dataDir, 'activity.log');
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `[${new Date().toISOString()}] Server started\n`);
  }
});
