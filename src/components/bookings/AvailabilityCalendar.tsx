"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function AvailabilityCalendar({
  blockedDates,
  onSelect,
}: {
  blockedDates: string[];
  onSelect: (date: string) => void;
}) {
  const blockedSet = useMemo(() => new Set(blockedDates), [blockedDates]);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(today));

  const weeks = useMemo(() => {
    const firstDay = startOfMonth(monthCursor);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [monthCursor]);

  const monthLabel = monthCursor.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
  const canGoPrev = startOfMonth(monthCursor) > startOfMonth(today);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="rounded-full p-2 text-muted hover:bg-surface-alt disabled:opacity-30"
          aria-label="Previous month"
        >
          &larr;
        </button>
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.08em]">{monthLabel}</p>
        <button
          type="button"
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="rounded-full p-2 text-muted hover:bg-surface-alt"
          aria-label="Next month"
        >
          &rarr;
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-xs text-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flatMap((row, ri) =>
          row.map((date, ci) => {
            if (!date) return <div key={`${ri}-${ci}`} />;
            const iso = toISODate(date);
            const disabled = date < today || blockedSet.has(iso);
            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(iso)}
                className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-muted/40 line-through"
                    : "hover:bg-brand hover:text-brand-foreground"
                }`}
              >
                {date.getDate()}
              </button>
            );
          }),
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-border-subtle" /> Unavailable
      </p>
    </div>
  );
}
