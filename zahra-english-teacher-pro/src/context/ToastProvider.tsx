"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 print:hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-start gap-2 rounded-lg border bg-white px-4 py-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 animate-fade-in max-w-sm"
          >
            {t.kind === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />}
            {t.kind === "error" && <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />}
            {t.kind === "info" && <Info className="h-5 w-5 shrink-0 text-blue-500" />}
            <span className="text-sm text-neutral-800 dark:text-neutral-100">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="ms-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
