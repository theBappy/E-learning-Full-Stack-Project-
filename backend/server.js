const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req,res)=>{
    res.send('E-Learning Platform API')
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)

