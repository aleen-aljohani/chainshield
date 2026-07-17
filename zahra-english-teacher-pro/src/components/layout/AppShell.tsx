"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useStore } from "@/context/StoreProvider";
import { Loading } from "@/components/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { ready } = useStore();

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ps-64">
        <Header onMenu={() => setMobileOpen(true)} />
        <main className="app-main mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {ready ? children : <Loading />}
        </main>
      </div>
    </div>
  );
}
