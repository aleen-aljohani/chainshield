"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, navGroups } from "@/lib/nav";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { GraduationCap, X } from "lucide-react";

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, lang } = useI18n();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <nav
        className={cn(
          "app-sidebar fixed inset-y-0 z-40 flex w-64 flex-col border-e border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-900 lg:translate-x-0",
          "start-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:!translate-x-0"
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-4 py-4 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold leading-tight text-neutral-900 dark:text-neutral-50">
              Zahra Aljehani
              <span className="block text-xs font-normal text-brand-600 dark:text-brand-400">English Teacher Pro</span>
            </span>
          </Link>
          <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => {
            const items = navItems.filter((n) => n.group === group.id);
            if (items.length === 0) return null;
            const groupLabel = lang === "ar" ? group.ar : group.en;
            return (
              <div key={group.id} className="mb-4">
                {groupLabel && (
                  <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{groupLabel}</p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                              : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          <span>{t(item.key)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
