const fs = require('fs');
const path = require('path');
const { getExpenses } = require('../models/expenseModel');


exports.streamLogs = (req, res) => {
  const logFilePath = path.join(__dirname, '../data/activity.log');
  
 
  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Log file not found' 
    });
  }
  
 
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'inline; filename="activity.log"');
  
 
  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8' });
  
  readStream.on('error', (err) => {
    res.status(500).json({ 
      success: false, 
      message: 'Error reading log file' 
    });
  });
  

  readStream.pipe(res);
};
exports.downloadExpenses = (req, res) => {
  const expenses = getExpenses();
  const csvData = convertToCSV(expenses);
  
  const exportPath = path.join(__dirname, '../data/expenses_export.csv');
  

  fs.writeFileSync(exportPath, csvData);
  

  res.download(exportPath, 'expenses.csv', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  
    fs.unlinkSync(exportPath);
  });
};


exports.exportExpensesStream = (req, res) => {
  const expenses = getExpenses();
 
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses_stream.csv"');
  

  const writeStream = res;
  

  writeStream.write('ID,Title,Amount,Category,Date\n');
  

  expenses.forEach((expense) => {
    const row = `${expense.id},${expense.title},${expense.amount},${expense.category || 'N/A'},${expense.date || 'N/A'}\n`;
    writeStream.write(row);
  });
  

  writeStream.end();
};


exports.getFileInfo = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../data', filename);
  

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File not found' 
    });
  }
  
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
function convertToCSV(expenses) {
  const header = 'ID,Title,Amount,Category,Date\n';
  const rows = expenses.map(exp => 
    `${exp.id},${exp.title},${exp.amount},${exp.category || 'N/A'},${exp.date || 'N/A'}`
  ).join('\n');
  
  return header + rows;
}
