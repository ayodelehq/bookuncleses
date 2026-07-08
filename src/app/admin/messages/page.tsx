import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteContactMessage } from "@/app/admin/messages/actions";
import type { ContactMessage } from "@/lib/supabase/types";

export default async function AdminMessagesPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  const messages = (data as ContactMessage[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-muted">Submissions from the site's contact form.</p>

      <div className="mt-6 space-y-4">
        {messages.length === 0 ? (
          <p className="rounded-2xl border border-border-subtle bg-surface p-6 text-center text-sm text-muted">
            No messages yet.
          </p>
        ) : (
          messages.map((message) => (
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
                    <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
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
    </div>
  );
}
