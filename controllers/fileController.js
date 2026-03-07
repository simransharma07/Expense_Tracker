const fs = require('fs');
const path = require('path');
const { getExpenses } = require('../models/expenseModel');

// FILE STREAMING - Reading large files using streams (from syllabus)
exports.streamLogs = (req, res) => {
  const logFilePath = path.join(__dirname, '../data/activity.log');
  
  // Check if file exists
  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Log file not found' 
    });
  }
  
  // Set appropriate headers for text streaming
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'inline; filename="activity.log"');
  
  // Create read stream and pipe to response (File Streaming from syllabus)
  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8' });
  
  readStream.on('error', (err) => {
    res.status(500).json({ 
      success: false, 
      message: 'Error reading log file' 
    });
  });
  
  // Piping stream to response
  readStream.pipe(res);
};

// FILE DOWNLOAD - Demonstrate res.download() method
exports.downloadExpenses = (req, res) => {
  const expenses = getExpenses();
  const csvData = convertToCSV(expenses);
  
  const exportPath = path.join(__dirname, '../data/expenses_export.csv');
  
  // Write CSV file
  fs.writeFileSync(exportPath, csvData);
  
  // Using res.download() - Response Method from syllabus
  res.download(exportPath, 'expenses.csv', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    // Clean up - delete temporary file after download
    fs.unlinkSync(exportPath);
  });
};

// STREAMING WRITE - Export expenses using write stream
exports.exportExpensesStream = (req, res) => {
  const expenses = getExpenses();
  
  // Set headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses_stream.csv"');
  
  // Create write stream to response (File Streaming from syllabus)
  const writeStream = res;
  
  // Write CSV header
  writeStream.write('ID,Title,Amount,Category,Date\n');
  
  // Stream each expense row
  expenses.forEach((expense) => {
    const row = `${expense.id},${expense.title},${expense.amount},${expense.category || 'N/A'},${expense.date || 'N/A'}\n`;
    writeStream.write(row);
  });
  
  // End the stream
  writeStream.end();
};

// FILE MODULE - Demonstrate file operations
exports.getFileInfo = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../data', filename);
  
  // Check if file exists using fs module
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File not found' 
    });
  }
  
  // Get file stats using fs.statSync
  const stats = fs.statSync(filePath);
  
  res.json({
    success: true,
    fileInfo: {
      name: filename,
      size: stats.size + ' bytes',
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    }
  });
};

// Helper function to convert expenses to CSV format
function convertToCSV(expenses) {
  const header = 'ID,Title,Amount,Category,Date\n';
  const rows = expenses.map(exp => 
    `${exp.id},${exp.title},${exp.amount},${exp.category || 'N/A'},${exp.date || 'N/A'}`
  ).join('\n');
  
  return header + rows;
}
