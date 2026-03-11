const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/expenses.json');

const normalizeAccount = (value) => {
  const account = String(value || '').toLowerCase();
  if (account === 'cash' || account === 'bank' || account === 'card') return account;
  return 'cash';
};

const normalizeExpenses = (expenses) => {
  if (!Array.isArray(expenses)) return [];
  return expenses.map((expense) => ({
    ...expense,
    account: normalizeAccount(expense.account)
  }));
};

exports.getExpenses = () => {
  try {
    const expenses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return normalizeExpenses(expenses);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
};

exports.saveExpenses = (expenses) => {
  return normalizeExpenses(expenses);
};

exports.getExpensesAsync = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return normalizeExpenses(JSON.parse(data));
  } catch (error) {
    console.error('Error reading expenses async:', error);
    return [];
  }
};

exports.saveExpensesAsync = async (expenses) => {
  return true;
};

exports.appendExpenseLog = (expense) => {
  return expense;
};
