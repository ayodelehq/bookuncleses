"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

function Spinner({ light }: { light?: boolean }) {
  return (
    <motion.span
      aria-hidden
      className={`inline-block h-4 w-4 rounded-full border-2 border-t-transparent ${
        light ? "border-white/40 border-t-white" : "border-brand/30 border-t-brand"
      }`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}

/** A submit/action button with hover/tap micro-interaction and a spinner while pending. */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
  className = "",
  light = true,
  ...props
}: {
  pending?: boolean;
  pendingLabel?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Spinner color: light (for buttons with a solid brand/dark background) or dark (outline buttons). */
  light?: boolean;
} & Omit<HTMLMotionProps<"button">, "children" | "className">) {
  return (
    <motion.button
      {...props}
      disabled={pending || props.disabled}
      whileHover={pending ? undefined : { scale: 1.02 }}
      whileTap={pending ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
    >
      {pending ? <Spinner light={light} /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </motion.button>
  );
}
