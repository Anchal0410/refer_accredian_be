const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const sendReferralEmail = async ({
  referralCode,
  referrerName,
  referrerEmail,
  refereeName,
  refereeEmail,
  courseInterest
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD 
      }
    });

    // Send email to referee
    const refereeInfo = await transporter.sendMail({
      from: `"Accredian Learning" <${process.env.EMAIL}>`,
      to: refereeEmail,
      subject: `${referrerName} has referred you to our ${courseInterest} course!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${refereeName}!</h2>
          <p>${referrerName} thinks you'd be interested in our ${courseInterest} course.</p>
          <p>Referral Code: <strong>${referralCode}</strong></p>
        </div>
      `
    });

    const referrerInfo = await transporter.sendMail({
      from: `"Accredian Learning" <${process.env.EMAIL}>`,
      to: referrerEmail,
      subject: 'Your referral has been received!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Thank you, ${referrerName}!</h2>
          <p>Your referral for ${refereeName} has been received.</p>
          <p>Referral Code: <strong>${referralCode}</strong></p>
        </div>
      `
    });

    return { refereeEmailId: refereeInfo.messageId, referrerEmailId: referrerInfo.messageId };
  } catch (error) {
    console.error('Error in sendReferralEmail:', error);
    throw error;
  }
};

module.exports = { sendReferralEmail };