"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

// Fixed per-slot transforms — an irregular scattered-print stack, not a
// perfect grid. Slot 0 is the front (active) photo; each tick, every photo
// advances one slot toward the front and the front photo cycles to the back.
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 40, opacity: 1 },
  { x: 22, y: 18, rotate: 6, scale: 0.93, zIndex: 30, opacity: 0.85 },
  { x: -18, y: 30, rotate: -5, scale: 0.87, zIndex: 20, opacity: 0.65 },
  { x: 12, y: 40, rotate: 4, scale: 0.82, zIndex: 10, opacity: 0.45 },
];

export function HeroImageStack({
  images,
  intervalMs = 4200,
}: {
  images: { src: string; caption?: string | null }[];
  intervalMs?: number;
}) {
  const visible = images.slice(0, SLOTS.length);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || visible.length <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % visible.length), intervalMs);
    return () => clearInterval(id);
  }, [reduceMotion, visible.length, intervalMs]);

  if (visible.length === 0) {
    return (
      <div>
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl">
          <MediaPlaceholder kind="image" label="Hero image required" fill />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-3/4 max-h-[52vh] w-full sm:max-h-[58vh] lg:max-h-[62vh]">
        {visible.map((img, i) => {
          const slot = (i - active + visible.length) % visible.length;
          const style = SLOTS[Math.min(slot, SLOTS.length - 1)];
          const isFront = slot === 0;

          return (
            <motion.div
              key={img.src}
              className="absolute inset-2 overflow-hidden rounded-3xl shadow-lg"
              style={{ zIndex: style.zIndex }}
              animate={
                reduceMotion
                  ? { x: 0, y: 0, rotate: 0, scale: isFront ? 1 : 0, opacity: isFront ? 1 : 0 }
                  : { x: style.x, y: style.y, rotate: style.rotate, scale: style.scale, opacity: style.opacity }
              }
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <Image
                src={img.src}
                alt={img.caption ?? "Portfolio photo"}
                fill
                sizes="(min-width: 810px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 min-h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs text-muted"
          >
            {visible[active]?.caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
