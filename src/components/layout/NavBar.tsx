"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { mainNav, siteConfig } from "@/lib/site-config";

const easeOut = [0.16, 1, 0.3, 1] as const;

const drawerVariants = {
  hidden: { opacity: 0, height: 0 },
  show: { opacity: 1, height: "auto", transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
};

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      setHidden(goingDown && y > 120);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ) : null}
      </AnimatePresence>

      <motion.header
        className="fixed inset-x-0 top-4 z-50 px-4 sm:px-10 lg:px-16"
        initial={{ y: reduceMotion ? 0 : -24, opacity: 0 }}
        animate={{
          y: !open && hidden ? -100 : 0,
          opacity: 1,
        }}
        transition={
          !open && hidden
            ? { duration: 0.25, ease: "easeInOut" }
            : { type: "spring", stiffness: 260, damping: 24 }
        }
      >
        <div
          className={`mx-auto w-full max-w-328 overflow-hidden bg-surface shadow-sm ${
            open ? "rounded-2xl" : "rounded-lg"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3 sm:px-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
              onClick={() => setOpen(false)}
            >
              <Image src="/brand/logo-color.png" alt="" aria-hidden width={28} height={35} className="h-7 w-auto" />
              {siteConfig.name}
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
                      <motion.span
                        layoutId="nav-active-underline"
                        className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:inline-block">
              <Link
                href="/bookings"
                className="inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                Check Availability
              </Link>
            </motion.div>

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

          <AnimatePresence>
            {open ? (
              <motion.nav
                className="flex flex-col items-center gap-1 overflow-hidden border-t border-border-subtle px-6 pb-6 pt-2 sm:hidden"
                variants={reduceMotion ? undefined : drawerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {mainNav.map((item) => (
                  <motion.div key={item.href} variants={reduceMotion ? undefined : linkVariants} className="w-full">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block w-full rounded-md px-2 py-2 text-center text-sm font-medium ${
                        pathname === item.href ? "text-brand" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={reduceMotion ? undefined : linkVariants} className="mt-3 w-full">
                  <Link
                    href="/bookings"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-brand-foreground"
                  >
                    Check Availability
                  </Link>
                </motion.div>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
