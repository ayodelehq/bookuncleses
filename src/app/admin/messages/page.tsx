import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { AdminMessagesList } from "@/components/admin/AdminMessagesList";
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
      <div className="mt-6">
        <AdminMessagesList messages={messages} />
      </div>
    </div>
  );
}
