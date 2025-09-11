import config from "../Config/index.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: parseInt(config.email.port || "587"),
  secure: false, // Use `true` for port 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Define the sendMail function to send emails
export const sendMail = async (mailOptions) => {
  mailOptions.from = config.email.from;
  try {
    console.log("mailOption", mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response); // Log the email response if successful
    return info;
  } catch (error) {
    console.error("Error sending email: ", error); // Log error if email fails
    throw new Error("Error sending email");
  }
};
