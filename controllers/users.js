const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        const result = await mongodb.getDatabase().db().collection('users').find();
        result.toArray().then((users) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to find a user.');
            return;
        }
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
        result.toArray().then((users) => {
            if (users.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users[0]);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            address: {
                street: req.body.address?.street,
                city: req.body.address?.city,
                state: req.body.address?.state,
                zipCode: req.body.address?.zipCode,
                country: req.body.address?.country
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validation
        if (!user.username || !user.email || !user.password) {
            res.status(400).json({ message: 'Username, email, and password are required fields' });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to update a user.');
            return;
        }
        const userId = new ObjectId(req.params.id);
        const user = {
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            address: {
                street: req.body.address?.street,
                city: req.body.address?.city,
                state: req.body.address?.state,
                zipCode: req.body.address?.zipCode,
                country: req.body.address?.country
            },
            updatedAt: new Date()
        };

        // Validation
        if (!user.username || !user.email) {
            res.status(400).json({ message: 'Username and email are required fields' });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags = ['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to delete a user.');
            return;
        }
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};