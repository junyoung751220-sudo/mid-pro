import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultRow } from "@/components/nonsul/search-result-row";
import type { ResolvedDepartmentInfo } from "@/types/nonsul";

const resolved: ResolvedDepartmentInfo = {
  universityName: "B대학교",
  requestedDepartmentName: "국어국문학과",
  displayDepartmentName: "국어국문학과",
  isSubstituted: false,
  schedule: { departmentId: "b-국어국문학과", date: "2026-09-20", period: "오전", time: "09:00" },
  minimumRequirement: null,
  reflectionRatio: null,
};

describe("SearchResultRow", () => {
  it("shows a '겹침' badge when isOverlapping is true", () => {
    render(<SearchResultRow resolved={resolved} isOverlapping onRemove={vi.fn()} />);

    expect(screen.getByText("겹침")).toBeInTheDocument();
  });

  it("does not show a '겹침' badge when isOverlapping is false", () => {
    render(
      <SearchResultRow resolved={resolved} isOverlapping={false} onRemove={vi.fn()} />
    );

    expect(screen.queryByText("겹침")).not.toBeInTheDocument();
  });
});
