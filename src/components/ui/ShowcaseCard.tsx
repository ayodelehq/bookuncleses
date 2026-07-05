import Link from "next/link";
import Image from "next/image";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

export function ShowcaseCard({
  href,
  image,
  title,
  meta,
  description,
  cta = "View Details",
}: {
  href: string;
  image?: string;
  title: string;
  meta?: string;
  description?: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-colors hover:border-brand"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-border-subtle">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <MediaPlaceholder kind="image" fill />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {meta ? (
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-brand">{meta}</p>
        ) : null}
        <h3 className="text-lg font-semibold tracking-[-0.04em]">{title}</h3>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
        <span className="mt-auto pt-3 text-sm font-semibold text-brand">{cta} &rarr;</span>
      </div>
    </Link>
  );
}
