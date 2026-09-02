import axios from "axios";

export async function sendEmail(to, subject, html) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "AI Tutor", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
}
