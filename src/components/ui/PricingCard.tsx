import Link from "next/link";

export function PricingCard({
  name,
  price,
  duration,
  description,
  featured = false,
  ctaHref = "/bookings",
  ctaLabel = "Book This Package",
}: {
  name: string;
  price: string;
  duration?: string;
  description: string;
  featured?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-8 ${
        featured ? "border-brand bg-surface-alt" : "border-border-subtle bg-surface"
      }`}
    >
      {featured ? (
        <span className="mb-4 inline-block w-fit rounded-full bg-brand px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-brand-foreground">
          Most Popular
        </span>
      ) : null}
      <h3 className="text-xl font-semibold tracking-[-0.04em]">{name}</h3>
      <p className="mt-2 font-mono text-3xl font-medium tracking-[-0.02em]">{price}</p>
      {duration ? (
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{duration}</p>
      ) : null}
      <p className="mt-4 flex-1 text-sm text-muted">{description}</p>
      <Link
        href={ctaHref}
        className={`mt-6 rounded-full px-5 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
          featured ? "bg-brand text-brand-foreground" : "border border-border-subtle"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
