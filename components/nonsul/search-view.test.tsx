import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchView } from "@/components/nonsul/search-view";
import type { NonsulDataset } from "@/types/nonsul";

const dataset: NonsulDataset = {
  universities: [
    { id: "a", name: "A대학교" },
    { id: "d", name: "D대학교" },
    { id: "e", name: "E대학교" },
  ],
  departments: [
    { id: "a-경영학과", universityId: "a", name: "경영학과", track: "상경" },
    { id: "d-소프트웨어학과", universityId: "d", name: "소프트웨어학과", track: "공학" },
    { id: "d-컴퓨터공학과", universityId: "d", name: "컴퓨터공학과", track: "공학" },
    { id: "e-철학과", universityId: "e", name: "철학과", track: "인문" },
  ],
  schedules: [
    { departmentId: "a-경영학과", date: "2026-09-20", period: "오전", time: "09:00" },
    { departmentId: "d-컴퓨터공학과", date: "2026-10-03", period: "오후", time: "13:30" },
  ],
  minimumRequirements: [
    { departmentId: "a-경영학과", rawText: "국,수,영,탐(1) 중 3개 등급합 6 이내" },
  ],
  reflectionRatios: [
    { departmentId: "a-경영학과", essayPercent: 70, recordPercent: 30 },
  ],
};

async function addEntry(
  user: ReturnType<typeof userEvent.setup>,
  universityName: string,
  departmentName: string
) {
  await user.selectOptions(screen.getByLabelText("학교"), universityName);
  await user.selectOptions(screen.getByLabelText("학과"), departmentName);
  await user.click(screen.getByRole("button", { name: "추가" }));
}

describe("SearchView", () => {
  it("adds an entry with exact data and shows schedule/minimum-requirement/ratio", async () => {
    const user = userEvent.setup();
    render(<SearchView dataset={dataset} />);

    await addEntry(user, "A대학교", "경영학과");

    expect(screen.getByText("A대학교 / 경영학과")).toBeInTheDocument();
    expect(screen.getByText("2026-09-20 · 오전 · 09:00")).toBeInTheDocument();
    expect(screen.getByText("국,수,영,탐(1) 중 3개 등급합 6 이내")).toBeInTheDocument();
    expect(screen.getByText("논술 70% + 학생부 30%")).toBeInTheDocument();
  });

  it("shows the substituted department name when the exact department has no data", async () => {
    const user = userEvent.setup();
    render(<SearchView dataset={dataset} />);

    await addEntry(user, "D대학교", "소프트웨어학과");

    expect(screen.getByText("D대학교 / 소프트웨어학과")).toBeInTheDocument();
    expect(screen.getByText(/같은 계열 대표 데이터\(컴퓨터공학과\)/)).toBeInTheDocument();
    expect(screen.getByText("2026-10-03 · 오후 · 13:30")).toBeInTheDocument();
  });

  it("shows '데이터 없음' for all fields when no substitute exists either", async () => {
    const user = userEvent.setup();
    render(<SearchView dataset={dataset} />);

    await addEntry(user, "E대학교", "철학과");

    expect(screen.getByText("E대학교 / 철학과")).toBeInTheDocument();
    expect(screen.getAllByText("데이터 없음")).toHaveLength(3);
  });

  it("removes an entry when its remove button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchView dataset={dataset} />);

    await addEntry(user, "A대학교", "경영학과");
    expect(screen.getByText("A대학교 / 경영학과")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "제거" }));
    expect(screen.queryByText("A대학교 / 경영학과")).not.toBeInTheDocument();
  });

  it("shows the current entry count", async () => {
    const user = userEvent.setup();
    render(<SearchView dataset={dataset} />);

    expect(screen.getByText("담긴 항목 0 / 10")).toBeInTheDocument();

    await addEntry(user, "A대학교", "경영학과");
    expect(screen.getByText("담긴 항목 1 / 10")).toBeInTheDocument();
  });
});
