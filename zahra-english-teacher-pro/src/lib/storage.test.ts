import { describe, it, expect } from "vitest";
import { parseImport, exportState } from "./storage";
import { createDefaultState } from "./defaults";

describe("storage validation", () => {
  it("round-trips a valid export/import", () => {
    const state = createDefaultState(true);
    const json = exportState(state);
    const result = parseImport(json);
    expect(result.ok).toBe(true);
    expect(result.state?.profile.name).toBe("Zahra Aljehani");
  });

  it("rejects invalid JSON", () => {
    const result = parseImport("{ not json");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not valid JSON/);
  });

  it("rejects non-object payloads", () => {
    const result = parseImport("123");
    expect(result.ok).toBe(false);
  });

  it("reconciles a partial payload against defaults (missing fields filled)", () => {
    const result = parseImport(JSON.stringify({ data: { profile: { name: "Test" } } }));
    expect(result.ok).toBe(true);
    // arrays that were missing get default (seed) values, not undefined
    expect(Array.isArray(result.state?.questions)).toBe(true);
    expect(result.state?.profile.name).toBe("Test");
    // untouched nested defaults still present
    expect(result.state?.settings.language).toBe("en");
  });

  it("accepts a bare state object (no wrapper)", () => {
    const state = createDefaultState(false);
    const result = parseImport(JSON.stringify(state));
    expect(result.ok).toBe(true);
  });
});
