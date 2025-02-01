// utils/email.js
const nodemailer = require("nodemailer");

/**
 * Creates a Nodemailer transporter using Gmail and environment credentials.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Sends an email using the given mail options.
 * @param {Object} mailOptions - The email options (to, from, subject, text, etc.)
 * @returns {Promise<Object>} - The result from Nodemailer's sendMail.
 */
const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    // You may wish to add more detailed logging or error handling here.
    throw error;
  }
};

module.exports = { sendEmail };
