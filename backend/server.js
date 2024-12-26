require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');


// Routes Imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoute');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust based on your frontend URL
    },
});

// Middleware
app.use(express.json());
app.use(cors());

// Attach Socket.IO to requests
app.use((req, res, next) => {
    req.io = io; // Make io available in all routes
    next();
});

// Basic route
app.get('/', (req, res) => {
    res.send('E-Learning Platform API');
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join room logic
    socket.on('joinInstructorRoom', (instructorId) => {
        const instructorRoom = `instructor_${instructorId}`;
        socket.join(instructorRoom);
        console.log(`Instructor joined room: ${instructorRoom}`);
    });

    socket.on('joinStudentRoom', (studentId) => {
        const studentRoom = `student_${studentId}`;
        socket.join(studentRoom);
        console.log(`Student joined room: ${studentRoom}`);
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/user-role', adminRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/lesson', lessonRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed: ', err));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
