import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/SignOutButton";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Events & Tickets", href: "/admin/events" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Rate Card", href: "/admin/rate-card" },
  { label: "Services", href: "/admin/services" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Supabase env vars may not be configured yet — render the same
  // "signed out" shell instead of a 500 in that case.
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  } catch {
    user = null;
  }

  return (
    <div className="flex min-h-screen">
      {user ? (
        <aside className="hidden w-56 shrink-0 border-r border-border-subtle bg-surface p-6 sm:block">
          <p className="text-lg font-semibold">Admin</p>
          <nav className="mt-8 flex flex-col gap-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-background hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-border-subtle pt-4">
            <p className="truncate text-xs text-muted">{user.email}</p>
            <div className="mt-2">
              <SignOutButton />
            </div>
          </div>
        </aside>
      ) : null}
      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
