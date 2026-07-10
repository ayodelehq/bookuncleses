import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { addGalleryVideo, uploadGalleryImage, uploadGalleryVideoFile } from "@/app/admin/gallery/actions";
import { AdminGalleryGrid } from "@/components/admin/AdminGalleryGrid";
import { GalleryCategoryCreateForm } from "@/components/admin/GalleryCategoryCreateForm";
import { GalleryCategoryDeleteButton } from "@/components/admin/GalleryCategoryDeleteButton";
import type { GalleryCategoryRow, GalleryItem } from "@/lib/supabase/types";

export default async function AdminGalleryPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();
  const [{ data }, { data: categoriesData }] = await Promise.all([
    supabase.from("gallery_items").select("*").order("created_at", { ascending: false }),
    supabase.from("gallery_categories").select("*").order("sort_order"),
  ]);
  const items = (data as GalleryItem[] | null) ?? [];
  const categories = (categoriesData as GalleryCategoryRow[] | null) ?? [];
  const itemCountByCategory = new Map<string, number>();
  for (const item of items) {
    itemCountByCategory.set(item.category, (itemCountByCategory.get(item.category) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Gallery</h1>

      <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-5">
        <h2 className="font-semibold">Categories</h2>
        <p className="mt-1 text-sm text-muted">
          These power the filter tabs on the public Photos &amp; Videos page. A category with items
          in it can&apos;t be deleted until those items are moved or removed.
        </p>
        {categories.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border-subtle bg-background p-4 text-sm text-status-danger">
            No categories found. This usually means the <code>gallery_categories</code> database
            migration (supabase/migrations/0012_gallery_categories.sql) hasn&apos;t been run yet —
            run it in the Supabase Dashboard SQL Editor, then reload this page.
          </p>
        ) : null}
        <ul className="mt-4 flex flex-col gap-2">
          {categories.map((category) => {
            const count = itemCountByCategory.get(category.value) ?? 0;
            return (
              <li
                key={category.value}
                className="flex items-center justify-between rounded-lg border border-border-subtle bg-background px-4 py-2 text-sm"
              >
                <span>
                  {category.label} <span className="text-muted">({count} item{count === 1 ? "" : "s"})</span>
                </span>
                {count === 0 ? (
                  <GalleryCategoryDeleteButton value={category.value} />
                ) : (
                  <span className="text-xs text-muted">In use</span>
                )}
              </li>
            );
          })}
        </ul>
        <GalleryCategoryCreateForm />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <form action={uploadGalleryImage} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-semibold">Upload Photo</h2>
          <p className="text-xs text-muted">Uploads to Cloudinary.</p>
          <select name="category" required className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input type="file" name="file" accept="image/*" required className="text-sm" />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="min-h-11 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
            Upload
          </button>
        </form>

        <form action={uploadGalleryVideoFile} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-semibold">Upload Video File</h2>
          <p className="text-xs text-muted">Uploads to Cloudinary.</p>
          <select name="category" required className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input type="file" name="file" accept="video/*" required className="text-sm" />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="min-h-11 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
            Upload
          </button>
        </form>

        <form action={addGalleryVideo} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-semibold">Add Video (YouTube/Vimeo embed)</h2>
          <p className="text-xs text-muted">Paste a link to a video already hosted elsewhere.</p>
          <select name="category" required className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            name="embedUrl"
            placeholder="https://www.youtube.com/embed/..."
            required
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="min-h-11 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
            Add Video
          </button>
        </form>
      </div>

      <AdminGalleryGrid items={items} categories={categories} />
    </div>
  );
}
