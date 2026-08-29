import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 to avoid ENETUNREACH errors in some hosting environments
  });

  await transporter.sendMail({
    from: `"AI Tutor" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
