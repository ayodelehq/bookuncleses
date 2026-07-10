"use client";

import { useMemo, useState } from "react";
import { deleteGalleryItem } from "@/app/admin/gallery/actions";
import { getCloudinaryVideoThumbnail } from "@/lib/media";
import type { GalleryCategoryRow, GalleryItem } from "@/lib/supabase/types";

const PAGE_SIZE = 12;

export function AdminGalleryGrid({
  items,
  categories,
}: {
  items: GalleryItem[];
  categories: GalleryCategoryRow[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch = !query || (item.caption ?? "").toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [items, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const paginated = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <div>
      <div className="mt-10 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Search caption</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search captions..."
            className="w-56 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Category</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted">
          {filtered.length} of {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border-subtle bg-surface p-8 text-center text-sm text-muted">
          No items match your search.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-3 md:grid-cols-4">
          {paginated.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
              {item.media_type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail grid, avoids next/image config churn per new upload host
                <img src={item.url} alt={item.caption ?? ""} className="aspect-4/3 w-full object-cover" />
              ) : (
                <div className="relative aspect-video w-full overflow-hidden bg-foreground/90 text-background">
                  {getCloudinaryVideoThumbnail(item.url) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-generated
                    // thumbnail, not a Next/Image-managed asset
                    <img
                      src={getCloudinaryVideoThumbnail(item.url) ?? undefined}
                      alt={item.caption ?? ""}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-semibold uppercase tracking-wide">
                    Video
                  </div>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs font-semibold uppercase text-muted">{item.category.replace("_", " ")}</p>
                {item.caption ? <p className="mt-1 text-sm">{item.caption}</p> : null}
                <form action={deleteGalleryItem} className="mt-2">
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page_ === 1}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page_}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                n === page_
                  ? "bg-brand text-brand-foreground"
                  : "border border-border-subtle hover:border-brand hover:text-brand"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page_ === totalPages}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
