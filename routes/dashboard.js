const express = require('express');
const router = express.Router();
const listModel = require('../models/list');
const multer = require('multer');
const path = require('path');

// Middleware: Ensure user is logged in
router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect('/');
  next();
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET dashboard with all lists
router.get('/', async (req, res) => {
  try {
    const lists = await listModel.getListsByUser(req.session.userId);
    res.render('dashboard', { lists });
  } catch (error) {
    console.error(error);
    res.send('Error loading dashboard.');
  }
});

// POST create a new list with optional image
router.post('/create', upload.single('image'), async (req, res) => {
  const { name } = req.body;
  let image = null;
  if (req.file) {
    image = req.file.filename;
  }
  try {
    await listModel.createList(name, image, req.session.userId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.send('Error creating list.');
  }
});

module.exports = router;
