const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

// Synchronous file operations
exports.getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

exports.saveUsers = (users) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// ASYNCHRONOUS FILE OPERATIONS (from syllabus)
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
  try {
    await fs.promises.writeFile(
      filePath, 
      JSON.stringify(users, null, 2), 
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error saving users async:', error);
    throw error;
  }
};
