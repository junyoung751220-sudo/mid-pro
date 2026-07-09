import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateSortedList } from "@/components/nonsul/date-sorted-list";
import type { NonsulDataset } from "@/types/nonsul";

const dataset: NonsulDataset = {
  universities: [
    { id: "hanyang", name: "한양대학교" },
    { id: "sogang", name: "서강대학교" },
    { id: "snu", name: "서울대학교" },
  ],
  departments: [
    { id: "hanyang-컴퓨터공학과", universityId: "hanyang", name: "컴퓨터공학과", track: "공학" },
    { id: "sogang-경영학과", universityId: "sogang", name: "경영학과", track: "상경" },
  ],
  schedules: [
    { departmentId: "hanyang-컴퓨터공학과", date: "2026-10-03", period: "오후", time: "13:30" },
    { departmentId: "sogang-경영학과", date: "2026-09-20", period: "오전", time: "09:00" },
  ],
  minimumRequirements: [],
  reflectionRatios: [],
};

describe("DateSortedList", () => {
  it("lists universities in date-ascending order with date/period/time", () => {
    render(<DateSortedList dataset={dataset} />);

    const names = screen.getAllByTestId("university-name").map((el) => el.textContent);
    expect(names).toEqual(["서강대학교", "한양대학교", "서울대학교"]);

    expect(screen.getByText("2026-09-20")).toBeInTheDocument();
    expect(screen.getByText("오전 · 09:00")).toBeInTheDocument();
    expect(screen.getByText("2026-10-03")).toBeInTheDocument();
    expect(screen.getByText("오후 · 13:30")).toBeInTheDocument();
  });

  it("shows '데이터 없음' for universities with no schedule data", () => {
    render(<DateSortedList dataset={dataset} />);

    expect(screen.getAllByText("데이터 없음").length).toBeGreaterThan(0);
  });
});
