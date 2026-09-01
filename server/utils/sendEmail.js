import * as brevo from "@getbrevo/brevo";

// Debug: Log what we have
console.log("🔍 Brevo type:", typeof brevo);
console.log("🔍 Brevo keys:", Object.keys(brevo));
console.log("🔍 Brevo default:", Object.keys(brevo.default || {}));

export async function sendEmail(to, subject, html) {
  console.log("📧 Attempting to send email to:", to);

  // Try different ways to access the API
  let apiInstance;

  // Option 1: Direct access
  if (brevo.TransactionalEmailsApi) {
    apiInstance = new brevo.TransactionalEmailsApi();
  }
  // Option 2: Access via default
  else if (brevo.default && brevo.default.TransactionalEmailsApi) {
    apiInstance = new brevo.default.TransactionalEmailsApi();
  }
  // Option 3: Try different name
  else if (brevo.TransactionalAPI) {
    apiInstance = new brevo.TransactionalAPI();
  } else {
    console.error("❌ No valid API constructor found!");
    console.log("Available keys:", Object.keys(brevo));
    throw new Error("Could not find Brevo API constructor");
  }

  // Set API key
  if (brevo.TransactionalEmailsApiApiKeys) {
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );
  } else if (brevo.ApiKey) {
    apiInstance.setApiKey(brevo.ApiKey.apiKey, process.env.BREVO_API_KEY);
  }

  const email = new brevo.SendSmtpEmail();
  email.sender = { name: "AI Tutor", email: process.env.BREVO_SENDER_EMAIL };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;

  await apiInstance.sendTransacEmail(email);
  console.log("✅ Email sent!");
}
