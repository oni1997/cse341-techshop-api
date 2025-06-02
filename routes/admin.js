const express = require('express').Router;
const router = express.Router();
const adminController = require('../controllers/admin');

// GET all users
router.get('/users', adminController.getAllUsers);

// GET all items
router.get('/items', adminController.getAllItems);

module.exports = router;