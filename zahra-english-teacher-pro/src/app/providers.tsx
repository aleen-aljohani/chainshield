"use client";

import { StoreProvider } from "@/context/StoreProvider";
import { ToastProvider } from "@/context/ToastProvider";
import { ThemeManager } from "@/context/ThemeManager";
import { AppShell } from "@/components/layout/AppShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeManager />
      <ToastProvider>
        <AppShell>{children}</AppShell>
      </ToastProvider>
    </StoreProvider>
  );
}
