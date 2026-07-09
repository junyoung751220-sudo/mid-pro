import { describe, expect, it } from "vitest";
import { findOverlappingEntryIds } from "@/services/nonsulOverlap";

describe("findOverlappingEntryIds", () => {
  it("marks entries whose dates match another entry's date, ignoring period", () => {
    const result = findOverlappingEntryIds([
      { id: "b", date: "2026-09-20" },
      { id: "c", date: "2026-09-20" },
      { id: "a", date: "2026-09-18" },
    ]);

    expect(result.has("b")).toBe(true);
    expect(result.has("c")).toBe(true);
    expect(result.has("a")).toBe(false);
  });

  it("does not mark entries with no date (no data)", () => {
    const result = findOverlappingEntryIds([
      { id: "x", date: null },
      { id: "y", date: null },
    ]);

    expect(result.size).toBe(0);
  });

  it("clears overlap once only one of the colliding entries remains", () => {
    const result = findOverlappingEntryIds([{ id: "b", date: "2026-09-20" }]);

    expect(result.has("b")).toBe(false);
  });
});
