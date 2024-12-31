const EnrolledCourse = require('../models/EnrolledCourse');

exports.getDashboardData = async (req, res) => {
  try {
    const enrolledCourses = await EnrolledCourse.find({ user: req.user._id }).populate('courseId');

    // Segregate courses
    const completedCourses = enrolledCourses.filter(course => course.completed);
    const inProgressCourses = enrolledCourses.filter(course => !course.completed);

    res.status(200).json({
      completedCourses,
      inProgressCourses,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};
