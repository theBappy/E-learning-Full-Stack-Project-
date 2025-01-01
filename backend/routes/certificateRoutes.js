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

// Get all certificates for a specific user
router.get("/user-certificates", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await Certificate.find({ userId }).populate("courseId", "title");

    if (!certificates.length) {
      return res.status(404).json({ message: "No certificates found for this user." });
    }

    res.status(200).json({ certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Validate Certificate
router.get("/validate/:certificateId", async (req, res) => {
  try {
    const { certificateId } = req.params;

    
    const certificate = await Certificate.findOne({ certificateId })
      .populate("userId", "name email")
      .populate("courseId", "title");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      message: "Certificate is valid",
      certificate: {
        certificateId: certificate.certificateId,
        userName: certificate.userId.name,
        userEmail: certificate.userId.email,
        courseTitle: certificate.courseId.title,
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
