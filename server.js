const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const itemRoutes = require('./routes/itemRoutes');
const swaggerRoutes = require('./routes/swagger');

app.use('/api/items', itemRoutes);
app.use('/', swaggerRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Node.js REST API', 
    version: '1.0.0',
    endpoints: {
      items: '/api/items',
      users: '/api/users',
      docs: '/api-docs'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
