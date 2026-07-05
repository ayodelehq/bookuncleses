const icons = {
  image: (
    <path
      d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 13 5-6 3.5 4L16 9l5 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  video: (
    <path
      d="M3 6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Zm13 4 5-3v10l-5-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

/**
 * Stand-in for real photo/video assets the business hasn't supplied yet.
 * Swap for an <Image>/<video> once assets exist — no structural change needed.
 */
export function MediaPlaceholder({
  kind,
  label,
  fill = false,
  className = "",
}: {
  kind: "image" | "video";
  label?: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border border-dashed border-border-subtle bg-surface-alt/40 text-muted ${
        fill ? "absolute inset-0" : ""
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 opacity-70">
        {icons[kind]}
      </svg>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
        {label ?? (kind === "video" ? "Video required" : "Image required")}
      </p>
    </div>
  );
}
