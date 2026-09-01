import * as brevo from "@getbrevo/brevo";

export async function sendEmail(to, subject, html) {
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY,
  );

  const email = new brevo.SendSmtpEmail();
  email.sender = { name: "AI Tutor", email: process.env.BREVO_SENDER_EMAIL };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;

  await apiInstance.sendTransacEmail(email);
}
