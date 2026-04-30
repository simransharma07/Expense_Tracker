const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';

const getTokenFromRequest = (req) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  if (req.session?.token) {
    return req.session.token;
  }
  return null;
};

exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.getRegisterPage = (req, res) => {
  res.render('register');
};

exports.getDashboard = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const User = require('../models/User');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.redirect('/login');
    }

    res.render('dashboard', { user, token });
  } catch (error) {
    res.redirect('/login');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const User = require('../models/User');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.redirect('/login');
    }

    res.render('profile', { user, token });
  } catch (error) {
    res.redirect('/login');
  }
};

exports.getLogout = (req, res) => {
  res.clearCookie('token');
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/login');
};
