
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- Basic Route (Test) ---
app.get('/', (req, res) => {
    res.send('Todo App Backend is Running!');
});

// --- API Routes (We'll add these next) ---
app.use('/api/todos', require('./routes/todos'));

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});