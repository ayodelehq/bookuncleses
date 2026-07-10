"use client";

import { useActionState } from "react";
import { createGalleryCategory, type GalleryCategoryState } from "@/app/admin/gallery/actions";

const initialState: GalleryCategoryState = { status: "idle" };

export function GalleryCategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createGalleryCategory, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">New category name</span>
        <input
          name="label"
          placeholder="e.g. Birthdays"
          required
          className="min-w-[220px] rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add Category"}
      </button>
      {state.status === "error" ? <p className="w-full text-sm text-status-danger">{state.message}</p> : null}
      {state.status === "success" ? <p className="w-full text-sm text-status-success">{state.message}</p> : null}
    </form>
  );
}
