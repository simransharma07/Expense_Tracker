const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';

const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id}`);

    socket.on('authenticate', async (data) => {
      try {
        const { token } = data;
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.userId = decoded.id;
        socket.join(`user:${decoded.id}`);
        console.log(`✓ User ${decoded.id} authenticated on socket ${socket.id}`);
      } catch (error) {
        console.log('✗ Socket authentication failed:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupSocketIO;
