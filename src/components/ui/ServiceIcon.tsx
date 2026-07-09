import type { ServiceIconKey } from "@/lib/supabase/types";

export const serviceIconOptions: { value: ServiceIconKey; label: string }[] = [
  { value: "microphone", label: "Microphone" },
  { value: "spotlight", label: "Spotlight" },
  { value: "bolt", label: "Bolt (energy)" },
  { value: "star", label: "Star (sparkle)" },
  { value: "ticket", label: "Ticket" },
  { value: "camera", label: "Camera" },
  { value: "video", label: "Video" },
  { value: "megaphone", label: "Megaphone" },
  { value: "calendar", label: "Calendar" },
];

export function ServiceIcon({ icon, className = "h-6 w-6" }: { icon: ServiceIconKey; className?: string }) {
  const shared = { viewBox: "0 0 24 24", className, "aria-hidden": true } as const;

  switch (icon) {
    case "microphone":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3M9 21h6" />
        </svg>
      );
    case "spotlight":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <circle cx="12" cy="3.5" r="1.3" fill="currentColor" stroke="none" />
          <path d="M9 6h6l4 14H5z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...shared} fill="currentColor" stroke="none">
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      );
    case "star":
      return (
        <svg {...shared} fill="currentColor" stroke="none">
          <path d="M12 2 13.8 7.2 19 9 13.8 10.8 12 16 10.2 10.8 5 9 10.2 7.2Z" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4z" />
          <path d="M14 6v2M14 16v2M14 11v2" />
        </svg>
      );
    case "camera":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "video":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="m16 10 5-3v10l-5-3z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h3l11-5v16L6 15H3z" />
          <path d="M6 15v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3" />
          <path d="M18 9a4.5 4.5 0 0 1 0 6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="m8 15 2 2 4-4" />
        </svg>
      );
  }
}
