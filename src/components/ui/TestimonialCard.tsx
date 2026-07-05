function Stars() {
  return (
    <div className="flex gap-1 text-brand" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCard({
  name,
  quote,
  eventType,
  featured = false,
}: {
  name: string;
  quote: string;
  eventType?: string | null;
  featured?: boolean;
}) {
  return (
    <figure
      className={`flex h-full flex-col rounded-2xl p-6 ${
        featured ? "bg-surface-alt" : "bg-surface"
      }`}
    >
      <Stars />
      <blockquote className="mt-4 flex-1 font-mono text-sm leading-[1.6] text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 text-sm font-semibold">
        {name}
        {eventType ? <span className="block font-mono text-xs font-normal text-muted">{eventType}</span> : null}
      </figcaption>
    </figure>
  );
}
