// server.js (Backend Logic)
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;
client.connect().then(() => {
    const db = client.db('defi');
    usersCollection = db.collection('users');
    console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));

// API Route: Register User Wallet
app.post('/api/users', async(req, res) => {
    const { walletAddress } = req.body;
    try {
        const user = await usersCollection.findOne({ walletAddress });
        if (user) {
            res.status(409).json({ message: 'User already exists' });
        } else {
            const result = await usersCollection.insertOne({ walletAddress, balance: 0 });
            res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API Route: Get User by Wallet Address
app.get('/api/users/:walletAddress', async(req, res) => {
    const { walletAddress } = req.params;
    try {
        const user = await usersCollection.findOne({ walletAddress });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});