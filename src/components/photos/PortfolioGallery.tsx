"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { galleryCategories } from "@/lib/gallery-categories";
import type { GalleryItem } from "@/lib/supabase/types";

export function PortfolioGallery({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory)),
    [items, activeCategory],
  );

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

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all" ? "bg-brand text-brand-foreground" : "border border-border-subtle"
          }`}
        >
          All
        </button>
        {galleryCategories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setActiveCategory(category.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.value
                ? "bg-brand text-brand-foreground"
                : "border border-border-subtle"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No items in this category yet.</p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-border-subtle bg-surface text-left"
            >
              {item.media_type === "image" ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.url}
                    alt={item.caption ?? "Portfolio photo"}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative flex aspect-video w-full items-center justify-center bg-foreground/90 text-background">
                  <span className="text-3xl">&#9654;</span>
                </div>
              )}
              {item.caption ? <p className="p-3 text-sm text-muted">{item.caption}</p> : null}
            </button>
          ))}
        </div>
      )}

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
                  className="object-contain"
                />
              </div>
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
