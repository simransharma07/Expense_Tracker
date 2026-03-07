const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  streamLogs,
  downloadExpenses,
  exportExpensesStream,
  getFileInfo
} = require('../controllers/fileController');

// FILE STREAMING ROUTES (from syllabus)
router.get('/logs', auth, streamLogs);                    // Stream log file
router.get('/download', auth, downloadExpenses);          // Download expenses as CSV
router.get('/export-stream', auth, exportExpensesStream); // Export using streams
router.get('/info/:filename', auth, getFileInfo);         // Get file information

module.exports = router;
