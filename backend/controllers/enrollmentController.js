const mongoose = require('mongoose');
const Course = require('../models/Course');
const EnrolledCourse = require('../models/EnrolledCourse');
const sendCompletionEmail = require('../utils/sendEmail');


// Enroll in a course
exports.enrollInACourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  try {
    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid Course ID' });
    }

    // Find the course
    const course = await Course.findById(courseId).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await EnrolledCourse.findOne({
      user: userId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create new enrollment
    const newEnrollment = new EnrolledCourse({
      user: userId,
      courseId, // Ensure this matches the field name
      studentsEnrolled: [userId],
    });

    await newEnrollment.save();

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to enroll in course', error: error.message });
  }
};



// Get all enrolled courses
exports.getAllEnrolledCourse = async (req, res) => {
  try {
    const courses = await EnrolledCourse.find({ user: req.user._id })
      .populate({
        path: 'courseId', 
        select: 'title description price instructor',
        populate: { 
          path: 'instructor', 
          select: 'name email',
         }, 
         populate: {
           path: 'modules',
           select: 'title description lessons',
         },
      });
      if (!courses
        .length) {
        return res.status(404).json({ message: 'No enrolled courses found' });
      }

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses', error: error.message });
  }
};

// Update progress in a course
exports.progressCourses = async (req, res) => {
  const { courseId, progress, lessonsCompleted } = req.body;

  try {
    const enrolledCourse = await EnrolledCourse.findOneAndUpdate(
      { user: req.user._id, courseId },
      { progress, lessonsCompleted },
      { new: true }
    ).populate({
      path: 'courseId',
      select: 'title modules',
      populate: { path: 'modules', select: 'lessons' },
    });

    if (!enrolledCourse) {
      return res.status(404).json({ message: 'Enrolled course not found' });
    }

    // Check if the course is completed
    const totalLessons = enrolledCourse.courseId.modules.reduce((total, module) => {
      return total + module.lessons.length;
    }, 0);

    const completedLessons = lessonsCompleted.length;

    if (progress === 100 && completedLessons === totalLessons) {
      // Trigger course completion notification
      sendCompletionEmail(req.user.email, enrolledCourse.courseId.title);
      return res.status(200).json({
        message: 'Progress updated and course completed!',
        enrolledCourse,
      });
    }

    res.status(200).json({
      message: 'Progress updated successfully',
      enrolledCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update progress',
      error: error.message,
    });
  }
};



