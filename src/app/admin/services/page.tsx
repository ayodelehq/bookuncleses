import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createService, deleteService, updateService } from "@/app/admin/services/actions";
import { ServiceIcon, serviceIconOptions } from "@/components/ui/ServiceIcon";
import type { Service, ServiceCategory, ServiceKind } from "@/lib/supabase/types";

const kindOptions: { value: ServiceKind; label: string }[] = [
  { value: "bookable", label: "Bookable (links to a rate card package)" },
  { value: "quote", label: "Quote-only (links to Contact)" },
  { value: "teaser", label: "Teaser (shows a badge, e.g. \"Coming Soon\")" },
];

const categoryOptions: { value: ServiceCategory; label: string }[] = [
  { value: "entertainment", label: "Entertainment" },
  { value: "creative", label: "Creative Services" },
  { value: "event", label: "Event Services" },
];

const categoryLabels: Record<ServiceCategory, string> = {
  entertainment: "Entertainment",
  creative: "Creative Services",
  event: "Event Services",
};

export default async function AdminServicesPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();

  const { data } = await supabase.from("services").select("*").order("sort_order");
  const services = (data as Service[] | null) ?? [];
  const groups: ServiceCategory[] = ["entertainment", "creative", "event"];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Services</h1>
      <p className="mt-1 text-sm text-muted">
        Controls the &ldquo;What We Offer&rdquo; tiles on the home page — title, description,
        category group, and which button/link each one shows. Sort order only needs to be unique
        within a category group, not across all services. Pricing for bookable services is still
        managed on the <span className="font-medium">Rate Card</span> page.
      </p>

      {groups.map((group) => {
        const groupServices = services.filter((service) => service.category === group);
        if (groupServices.length === 0) return null;

        return (
          <div key={group} className="mt-8">
            <h2 className="text-lg font-semibold">{categoryLabels[group]}</h2>
            <div className="mt-3 space-y-4">
              {groupServices.map((service) => (
                <form
                  key={service.id}
                  action={updateService}
                  className="rounded-2xl border border-border-subtle bg-surface p-5"
                >
                  <input type="hidden" name="id" value={service.id} />
                  <div className="grid gap-3 sm:grid-cols-4">
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Title</span>
                      <input
                        name="title"
                        defaultValue={service.title}
                        required
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Category</span>
                      <select
                        name="category"
                        defaultValue={service.category}
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Kind</span>
                      <select
                        name="kind"
                        defaultValue={service.kind}
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      >
                        {kindOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Icon</span>
                      <div className="flex items-center gap-2">
                        <ServiceIcon icon={service.icon} className="h-5 w-5 shrink-0 text-brand-secondary" />
                        <select
                          name="icon"
                          defaultValue={service.icon}
                          className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2"
                        >
                          {serviceIconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                  </div>

                  <label className="mt-3 flex flex-col gap-1 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">
                      Description
                    </span>
                    <textarea
                      name="description"
                      defaultValue={service.description}
                      required
                      rows={3}
                      className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                    />
                  </label>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Badge (optional)
                      </span>
                      <input
                        name="badge"
                        defaultValue={service.badge ?? ""}
                        placeholder="e.g. Coming Soon"
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Button label
                      </span>
                      <input
                        name="ctaLabel"
                        defaultValue={service.cta_label}
                        required
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Button link
                      </span>
                      <input
                        name="ctaHref"
                        defaultValue={service.cta_href}
                        required
                        className="rounded-lg border border-border-subtle bg-background px-3 py-2"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Sort order
                      </span>
                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={service.sort_order}
                        className="w-24 rounded-lg border border-border-subtle bg-background px-3 py-2"
                      />
                    </label>
                    <div className="flex items-center gap-4">
                      <button type="submit" className="text-sm font-semibold text-brand hover:underline">
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={deleteService}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </form>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5">
        <h2 className="text-lg font-semibold">Add a service</h2>
        <form action={createService} className="mt-3">
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Title</span>
              <input
                name="title"
                required
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Category</span>
              <select
                name="category"
                defaultValue="entertainment"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Kind</span>
              <select
                name="kind"
                defaultValue="bookable"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              >
                {kindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Icon</span>
              <select
                name="icon"
                defaultValue="star"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              >
                {serviceIconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Description</span>
            <textarea
              name="description"
              required
              rows={3}
              className="rounded-lg border border-border-subtle bg-background px-3 py-2"
            />
          </label>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Badge (optional)
              </span>
              <input
                name="badge"
                placeholder="e.g. Coming Soon"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Button label</span>
              <input
                name="ctaLabel"
                required
                placeholder="e.g. View Packages"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Button link</span>
              <input
                name="ctaHref"
                required
                placeholder="/rate-card#photography"
                className="rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Sort order</span>
              <input
                type="number"
                name="sortOrder"
                defaultValue={services.length + 1}
                className="w-24 rounded-lg border border-border-subtle bg-background px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
