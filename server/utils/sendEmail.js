import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add these to fix timeout
    port: 465,
    secure: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
  });

  await transporter.sendMail({
    from: `"AI Tutor" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
