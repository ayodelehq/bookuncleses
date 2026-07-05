import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { addGalleryVideo, deleteGalleryItem, uploadGalleryImage } from "@/app/admin/gallery/actions";
import { galleryCategories } from "@/lib/gallery-categories";
import type { GalleryItem } from "@/lib/supabase/types";

export default async function AdminGalleryPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
  const items = (data as GalleryItem[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Gallery</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <form action={uploadGalleryImage} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-semibold">Upload Photo</h2>
          <select name="category" required className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm">
            {galleryCategories.map((category) => (
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
          <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
            Upload
          </button>
        </form>

        <form action={addGalleryVideo} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-semibold">Add Video (YouTube/Vimeo embed)</h2>
          <select name="category" required className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm">
            {galleryCategories.map((category) => (
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
          <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
            Add Video
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
            {item.media_type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail grid, avoids next/image config churn per new upload host
              <img src={item.url} alt={item.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-foreground/90 text-background">
                Video
              </div>
            )}
            <div className="p-3">
              <p className="text-xs font-semibold uppercase text-muted">{item.category.replace("_", " ")}</p>
              <form action={deleteGalleryItem} className="mt-2">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
