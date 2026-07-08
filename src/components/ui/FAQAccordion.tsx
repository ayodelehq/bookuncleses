"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const rowVariants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
};

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="divide-y divide-border-subtle border-t border-border-subtle"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <motion.div key={item.question} variants={reduceMotion ? undefined : rowVariants}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open}
            >
              <span className="font-medium">{item.question}</span>
              <motion.span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-alt text-base text-brand"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {open ? "−" : "+"}
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 font-mono text-sm text-muted">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
