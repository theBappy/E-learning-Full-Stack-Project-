const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');


const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response); 

    // Save Email Log
    await EmailLog.create({recipient: to, subject, content: text});
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error; 
  }
};

module.exports = sendEmail;



