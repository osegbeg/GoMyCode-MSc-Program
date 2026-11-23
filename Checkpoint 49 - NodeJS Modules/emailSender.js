const nodemailer = require("nodemailer");

const senderEmail = process.env.EMAIL_USER || "your_email@gmail.com";
const appPassword = process.env.EMAIL_PASS || "your_16_char_app_password";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderEmail,
    pass: appPassword,
  },
});

const mailOptions = {
  from: senderEmail,
  to: senderEmail, // Sending a test email to yourself
  subject: "Node.js Checkpoint - Nodemailer Test",
  text: "Hello! This email was sent using Node.js and the nodemailer third-party module.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Failed to send email:", error.message);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});