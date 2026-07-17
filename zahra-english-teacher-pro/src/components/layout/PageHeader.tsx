"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 no-print">
        <Link href="/" className="flex items-center gap-1 hover:text-brand-600">
          <Home className="h-3.5 w-3.5" />
        </Link>
        {breadcrumbs?.map((b, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            {b.href ? (
              <Link href={b.href} className="hover:text-brand-600">
                {b.label}
              </Link>
            ) : (
              <span className="text-neutral-700 dark:text-neutral-300">{b.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
          {description && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 no-print">{actions}</div>}
      </div>
    </div>
  );
}
