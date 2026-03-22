const nodemailer = require('nodemailer');

const sendWinnerEmail = async (userEmail, userName, prizeAmount, matchCount) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Skipping Email Service: Missing configuration in .env');
      return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Digital Heroes" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🏆 CONGRATULATIONS ${userName}! You Won a Prize!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #f8fafc;">
        <div style="background-color: #166534; padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Digital Heroes</h1>
          <p style="color: #dcfce7; margin-top: 10px; font-weight: 600;">Where Impact Meets Reward</p>
        </div>
        <div style="padding: 40px; background-color: white;">
          <h2 style="color: #1e293b; font-size: 24px;">Amazing News, ${userName}!</h2>
          <p style="color: #475569; line-height: 1.6;">Our latest draw is officially in, and the results are stunning. You have matched <strong>${matchCount}</strong> numbers on your rolling card!</p>
          
          <div style="margin: 30px 0; padding: 30px; background-color: #f0fdf4; border: 2px dashed #22c55e; border-radius: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px; text-transform: uppercase; color: #166534; font-weight: 800; letter-spacing: 1px;">Your Winnings</p>
            <h3 style="margin: 10px 0 0 0; font-size: 48px; color: #15803d; font-weight: 900;">$${prizeAmount}</h3>
          </div>

          <p style="color: #475569; line-height: 1.6;">To finalize your payout, please log into your dashboard and upload your scorecard screenshot for verification.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="display: inline-block; background-color: #15803d; color: white; padding: 18px 35px; border-radius: 12px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">CLAIM MY PRIZE NOW</a>
          </div>
        </div>
        <div style="padding: 20px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Digital Heroes. All rights reserved. <br/>
          This is an automated notification from our draw engine.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Winning Email Sent to ${userEmail} | Message ID: ${info.messageId}`);
  } catch (err) {
    console.error(`Email failed to send to ${userEmail}:`, err);
  }
};

module.exports = { sendWinnerEmail };
