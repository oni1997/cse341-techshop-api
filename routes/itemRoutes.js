const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getAllItemsSimple,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// GET /api/items - Get all items with pagination and filters
router.get('/', getAllItems);

// GET /api/items/all - Get all items without pagination or filters
router.get('/all', getAllItemsSimple);

// POST /api/items - Create new item
router.post('/', createItem);

// GET /api/items/:id - Get single item by ID
router.get('/:id', getItemById);

// PUT /api/items/:id - Update item by ID
router.put('/:id', updateItem);

// DELETE /api/items/:id - Delete item by ID
router.delete('/:id', deleteItem);

module.exports = router;