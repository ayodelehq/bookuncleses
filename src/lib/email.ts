import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping send to ${params.to}: ${params.subject}`);
    return;
  }

  await resend.emails.send({
    from: process.env.NOTIFICATIONS_FROM_EMAIL ?? "no-reply@bookuncleses.com",
    to: params.to,
    subject: params.subject,
    html: params.html,
    attachments: params.attachments,
  });
}

export function ownerEmail() {
  return process.env.BUSINESS_OWNER_EMAIL ?? process.env.NOTIFICATIONS_FROM_EMAIL ?? "";
}
