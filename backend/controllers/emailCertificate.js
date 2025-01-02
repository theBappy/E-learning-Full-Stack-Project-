const Certificate = require('../models/Certificate');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');



exports.certificateOnEmail = async (req, res) => {
    const { certificateId, recipientEmail } = req.body;
  
    try {
      // Fetching the certificate details
      const certificate = await Certificate.findById(certificateId)
        .populate('userId', 'name email')
        .populate('courseId', 'title');
  
      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
  
      // Generating PDF
      const doc = new PDFDocument();
      const pdfChunks = [];
      doc.on('data', chunk => pdfChunks.push(chunk));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(pdfChunks);
  
        // Setting up Nodemailer transport
        const transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.ADMIN_EMAILS, 
            pass: process.env.PASS,
          },
        });
  
        // Emailing options
        const mailOptions = {
          from: process.env.ADMIN_EMAILS,
          to: recipientEmail,
          subject: 'Your Certificate of Completion',
          text: `Dear ${certificate.userId.name},\n\nPlease find attached your certificate for completing the course "${certificate.courseId.title}".\n\nBest regards,\nThe Team`,
          attachments: [
            {
              filename: `${certificateId}.pdf`,
              content: pdfBuffer,
            },
          ],
        };
  
        // Sending email
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error sending email' });
          }
          res.status(200).json({ message: 'Email sent successfully', info });
        });
      });
  
      // Adding content to the PDF
      doc.fontSize(20).text('Certificate of Completion', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Name: ${certificate.userId.name}`, { align: 'center' });
      doc.fontSize(14).text(`Course: ${certificate.courseId.title}`, { align: 'center' });
      doc.fontSize(14).text(`Date: ${new Date(certificate.issueDate).toLocaleDateString()}`, { align: 'center' });
  
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error generating or sending certificate' });
    }
};