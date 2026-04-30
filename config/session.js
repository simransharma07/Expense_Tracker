const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const mongoose = require('mongoose');

const sessionConfig = (app) => {
  const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'your_super_secret_session_key_change_this_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  };

  if (mongoose.connection.readyState === 1) {
    sessionOptions.store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 7 * 24 * 60 * 60
    });
    console.log('✓ Sessions stored in MongoDB');
  } else {
    console.log('⚠ MongoDB not connected, using memory store for sessions');
  }

  app.use(session(sessionOptions));
};

module.exports = sessionConfig;
