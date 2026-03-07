const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/expenses.json');

// Synchronous file operations (original methods)
exports.getExpenses = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
};

exports.saveExpenses = (expenses) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving expenses:', error);
    throw error;
  }
};

// ASYNCHRONOUS FILE OPERATIONS (using fs.promises from syllabus)
exports.getExpensesAsync = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses async:', error);
    return [];
  }
};

exports.saveExpensesAsync = async (expenses) => {
  try {
    await fs.promises.writeFile(
      filePath, 
      JSON.stringify(expenses, null, 2), 
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error saving expenses async:', error);
    throw error;
  }
};

// FILE MODULE - Append to file
exports.appendExpenseLog = (expense) => {
  const logPath = path.join(__dirname, '../data/expense_changes.log');
  const logEntry = `[${new Date().toISOString()}] Added: ${expense.title} - $${expense.amount}\n`;
  
  fs.appendFileSync(logPath, logEntry, 'utf8');
};
