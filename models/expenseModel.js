const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/expenses.json');

exports.getExpenses = () => JSON.parse(fs.readFileSync(filePath));
exports.saveExpenses = (expenses) => fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));