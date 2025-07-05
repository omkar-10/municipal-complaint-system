import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ Instead of host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"MBMC Helpdesk" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text, // Fallback for non-HTML clients
      html, // ✅ Official HTML version
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};

// export const sendEmail = async (to, subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: `"Municipal System" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });
//     console.log("✅ Email sent to", to);
//   } catch (err) {
//     console.error("❌ Email sending failed:", err);
//   }
// };
