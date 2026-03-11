const { getUsers } = require("../models/userModel");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

exports.register = (req, res) => {
  res.status(405).json({
    message: "Database is static. Registration is disabled."
  });
};

exports.login = (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const userId = user.id || user.email;

  res.json({
    message: "Login successful",
    userId,
    email: user.email
  });
};

exports.forgotPassword = (req, res) => {
  res.status(405).json({
    message: "Database is static. Password reset is disabled."
  });
};