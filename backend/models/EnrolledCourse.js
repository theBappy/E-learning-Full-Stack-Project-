const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolledCourseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', 
      required: true,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
    progress: [
      {
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Module',
        },
      },
    ],
    lessonsCompleted: [String],
  },
  { timestamps: true }
);

const EnrolledCourse = mongoose.model('EnrolledCourse', enrolledCourseSchema);

module.exports = EnrolledCourse;
