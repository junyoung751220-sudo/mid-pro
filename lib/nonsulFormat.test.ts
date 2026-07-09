import { describe, expect, it } from "vitest";
import { formatExamDateTime, formatExamPeriodTime } from "@/lib/nonsulFormat";
import type { EssayExamSchedule } from "@/types/nonsul";

const schedule: EssayExamSchedule = {
  departmentId: "sogang-경영학과",
  date: "2026-09-20",
  period: "오전",
  time: "09:00",
};

describe("formatExamPeriodTime", () => {
  it("formats period and time as '오전 · 09:00'", () => {
    expect(formatExamPeriodTime(schedule)).toBe("오전 · 09:00");
  });
});

describe("formatExamDateTime", () => {
  it("formats date, period, and time as '2026-09-20 · 오전 · 09:00'", () => {
    expect(formatExamDateTime(schedule)).toBe("2026-09-20 · 오전 · 09:00");
  });
});
