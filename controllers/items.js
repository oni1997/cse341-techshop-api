const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all items
const getAllItems = async (req, res) => {
    //#swagger.tags = ['Items']
    try {
        const result = await mongodb.getDatabase().db().collection('items').find();
        result.toArray().then((items) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(items);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single item by ID
const getItemById = async (req, res) => {
    //#swagger.tags = ['Items']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid item id to find an item.');
            return;
        }
        const itemId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('items').find({ _id: itemId });
        result.toArray().then((items) => {
            if (items.length === 0) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(items[0]);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new item
const createItem = async (req, res) => {
    //#swagger.tags = ['Items']
    try {
        const item = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl,
            specifications: req.body.specifications
        };

        // Validation
        if (!item.name || !item.price || !item.category) {
            res.status(400).json({ message: 'Name, price, and category are required fields' });
            return;
        }

        const response = await mongodb.getDatabase().db().collection('items').insertOne(item);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Item created successfully' });
        } else {
            res.status(500).json({ message: 'Error creating item' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update item
const updateItem = async (req, res) => {
    //#swagger.tags = ['Items']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid item id to update an item.');
            return;
        }
        const itemId = new ObjectId(req.params.id);
        const item = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl,
            specifications: req.body.specifications
        };

        // Validation
        if (!item.name || !item.price || !item.category) {
            res.status(400).json({ message: 'Name, price, and category are required fields' });
            return;
        }

        const response = await mongodb.getDatabase().db().collection('items').replaceOne({ _id: itemId }, item);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    //#swagger.tags = ['Items']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid item id to delete an item.');
            return;
        }
        const itemId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('items').deleteOne({ _id: itemId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};