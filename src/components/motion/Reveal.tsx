"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

/** Fades + rises into place once, when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/** Parent for a staggered group — pair with <RevealItem> children. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} variants={reduceMotion ? undefined : staggerItem}>
      {children}
    </motion.div>
  );
}

/** Zooms an image (or any fill element) from slightly-scaled down to 1x as it scrolls into view. */
export function ZoomReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ scale: reduceMotion ? 1 : 1.12 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
