const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Certificate = require('../models/Certificate');

router.get("/:certificateId", protect, async (req, res) => {
  const { certificateId } = req.params;

  try {
    // Fetch certificate and populate user and courseId
    const certificate = await Certificate.findById(certificateId)
      .populate("userId", "name email")
      .populate("courseId", "title"); 

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Check if user and courseId are properly populated
    if (!certificate.userId || !certificate.courseId) {
      return res.status(400).json({ message: "Incomplete certificate data" });
    }

    // Creating PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${certificateId}.pdf`
    );

    // Adding content to PDF
    doc.fontSize(20).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${certificate.userId.name}`, { align: "center" });
    doc.fontSize(14).text(`Course: ${certificate.courseId.title}`, { align: "center" });
    doc.fontSize(14).text(`Date: ${new Date(certificate.issueDate).toLocaleDateString()}`, { align: "center" });

    // Finalizing the PDF and send it
    doc.pipe(res);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating certificate PDF" });
  }
});

module.exports = router;

