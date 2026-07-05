import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Belt-and-suspenders: middleware.ts already redirects unauthenticated
// /admin/* page requests, but Server Actions can be invoked directly
// (bypassing middleware's route matching in some edge cases), so every
// admin mutation calls this first.
export async function requireAdminUser() {
  // Supabase env vars may not be configured yet — treat that as "not signed
  // in" (redirect to login) instead of crashing the admin page with a 500.
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");
    return user;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    redirect("/admin/login");
  }
}
