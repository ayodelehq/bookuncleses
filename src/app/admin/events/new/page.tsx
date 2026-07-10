import { requireAdminUser } from "@/lib/auth/admin";
import { createEvent } from "@/app/admin/events/actions";

export default async function NewEventPage() {
  await requireAdminUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">New Event</h1>

      <form action={createEvent} className="mt-6 flex max-w-2xl flex-col gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="venue" className="text-sm font-medium">
              Venue
            </label>
            <input
              id="venue"
              name="venue"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="eventDate" className="text-sm font-medium">
              Date & Time
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="coverImageUrl" className="text-sm font-medium">
            Cover Image URL (optional)
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>

        <fieldset className="rounded-lg border border-border-subtle p-4">
          <legend className="px-1 text-sm font-medium">Ticket Tiers (fill in what you need)</legend>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor={`tier${n}Name`} className="text-xs font-medium text-muted">
                    Tier {n} name
                  </label>
                  <input
                    id={`tier${n}Name`}
                    name={`tier${n}Name`}
                    placeholder={n === 1 ? "e.g. Early Bird" : n === 2 ? "e.g. Regular" : "e.g. VIP"}
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`tier${n}Price`} className="text-xs font-medium text-muted">
                    Price
                  </label>
                  <input
                    id={`tier${n}Price`}
                    name={`tier${n}Price`}
                    type="number"
                    placeholder="Price"
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`tier${n}Quantity`} className="text-xs font-medium text-muted">
                    Quantity
                  </label>
                  <input
                    id={`tier${n}Quantity`}
                    name={`tier${n}Quantity`}
                    type="number"
                    placeholder="Quantity"
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="min-h-11 self-start rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
        >
          Create Event (Draft)
        </button>
      </form>
    </div>
  );
}
