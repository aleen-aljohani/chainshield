import { AppState, SCHEMA_VERSION } from "./types";
import { createDefaultState } from "./defaults";

export const STORAGE_KEY = "zahra-english-teacher-pro:v1";

/**
 * Safe, versioned local-storage layer.
 * - Never throws on corrupted data (falls back to defaults).
 * - Supports simple forward migrations by version.
 * - Merges loaded data over defaults so new fields always exist.
 */

type Migration = (state: any) => any;

const migrations: Record<number, Migration> = {
  // Example future migration:
  // 1: (s) => ({ ...s, version: 2, newField: [] }),
};

function migrate(state: any): any {
  let current = state;
  while (typeof current.version === "number" && current.version < SCHEMA_VERSION) {
    const m = migrations[current.version];
    if (!m) {
      current.version = SCHEMA_VERSION;
      break;
    }
    current = m(current);
  }
  return current;
}

/** Deep-merge loaded partial state over a fresh default so shape is guaranteed. */
function reconcile(loaded: any): AppState {
  const base = createDefaultState(false);
  if (!loaded || typeof loaded !== "object") return createDefaultState(true);
  const merged: AppState = { ...base };
  for (const key of Object.keys(base) as (keyof AppState)[]) {
    const val = (loaded as any)[key];
    if (val === undefined || val === null) continue;
    // Arrays and primitives: take loaded; objects: shallow-merge over default.
    if (Array.isArray((base as any)[key])) {
      (merged as any)[key] = Array.isArray(val) ? val : (base as any)[key];
    } else if (typeof (base as any)[key] === "object") {
      (merged as any)[key] = { ...(base as any)[key], ...val };
    } else {
      (merged as any)[key] = val;
    }
  }
  merged.version = SCHEMA_VERSION;
  return merged;
}

export function loadState(): AppState {
  if (typeof window === "undefined") return createDefaultState(true);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState(true);
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    return reconcile(migrated);
  } catch (err) {
    // Corrupted storage — preserve a backup of the bad blob and start clean.
    try {
      const bad = window.localStorage.getItem(STORAGE_KEY);
      if (bad) window.localStorage.setItem(STORAGE_KEY + ":corrupted-backup", bad);
    } catch {
      /* ignore */
    }
    console.warn("Local data was corrupted and has been reset. A backup copy was kept.");
    return createDefaultState(true);
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Could not save data locally (storage may be full).", err);
  }
}

export function exportState(state: AppState): string {
  const payload = {
    app: "Zahra Aljehani – English Teacher Pro",
    exportedAt: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
    data: state,
  };
  return JSON.stringify(payload, null, 2);
}

export interface ImportResult {
  ok: boolean;
  state?: AppState;
  error?: string;
}

export function parseImport(json: string): ImportResult {
  try {
    const parsed = JSON.parse(json);
    const data = parsed?.data ?? parsed;
    if (!data || typeof data !== "object") {
      return { ok: false, error: "The file does not contain valid application data." };
    }
    const state = reconcile(migrate(data));
    return { ok: true, state };
  } catch (err) {
    return { ok: false, error: "The file is not valid JSON." };
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
