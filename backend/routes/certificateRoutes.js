const express = require("express");
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const Course = require("../models/Course");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Generate Certificate
router.post("/generate", protect, async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }


    const existingCertificate = await Certificate.findOne({ userId, courseId });
    if (existingCertificate) {
      return res
        .status(400)
        .json({ message: "Certificate already generated for this course" });
    }

   
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;


    const certificate = new Certificate({
      userId,
      courseId,
      certificateId,
    });

    await certificate.save();

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
