"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SignOutButton } from "@/components/admin/SignOutButton";

export function AdminMobileNav({
  navItems,
  userEmail,
}: {
  navItems: { label: string; href: string }[];
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-border-subtle bg-surface sm:hidden">
      <div className="flex items-center justify-between p-4">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image src="/brand/logo-color.png" alt="" aria-hidden width={28} height={35} className="h-7 w-auto" />
          Admin
        </Link>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          whileTap={{ scale: 0.94 }}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full"
        >
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={`h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 ${
                open ? "translate-y-1.75 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 self-end rounded-full bg-foreground transition-all duration-300 ${
                open ? "w-5 -translate-y-1.75 -rotate-45" : "w-3.5"
              }`}
            />
          </span>
        </motion.button>
      </div>
      {open ? (
        <nav className="flex flex-col gap-1 border-t border-border-subtle p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                pathname === item.href ? "bg-background text-foreground" : "text-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
            <p className="truncate text-xs text-muted">{userEmail}</p>
            <SignOutButton />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
