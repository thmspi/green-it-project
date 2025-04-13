const express = require('express');
const router = express.Router();
const listModel = require('../models/list');
const multer = require('multer');
const path = require('path');

const db = require('../models/db'); // ✅ Adjust path if needed


// Middleware: Ensure user is logged in
router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect('/');
  next();
});

router.post('/delete', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty list of IDs' });
  }

  try {
    const placeholders = ids.map(() => '?').join(', ');
    const query = `DELETE FROM lists WHERE id IN (${placeholders})`;
    await db.query(query, ids);


    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting lists:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
