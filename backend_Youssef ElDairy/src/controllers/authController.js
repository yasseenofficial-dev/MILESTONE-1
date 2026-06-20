const { readDB } = require('../config/db');

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active);
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = Buffer.from(`${user.id}:${user.role}`).toString('base64');
    res.json({ token, user: safeUser(user) });
  } catch (error) {
    next(error);
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, me };
