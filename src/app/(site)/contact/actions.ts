"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, ownerEmail } from "@/lib/email";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });
    if (error) throw error;
  } catch (error) {
    console.error("Failed to store contact message", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again, or reach out on WhatsApp.",
    };
  }

  try {
    const to = ownerEmail();
    if (to) {
      await sendEmail({
        to,
        subject: `New contact form message from ${name}`,
        html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message}</p>`,
      });
    }
  } catch (error) {
    console.error("Failed to send contact notification email", error);
  }

  return { status: "success", message: "Thanks — we'll get back to you within 24 hours." };
}
