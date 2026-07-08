"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/(site)/contact/actions";
import { SubmitButton } from "@/components/motion/SubmitButton";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
      </div>

      <SubmitButton
        type="submit"
        pending={pending}
        pendingLabel="Sending..."
        className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        Send Message
      </SubmitButton>

      {state.status !== "idle" ? (
        <p className={`text-sm ${state.status === "success" ? "text-brand" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
