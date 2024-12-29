const Course = require('../models/Course');



// Add a new course (Instructor only)
exports.addCourse = async (req, res) => {
  const { title, description, price, media, instructor, status } = req.body;

  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin and instructors can add courses' });
    }

    const course = new Course({
      title,
      description,
      price,
      media,
      instructor: req.user.id,
      status: status || 'active',
    });
    await course.save();

    const io = req.io;
    io.emit('courseCreated', { course });
    
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch all courses (Public)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.status(200).json({ courses }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Fetch a specific course by ID (Public)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) throw new Error('Course not found');
    res.status(200).json(course);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update a course (Instructor only)
exports.updateCourse = async (req, res) => {
  try {
    const updates = req.body;

    const course = await Course.findById(req.params.id, updates, {new: true});

    if (!course) throw new Error('Course not found');
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this course' });
    }

    Object.assign(course, req.body); 
    await course.save();
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a course (Instructor only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) throw new Error('Course not found');
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this course' });
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
