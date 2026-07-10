"use client";

import { useActionState } from "react";
import { deleteGalleryCategory, type GalleryCategoryState } from "@/app/admin/gallery/actions";

const initialState: GalleryCategoryState = { status: "idle" };

export function GalleryCategoryDeleteButton({ value }: { value: string }) {
  const [state, formAction, pending] = useActionState(deleteGalleryCategory, initialState);

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction}>
        <input type="hidden" name="value" value={value} />
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline disabled:opacity-60"
        >
          {pending ? "Deleting..." : "Delete"}
        </button>
      </form>
      {state.status === "error" ? <p className="text-xs text-status-danger">{state.message}</p> : null}
    </div>
  );
}
