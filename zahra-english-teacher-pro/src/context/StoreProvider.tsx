"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { AppState } from "@/lib/types";
import { loadState, saveState, clearStorage } from "@/lib/storage";
import { createDefaultState } from "@/lib/defaults";

interface StoreContextValue {
  state: AppState;
  ready: boolean;
  setState: (updater: AppState | ((prev: AppState) => AppState)) => void;
  update: (partial: Partial<AppState>) => void;
  logActivity: (message: string) => void;
  replaceState: (next: AppState) => void;
  resetAll: () => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(() => createDefaultState(true));
  const [ready, setReady] = useState(false);
  const skipSave = useRef(true);

  // Load from localStorage on mount (client only).
  useEffect(() => {
    const loaded = loadState();
    setStateRaw(loaded);
    setReady(true);
    // allow the first post-load save to be skipped
    skipSave.current = true;
  }, []);

  // Persist on change (after initial load).
  useEffect(() => {
    if (!ready) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    saveState(state);
  }, [state, ready]);

  const setState = useCallback(
    (updater: AppState | ((prev: AppState) => AppState)) => {
      setStateRaw((prev) => (typeof updater === "function" ? (updater as any)(prev) : updater));
    },
    []
  );

  const update = useCallback((partial: Partial<AppState>) => {
    setStateRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const logActivity = useCallback((message: string) => {
    setStateRaw((prev) => ({
      ...prev,
      activity: [
        { id: crypto.randomUUID(), message, at: new Date().toISOString() },
        ...prev.activity,
      ].slice(0, 40),
    }));
  }, []);

  const replaceState = useCallback((next: AppState) => {
    skipSave.current = false;
    setStateRaw(next);
  }, []);

  const resetAll = useCallback(() => {
    clearStorage();
    const fresh = createDefaultState(false);
    setStateRaw(fresh);
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = createDefaultState(true);
    setStateRaw(fresh);
  }, []);

  return (
    <StoreContext.Provider
      value={{ state, ready, setState, update, logActivity, replaceState, resetAll, resetDemo }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
