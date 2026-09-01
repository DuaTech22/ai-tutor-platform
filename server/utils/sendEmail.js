import { Brevo } from "@getbrevo/brevo";

export async function sendEmail(to, subject, html) {
  try {
    console.log("📧 Sending email to:", to);

    const brevoClient = new Brevo({
      apiKey: process.env.BREVO_API_KEY,
    });

    const response = await brevoClient.sendTransacEmail({
      sender: {
        name: "AI Tutor",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    console.log("✅ Email sent successfully!");
    return response;
  } catch (error) {
    console.error("❌ Brevo API error:", error.message);
    throw new Error("Failed to send email");
  }
}
