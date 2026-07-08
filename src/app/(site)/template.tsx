"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

// Next.js remounts `template.tsx` on every navigation (unlike layout.tsx),
// which is what gives each page its own subtle entrance instead of an
// instant snap when moving between routes.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
