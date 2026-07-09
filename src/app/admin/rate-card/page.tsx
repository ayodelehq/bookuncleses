import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  createAddon,
  createRateCardItem,
  deleteAddon,
  deleteRateCardItem,
  updateAddonPrice,
  updateRateCardPrice,
} from "@/app/admin/rate-card/actions";
import type { Addon, RateCardCategory, RateCardItem } from "@/lib/supabase/types";

const categories: { value: RateCardCategory; label: string }[] = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Video Coverage & Content Creation" },
  { value: "event_hosting", label: "Event Hosting & MC" },
  { value: "stand_up_comedy", label: "Stand-up Comedy" },
  { value: "hype_man", label: "Hype Man" },
  { value: "event_planning", label: "Event Planning" },
];

export default async function AdminRateCardPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();

  const [{ data: rateCardData }, { data: addonsData }] = await Promise.all([
    supabase.from("rate_card").select("*").order("sort_order"),
    supabase.from("addons").select("*").order("sort_order"),
  ]);

  const rateCard = (rateCardData as RateCardItem[] | null) ?? [];
  const addons = (addonsData as Addon[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Rate Card</h1>
      <p className="mt-1 text-sm text-muted">
        Prices left blank show as &ldquo;Price on request&rdquo; on the public site.
      </p>

      {categories.map((category) => {
        const items = rateCard.filter((item) => item.category === category.value);
        return (
          <div key={category.value} className="mt-8">
            <h2 className="text-lg font-semibold">{category.label}</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="p-3">Package</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Price (₦)</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border-subtle last:border-0">
                      <td className="p-3">
                        <p className="font-medium">{item.package_name}</p>
                        <p className="text-xs text-muted">{item.description}</p>
                      </td>
                      <td className="p-3">{item.duration}</td>
                      <td className="p-3">
                        <form action={updateRateCardPrice} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            type="number"
                            name="price"
                            defaultValue={item.price ?? ""}
                            placeholder="e.g. 150000"
                            className="w-32 rounded-lg border border-border-subtle bg-background px-2 py-1"
                          />
                          <button type="submit" className="text-xs font-semibold text-brand hover:underline">
                            Save
                          </button>
                        </form>
                      </td>
                      <td className="p-3">
                        <form action={deleteRateCardItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form action={createRateCardItem} className="mt-3 flex flex-wrap items-end gap-2">
              <input type="hidden" name="category" value={category.value} />
              <input
                name="packageName"
                placeholder="Package name"
                required
                className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
              />
              <input
                name="description"
                placeholder="What's included"
                required
                className="min-w-[220px] flex-1 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
              />
              <input
                name="duration"
                placeholder="Duration"
                required
                className="w-28 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-28 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
              >
                Add Package
              </button>
            </form>
          </div>
        );
      })}

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Add-ons</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
          <table className="w-full min-w-[500px] text-sm">
            <thead className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price (₦)</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {addons.map((addon) => (
                <tr key={addon.id} className="border-b border-border-subtle last:border-0">
                  <td className="p-3">{addon.name}</td>
                  <td className="p-3">
                    <form action={updateAddonPrice} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={addon.id} />
                      <input
                        type="number"
                        name="price"
                        defaultValue={addon.price ?? ""}
                        className="w-32 rounded-lg border border-border-subtle bg-background px-2 py-1"
                      />
                      <button type="submit" className="text-xs font-semibold text-brand hover:underline">
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <form action={deleteAddon}>
                      <input type="hidden" name="id" value={addon.id} />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createAddon} className="mt-3 flex flex-wrap items-end gap-2">
          <input
            name="name"
            placeholder="Add-on name"
            required
            className="min-w-[220px] flex-1 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-28 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
          >
            Add Add-on
          </button>
        </form>
      </div>
    </div>
  );
}
