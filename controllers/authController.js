const { getUsers, saveUsers } = require("../models/userModel");

exports.register = (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).send("Weak password");
  }

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).send("User already exists");
  }

  users.push({ email, password });
  saveUsers(users);

  res.send("Registered successfully");
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

  res.send("Login successful");
};