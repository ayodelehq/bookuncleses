"use client";

import { useMemo, useState } from "react";
import { deleteContactMessage } from "@/app/admin/messages/actions";
import type { ContactMessage } from "@/lib/supabase/types";

const PAGE_SIZE = 10;

export function AdminMessagesList({ messages }: { messages: ContactMessage[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter(
      (message) =>
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query),
    );
  }, [messages, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const paginated = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Search</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, or message..."
            className="w-64 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </label>
        <p className="text-sm text-muted">
          {filtered.length} of {messages.length} message{messages.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {paginated.length === 0 ? (
          <p className="rounded-2xl border border-border-subtle bg-surface p-6 text-center text-sm text-muted">
            {messages.length === 0 ? "No messages yet." : "No messages match your search."}
          </p>
        ) : (
          paginated.map((message) => (
            <div key={message.id} className="rounded-2xl border border-border-subtle bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{message.name}</p>
                  <a href={`mailto:${message.email}`} className="text-sm text-brand hover:underline">
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted">
                    {new Date(message.created_at).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <form action={deleteContactMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button
                      type="submit"
                      className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{message.message}</p>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page_ === 1}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page_}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                n === page_
                  ? "bg-brand text-brand-foreground"
                  : "border border-border-subtle hover:border-brand hover:text-brand"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page_ === totalPages}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
