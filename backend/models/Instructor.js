const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Instructor', InstructorSchema);


