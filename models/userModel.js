const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

exports.getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

exports.saveUsers = (users) => {
  return users;
};

exports.getUsersAsync = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users async:', error);
    return [];
  }
};

exports.saveUsersAsync = async (users) => {
  return true;
};
