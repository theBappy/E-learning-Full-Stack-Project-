const Course = require('../models/Course');

exports.enrollInACourse = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      // Check if user is already enrolled
      if (course.studentsEnrolled.includes(req.user._id)) {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }
  
      course.studentsEnrolled.push(req.user._id);
      await course.save();
  
      res.json({ message: 'Enrolled successfully', course });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllEnrolledCourse = async (req, res) => {
    try {
      const courses = await Course.find({ studentsEnrolled: req.user._id });
  
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};