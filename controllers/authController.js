const { getUsers, saveUsers } = require("../models/userModel");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

const ensureUserId = (user) => {
  if (!user.id) {
    user.id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }
  return user.id;
};

exports.register = (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (!passwordRegex.test(password)) {
    return res.status(400).send("Weak password");
  }

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).send("User already exists");
  }

  users.push({ id: Date.now().toString(), email, password });
  saveUsers(users);

  res.status(201).json({
    message: "Registered successfully"
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

  const userId = ensureUserId(user);
  saveUsers(users);

  res.json({
    message: "Login successful",
    userId,
    email: user.email
  });
};

exports.forgotPassword = (req, res) => {
  const email = req.body.email?.toLowerCase();
  const newPassword = req.body.newPassword;

  if (!email || !newPassword) {
    return res.status(400).send("Email and new password are required");
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).send("Weak password");
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).send("User not found");
  }

  user.password = newPassword;
  ensureUserId(user);
  saveUsers(users);

  res.json({ message: "Password updated successfully" });
};