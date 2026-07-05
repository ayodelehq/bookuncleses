"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav, siteConfig } from "@/lib/site-config";

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-10 lg:px-16">
        <div
          className={`mx-auto w-full max-w-328 overflow-hidden bg-surface shadow-sm ${
            open ? "rounded-2xl" : "rounded-lg"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3 sm:px-10">
            <Link href="/" className="text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
              {siteConfig.name}
              <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-top" />
            </Link>

            <nav className="hidden items-center gap-8 sm:flex">
              {mainNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative pb-1 text-sm font-medium transition-colors ${
                      active ? "text-ink" : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/bookings"
              className="hidden rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              Check Availability
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative inline-flex h-9 w-9 items-center justify-center sm:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`absolute h-0.5 w-6 bg-foreground transition-transform ${
                  open ? "rotate-45" : "-translate-y-2"
                }`}
              />
              <span className={`absolute h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
              <span
                className={`absolute h-0.5 w-6 bg-foreground transition-transform ${
                  open ? "-rotate-45" : "translate-y-2"
                }`}
              />
            </button>
          </div>

          {open ? (
            <nav className="flex flex-col items-center gap-1 border-t border-border-subtle px-6 pb-6 pt-2 sm:hidden">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`w-full rounded-md px-2 py-2 text-center text-sm font-medium ${
                    pathname === item.href ? "text-brand" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/bookings"
                onClick={() => setOpen(false)}
                className="mt-3 w-full rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-brand-foreground"
              >
                Check Availability
              </Link>
            </nav>
          ) : null}
        </div>
      </header>
    </>
  );
}
