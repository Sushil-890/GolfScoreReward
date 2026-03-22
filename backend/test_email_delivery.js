const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const testMail = {
  from: process.env.EMAIL_USER,
  to: 'kumrsushil890@gmail.com', // Recipient
  subject: 'TEST EMAIL FROM BACKEND',
  text: 'If you receive this, your backend email configuration is 100% correct!'
};

transporter.sendMail(testMail, (err, info) => {
  if (err) {
    console.log('--- ERROR ---');
    console.log(err);
  } else {
    console.log('--- SUCCESS ---');
    console.log('Sent to: ' + info.accepted[0]);
    console.log('Message ID: ' + info.messageId);
  }
  process.exit();
});
