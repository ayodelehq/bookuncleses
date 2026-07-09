"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A continuously-scrolling horizontal row that loops seamlessly (content is
 * duplicated internally). Takes pre-rendered items (not a render function) —
 * this component is a client boundary, and functions can't cross from a
 * server component into it, but already-constructed elements can.
 */
export function MarqueeRow({
  items,
  direction = "left",
  durationSeconds,
  itemWidthClassName = "w-80",
}: {
  items: ReactNode[];
  direction?: "left" | "right";
  /** Full loop duration. Defaults to a speed proportional to item count so rows of different lengths feel similarly paced. */
  durationSeconds?: number;
  itemWidthClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const duration = durationSeconds ?? Math.max(20, items.length * 8);

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap gap-6">
        {items.map((item, index) => (
          <div key={index} className={`${itemWidthClassName} shrink-0`}>
            {item}
          </div>
        ))}
      </div>
    );
  }

  const track = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-6"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {track.map((item, index) => (
          <div
            key={index}
            className={`${itemWidthClassName} shrink-0`}
            aria-hidden={index >= items.length}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
