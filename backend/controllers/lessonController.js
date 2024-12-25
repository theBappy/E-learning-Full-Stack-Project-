const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary');

// Create a lesson
exports.createLesson = async (req, res) => {
  const { title, content, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Ensure the instructor is creating the lesson
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. Only the course instructor can add lessons.' });
    }

    const lesson = await Lesson.create({ title, content, course: courseId });
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch lessons for a course
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  const { title, content } = req.body;

  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if the user is the instructor of the course
    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. Only the course instructor can edit lessons.' });
    }

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    await lesson.save();

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if the user is the instructor of the course
    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. Only the course instructor can delete lessons.' });
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add video upload functionlity 
exports.uploadVideo = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update lesson with uploaded video URL
    lesson.videoUrl = req.file.path; // File path from Cloudinary
    await lesson.save();

    res.json({ message: 'Video uploaded successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// GetLessonDetails
exports.getLessonDetails = async (req, res) => {
  const { id } = req.params;

  try {
      // Fetch the lesson details
      const lesson = await Lesson.findById(id);
      if (!lesson) {
          return res.status(404).json({ error: 'Lesson not found' });
      }

      // Check if the user is enrolled in the course
      const isEnrolled = await Course.findOne({
          _id: lesson.course,
          studentsEnrolled: req.user._id,
      });
      if (!isEnrolled) {
          return res.status(403).json({ error: 'Access denied. Not enrolled.' });
      }

      res.json(lesson);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};