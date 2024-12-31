const mongoose = require('mongoose');
const Course = require('../models/Course');
const EnrolledCourse = require('../models/EnrolledCourse');
const sendEmail = require('../utils/sendEmail');


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
  const { courseId, progress } = req.body;

  try {

    const existingCourse = await EnrolledCourse.findOne({
      user: req.user._id,
      courseId,
    }).populate('courseId'); 

    if (!existingCourse) {
      return res.status(404).json({ message: 'Enrolled course not found' });
    }


    const enrolledCourse = await EnrolledCourse.findOneAndUpdate(
      { user: req.user._id, courseId },
      { progress, completed: progress === 100 },
      { new: true }
    ).populate('courseId'); 


    if (progress === 100 && !existingCourse.completed) {
      console.log('Sending completion email to student...');
      await sendEmail({
        to: req.user.email,
        subject: 'Congratulations on Completing Your Course!',
        text: `You have successfully completed the course "${enrolledCourse.courseId.title}". Keep learning!`,
      });
      

      const adminEmails = process.env.ADMIN_EMAILS.split(',');
      for(const adminEmail of adminEmails){
        await sendEmail({
          to: adminEmail,
          subject: `Course completion notification ${enrolledCourse.courseId.title}`,
          text: `User ${req.user.name} (${req.user.email}) has successfully completed the course "${enrolledCourse.courseId.title}".`,
        });
      }
      console.log('Admin notifications sent.')
    }

    res.status(200).json({
      message: 'Progress updated successfully',
      enrolledCourse,
    });
  } catch (error) {
    console.error('Error in progressCourses:', error);
    res.status(500).json({
      message: 'Failed to update progress',
      error: error.message,
    });
  }
};







































