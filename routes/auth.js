const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

// GET login page
router.get('/', (req, res) => {
  res.render('login', { error: null });
});

// GET register page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.render('register', { error: 'Username already exists.' });
    }
    await userModel.createUser(username, password);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Registration failed.' });
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.render('login', { error: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid username or password.' });
    }
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Login failed.' });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
