import { describe, expect, it } from "vitest";
import { resolveDepartmentDisplay } from "@/services/nonsulResolve";
import type { NonsulDataset } from "@/types/nonsul";

function makeDataset(): NonsulDataset {
  return {
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
      { departmentId: "d-컴퓨터공학과", rawText: "수,과탐(1) 등급합 5 이내" },
    ],
    reflectionRatios: [
      { departmentId: "a-경영학과", essayPercent: 70, recordPercent: 30 },
      { departmentId: "d-컴퓨터공학과", essayPercent: 60, recordPercent: 40 },
    ],
  };
}

describe("resolveDepartmentDisplay", () => {
  it("returns the exact department data when it exists", () => {
    const result = resolveDepartmentDisplay(makeDataset(), "a", "a-경영학과");

    expect(result.universityName).toBe("A대학교");
    expect(result.displayDepartmentName).toBe("경영학과");
    expect(result.isSubstituted).toBe(false);
    expect(result.schedule?.date).toBe("2026-09-20");
    expect(result.minimumRequirement?.rawText).toBe("국,수,영,탐(1) 중 3개 등급합 6 이내");
    expect(result.reflectionRatio).toEqual({
      departmentId: "a-경영학과",
      essayPercent: 70,
      recordPercent: 30,
    });
  });

  it("substitutes same-university same-track department data when the exact one is missing", () => {
    const result = resolveDepartmentDisplay(makeDataset(), "d", "d-소프트웨어학과");

    expect(result.requestedDepartmentName).toBe("소프트웨어학과");
    expect(result.displayDepartmentName).toBe("컴퓨터공학과");
    expect(result.isSubstituted).toBe(true);
    expect(result.schedule?.date).toBe("2026-10-03");
  });

  it("returns all-null fields when no same-track substitute exists either", () => {
    const result = resolveDepartmentDisplay(makeDataset(), "e", "e-철학과");

    expect(result.displayDepartmentName).toBe("철학과");
    expect(result.isSubstituted).toBe(false);
    expect(result.schedule).toBeNull();
    expect(result.minimumRequirement).toBeNull();
    expect(result.reflectionRatio).toBeNull();
  });
});
