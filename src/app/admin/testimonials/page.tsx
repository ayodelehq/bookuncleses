import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/app/admin/testimonials/actions";
import type { Testimonial } from "@/lib/supabase/types";

export default async function AdminTestimonialsPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();

  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const testimonials = (data as Testimonial[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Testimonials</h1>
      <p className="mt-1 text-sm text-muted">
        Controls the &ldquo;Client Feedback&rdquo; section on the home page. The section only appears
        once at least one testimonial exists.
      </p>

      <div className="mt-6 space-y-4">
        {testimonials.map((testimonial) => (
          <form
            key={testimonial.id}
            action={updateTestimonial}
            className="rounded-2xl border border-border-subtle bg-surface p-5"
          >
            <input type="hidden" name="id" value={testimonial.id} />
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Name</span>
                <input
                  name="name"
                  defaultValue={testimonial.name}
                  required
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  Event type (optional)
                </span>
                <input
                  name="eventType"
                  defaultValue={testimonial.event_type ?? ""}
                  placeholder="e.g. Wedding"
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Sort order</span>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={testimonial.sort_order}
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                />
              </label>
            </div>

            <label className="mt-3 flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Quote</span>
              <textarea
                name="quote"
                defaultValue={testimonial.quote}
                required
                rows={3}
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>

            <div className="mt-3 flex items-center justify-end gap-4">
              <button
                type="submit"
                className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-brand hover:underline"
              >
                Save
              </button>
              <button
                type="submit"
                formAction={deleteTestimonial}
                className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline"
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        {testimonials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-subtle bg-surface p-6 text-center text-sm text-muted">
            No testimonials yet — the Client Feedback section on Home stays hidden until you add one.
          </p>
        ) : null}
      </div>

      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5">
        <h2 className="text-lg font-semibold">Add a testimonial</h2>
        <form action={createTestimonial} className="mt-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Name</span>
              <input
                name="name"
                required
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Event type (optional)
              </span>
              <input
                name="eventType"
                placeholder="e.g. Wedding"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Sort order</span>
              <input
                type="number"
                name="sortOrder"
                defaultValue={testimonials.length + 1}
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Quote</span>
            <textarea
              name="quote"
              required
              rows={3}
              className="rounded-lg border border-border-subtle bg-background px-3 py-2"
            />
          </label>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="min-h-11 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
            >
              Add Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
