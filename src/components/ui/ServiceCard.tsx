import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { ServiceIconKey } from "@/lib/supabase/types";

export function ServiceCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: ServiceIconKey;
  title: string;
  description: string;
  badge?: string | null;
}) {
  return (
    <div className="flex h-full min-h-64 gap-4">
      <div className="w-0.5 shrink-0 bg-linear-to-b from-brand/10 via-brand to-brand/10" />
      <div className="flex flex-1 flex-col">
        <ServiceIcon icon={icon} className="h-9 w-9 text-brand" />
        <div className="mt-4 flex flex-1 flex-col justify-center">
          {badge ? (
            <span className="mb-2 inline-block w-fit rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-accent-foreground">
              {badge}
            </span>
          ) : null}
          <h3 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-normal text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
