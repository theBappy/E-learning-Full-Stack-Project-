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
    progress: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

const EnrolledCourse = mongoose.model('EnrolledCourse', enrolledCourseSchema);

module.exports = EnrolledCourse;
