import { requireAdminUser } from "@/lib/auth/admin";
import { createEvent } from "@/app/admin/events/actions";

export default async function NewEventPage() {
  await requireAdminUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">New Event</h1>

      <form action={createEvent} className="mt-6 flex max-w-2xl flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Venue</label>
            <input
              name="venue"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <input
              name="eventDate"
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Cover Image URL (optional)</label>
          <input
            name="coverImageUrl"
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <fieldset className="rounded-lg border border-border-subtle p-4">
          <legend className="px-1 text-sm font-medium">Ticket Tiers (fill in what you need)</legend>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="grid grid-cols-3 gap-2">
                <input
                  name={`tier${n}Name`}
                  placeholder={n === 1 ? "e.g. Early Bird" : n === 2 ? "e.g. Regular" : "e.g. VIP"}
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                />
                <input
                  name={`tier${n}Price`}
                  type="number"
                  placeholder="Price"
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                />
                <input
                  name={`tier${n}Quantity`}
                  type="number"
                  placeholder="Quantity"
                  className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="self-start rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
        >
          Create Event (Draft)
        </button>
      </form>
    </div>
  );
}
