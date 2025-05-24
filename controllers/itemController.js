const Item = require('../models/item');

const getAllItems = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const { page = 1, limit = 10, category, inStock, search } = req.query;
        
        const filter = {};
        if (category) filter.category = category;
        if (inStock !== undefined) filter.inStock = inStock === 'true';
        if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
        }

        const items = await Item.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

        const total = await Item.countDocuments(filter);

        res.status(200).json({
        success: true,
        data: items,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error fetching items',
        error: error.message
        });
    }
};

const getAllItemsSimple = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const items = await Item.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching items',
            error: error.message
        });
    }
};

const getItemById = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
        }

        res.status(200).json({
        success: true,
        data: item
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error fetching item',
        error: error.message
        });
    }
};

const createItem = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const { name, description, price, category, inStock, quantity, tags } = req.body;

        const newItem = new Item({
        name,
        description,
        price,
        category,
        inStock,
        quantity,
        tags
        });

        const savedItem = await newItem.save();

        res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: savedItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
        }

        res.status(500).json({
        success: false,
        message: 'Error creating item',
        error: error.message
        });
    }
};

const updateItem = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );

        if (!updatedItem) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
        }

        res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: updatedItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
        }

        res.status(500).json({
        success: false,
        message: 'Error updating item',
        error: error.message
        });
    }
};

const deleteItem = async (req, res) => {
    //#swagger.tags = ['Item']
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
        }

        res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: deletedItem
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error deleting item',
        error: error.message
        });
    }
};

module.exports = {
  getAllItems,
  getAllItemsSimple,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};