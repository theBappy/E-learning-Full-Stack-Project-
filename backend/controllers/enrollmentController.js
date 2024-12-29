const Course = require('../models/Course');


exports.enrollInACourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.studentsEnrolled.push(userId);
    await course.save();

    res.status(200).json({ message: "Enrollment successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to enroll in course" });
  }
};

exports.getAllEnrolledCourse = async (req, res) => {
    try {
      const courses = await Course.find({ studentsEnrolled: req.user._id })
      .select("titel description price instructor media")
      .populate("instructor", "name email");
  
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrolled courses" });
    }
};


