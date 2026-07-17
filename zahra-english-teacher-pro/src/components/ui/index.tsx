"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { X, Inbox, Loader2 } from "lucide-react";

// ---------- Button ----------
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-offset-neutral-900";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800",
    outline:
      "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
    ghost: "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ---------- Card ----------
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Card({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export function CardHeader({ title, subtitle, action }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-700">
      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---------- Inputs ----------
export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200", className)} {...props}>
      {children}
    </label>
  );
}

const fieldBase =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  }
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(fieldBase, "min-h-[80px]", className)} {...props} />;
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(fieldBase, "pe-8", className)} {...props}>
        {children}
      </select>
    );
  }
);

// ---------- Badge ----------
export function Badge({
  children,
  color = "neutral",
  className,
}: {
  children: React.ReactNode;
  color?: "neutral" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const colors: Record<string, string> = {
    neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
    green: "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colors[color], className)}>
      {children}
    </span>
  );
}

// ---------- Empty state ----------
export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
      <div className="mb-3 text-neutral-400">{icon ?? <Inbox className="h-10 w-10" />}</div>
      <p className="font-medium text-neutral-700 dark:text-neutral-200">{title}</p>
      {hint && <p className="mt-1 max-w-md text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
}

// ---------- Loading ----------
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-neutral-500 dark:text-neutral-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ---------- Modal ----------
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cn("mt-10 w-full rounded-xl bg-white shadow-xl dark:bg-neutral-800", sizes[size])}>
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ---------- Confirm dialog ----------
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

// ---------- Stat card ----------
export function StatCard({ label, value, icon, hint }: { label: string; value: React.ReactNode; icon?: React.ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
        </div>
        {icon && <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">{icon}</div>}
      </div>
    </Card>
  );
}
