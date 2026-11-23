const nodemailer = require("nodemailer");

const userEmail = process.env.EMAIL_USER || "osegbegoldenjoe1@gmail.com";
const appPassword = process.env.EMAIL_PASS || "Ux-p?K7BI4mIK_";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userEmail,
    pass: appPassword,
  },
});

const mailOptions = {
  from: userEmail,
  to: userEmail,
  subject: "Hello from Node.js!",
  text: "This is a test email sent from Node.js using nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error.message);
  } else {
    console.log("Email sent:", info.response);
  }
});