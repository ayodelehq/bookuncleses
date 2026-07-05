import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();

  const [{ count: pendingBookings }, { count: upcomingEvents }, { count: messages }] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Pending Bookings", value: pendingBookings ?? 0, href: "/admin/bookings" },
    { label: "Published Events", value: upcomingEvents ?? 0, href: "/admin/events" },
    { label: "Contact Messages", value: messages ?? 0, href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border-subtle bg-surface p-6 transition-colors hover:border-brand"
          >
            <p className="text-3xl font-bold text-brand">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
