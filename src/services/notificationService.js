// src/services/notificationService.js

const nodemailer = require("nodemailer");

// Set up Nodemailer transport with your email service
const transporter = nodemailer.createTransport({
  service: "gmail", // You can replace it with your email service (e.g., Outlook, Yahoo, etc.)
  auth: {
    user: process.env.SENDER_EMAIL, // Your email address
    pass: process.env.SENDER_EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send the guardian alert email
const sendGuardianAlertEmail = async (guardianEmail, message) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Sender's email (from .env)
      to: guardianEmail, // Recipient's email (guardian's email)
      subject: "XyraNet Alert - Online Safety Tool (Notification)", // Subject of the email
      text: message, // Message body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

module.exports = { sendGuardianAlertEmail };
