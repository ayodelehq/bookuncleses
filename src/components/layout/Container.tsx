import type { ReactNode } from "react";

// max-width and horizontal padding match Eventry's measured values: 1312px
// content container, padding stepping 20px (mobile) -> 40px (tablet/desktop)
// -> 64px (wide, >=1440px).
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-328 px-5 sm:px-10 lg:px-16 ${className}`}>{children}</div>
  );
}
