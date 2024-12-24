const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoute');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req,res)=>{
    res.send('E-Learning Platform API')
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/user-role', adminRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/lesson', lessonRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB connected'))
.catch((err)=> console.error('MongoDB Connecetion failed: ', err));

// Star Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}...`));

