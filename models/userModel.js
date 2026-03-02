const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

exports.getUsers = () => JSON.parse(fs.readFileSync(filePath));
exports.saveUsers = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, 2));