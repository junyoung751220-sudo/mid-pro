import { describe, expect, it } from "vitest";
import { listSchedulesSortedByDate } from "@/services/nonsulSchedule";
import type { NonsulDataset } from "@/types/nonsul";

function makeDataset(): NonsulDataset {
  return {
    universities: [
      { id: "sogang", name: "서강대학교" },
      { id: "skku", name: "성균관대학교" },
      { id: "cau", name: "중앙대학교" },
      { id: "hanyang", name: "한양대학교" },
      { id: "snu", name: "서울대학교" },
    ],
    departments: [
      { id: "sogang-경영학과", universityId: "sogang", name: "경영학과", track: "상경" },
      { id: "skku-화학과", universityId: "skku", name: "화학과", track: "자연" },
      { id: "cau-경영학과", universityId: "cau", name: "경영학과", track: "상경" },
      { id: "hanyang-컴퓨터공학과", universityId: "hanyang", name: "컴퓨터공학과", track: "공학" },
    ],
    schedules: [
      { departmentId: "sogang-경영학과", date: "2026-09-20", period: "오전", time: "09:00" },
      { departmentId: "skku-화학과", date: "2026-09-20", period: "오후", time: "14:00" },
      { departmentId: "cau-경영학과", date: "2026-09-26", period: "오전", time: "10:00" },
      { departmentId: "hanyang-컴퓨터공학과", date: "2026-10-03", period: "오후", time: "13:30" },
    ],
    minimumRequirements: [],
    reflectionRatios: [],
  };
}

describe("listSchedulesSortedByDate", () => {
  it("returns universities with schedules sorted by date ascending", () => {
    const { withSchedule } = listSchedulesSortedByDate(makeDataset());

    expect(withSchedule.map((entry) => entry.universityName)).toEqual([
      "서강대학교",
      "성균관대학교",
      "중앙대학교",
      "한양대학교",
    ]);
    expect(withSchedule[0].schedule.date).toBe("2026-09-20");
    expect(withSchedule[3].schedule.date).toBe("2026-10-03");
  });

  it("returns universities without any department schedule separately", () => {
    const { withoutSchedule } = listSchedulesSortedByDate(makeDataset());

    expect(withoutSchedule.map((entry) => entry.universityName)).toEqual(["서울대학교"]);
  });
});
