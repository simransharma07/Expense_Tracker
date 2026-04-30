const express = require('express');
const router = express.Router();
const {
  getLoginPage,
  getRegisterPage,
  getDashboard,
  getProfile,
  getLogout
} = require('../controllers/viewController');

router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/logout', getLogout);

module.exports = router;
