"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { getCloudinaryVideoThumbnail, isDirectVideoUrl } from "@/lib/media";
import { ZoomReveal } from "@/components/motion/Reveal";
import type { GalleryCategoryRow, GalleryItem } from "@/lib/supabase/types";

const PAGE_SIZE = 12;

export function PortfolioGallery({
  items,
  categories,
}: {
  items: GalleryItem[];
  categories: GalleryCategoryRow[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory)),
    [items, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-surface p-16 text-center">
        <p className="text-lg font-semibold">Gallery coming soon</p>
        <p className="mt-2 text-sm text-muted">
          Past shoots and hosted events will appear here once uploaded.
        </p>
      </div>
    );
  }

  const tabs = [{ value: "all", label: "All" }, ...categories];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveCategory(tab.value);
                setPage(1);
              }}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "text-brand-foreground" : "border border-border-subtle"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              ) : null}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No items in this category yet.</p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {paginated.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-border-subtle bg-surface text-left"
            >
              {item.media_type === "image" ? (
                <ZoomReveal>
                  {/* eslint-disable-next-line @next/next/no-img-element -- natural aspect ratio is
                  the point here (masonry grid); Next/Image's `fill` mode would force a crop. */}
                  <img
                    src={item.url}
                    alt={item.caption ?? "Portfolio photo"}
                    className="block w-full"
                    loading="lazy"
                  />
                </ZoomReveal>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden bg-foreground/90 text-background">
                  {getCloudinaryVideoThumbnail(item.url) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-generated
                    // thumbnail, not a Next/Image-managed asset
                    <img
                      src={getCloudinaryVideoThumbnail(item.url) ?? undefined}
                      alt={item.caption ?? "Video preview"}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-3xl">&#9654;</span>
                  </div>
                </div>
              )}
              {item.caption ? <p className="p-3 text-sm text-muted">{item.caption}</p> : null}
            </button>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-border-subtle px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                n === page
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
            disabled={page === totalPages}
            className="rounded-full border border-border-subtle px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      {lightboxItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-2xl text-white"
            onClick={() => setLightboxItem(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="max-h-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            {lightboxItem.media_type === "image" ? (
              <div className="relative h-[80vh] w-[90vw] max-w-4xl">
                <Image
                  src={lightboxItem.url}
                  alt={lightboxItem.caption ?? "Portfolio photo"}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            ) : isDirectVideoUrl(lightboxItem.url) ? (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="aspect-video w-[90vw] max-w-4xl bg-black"
              />
            ) : (
              <iframe
                title={lightboxItem.caption ?? "Video"}
                src={lightboxItem.url}
                className="aspect-video w-[90vw] max-w-4xl"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
