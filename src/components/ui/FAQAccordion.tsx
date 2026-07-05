"use client";

import { useState } from "react";

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border-subtle border-t border-border-subtle">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open}
            >
              <span className="font-medium">{item.question}</span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-alt text-base text-brand">
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? <p className="pb-5 font-mono text-sm text-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
