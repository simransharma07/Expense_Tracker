const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const fileController = require('../controllers/fileController');

// FILE STREAMING ROUTES (from syllabus)
router.get('/logs', protect, fileController.streamLogs);                    // Stream log file
router.get('/download', protect, fileController.downloadExpenses);          // Download expenses as CSV
router.get('/export-stream', protect, fileController.exportExpensesStream); // Export using streams
router.get('/info/:filename', protect, fileController.getFileInfo);         // Get file information

module.exports = router;
