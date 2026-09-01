import { Brevo } from "@getbrevo/brevo";

export async function sendEmail(to, subject, html) {
  try {
    const brevoClient = new Brevo({
      apiKey: process.env.BREVO_API_KEY,
      environment: BrevoEnvironment.PROD,
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
    console.error("❌ Brevo API error:", error);
    throw new Error("Failed to send email");
  }
}
