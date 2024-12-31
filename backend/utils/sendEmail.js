const nodemailer = require('nodemailer');

const sendCompletionEmail = async (recipient, courseTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'abappy575@gmail.com',
        pass: 'yfxna mzni hrsx ddjn', 
      },
    });

    const mailOptions = {
      from: 'abappy575@gmail.com',
      to: recipient,
      subject: `Congratulations on completing ${courseTitle}!`,
      html: `<h1>Congratulations!</h1>
             <p>You've successfully completed the course: <strong>${courseTitle}</strong>.</p>
             <p>Keep up the great work and explore more courses to enhance your knowledge!</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Completion email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendCompletionEmail;
