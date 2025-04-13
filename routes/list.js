const express = require('express');
const router = express.Router();
const listModel = require('../models/list');
const itemModel = require('../models/item');

// Middleware: Ensure user is logged in
router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect('/');
  next();
});

// GET single list view with items
router.get('/:id', async (req, res) => {
  const listId = req.params.id;
  try {
    const list = await listModel.getListById(listId, req.session.userId);
    if (!list) return res.send('List not found.');
    const items = await itemModel.getItemsByList(listId);
    res.render('list', { list, items });
  } catch (error) {
    console.error(error);
    res.send('Error loading list.');
  }
});

// POST add a new item to the list
router.post('/:id/item', async (req, res) => {
  const listId = req.params.id;
  const { text } = req.body;
  try {
    await itemModel.createItem(text, listId);
    res.redirect(`/list/${listId}`);
  } catch (error) {
    console.error(error);
    res.send('Error adding item.');
  }
});

// POST toggle item done status
router.post('/:id/item/:itemId/toggle', async (req, res) => {
  const listId = req.params.id;
  const itemId = req.params.itemId;
  try {
    const items = await itemModel.getItemsByList(listId);
    const item = items.find(i => i.id == itemId);
    if (!item) return res.send('Item not found.');
    const newStatus = !item.done;
    await itemModel.updateItem(itemId, item.text, newStatus, listId);
    res.redirect(`/list/${listId}`);
  } catch (error) {
    console.error(error);
    res.send('Error toggling item.');
  }
});

// POST delete an item
router.post('/:id/item/:itemId/delete', async (req, res) => {
  const listId = req.params.id;
  const itemId = req.params.itemId;
  try {
    await itemModel.deleteItem(itemId, listId);
    res.redirect(`/list/${listId}`);
  } catch (error) {
    console.error(error);
    res.send('Error deleting item.');
  }
});

module.exports = router;
