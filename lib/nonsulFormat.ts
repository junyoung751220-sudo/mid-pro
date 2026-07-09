import type { EssayExamSchedule } from "@/types/nonsul";

export function formatExamPeriodTime(schedule: EssayExamSchedule): string {
  return `${schedule.period} · ${schedule.time}`;
}

export function formatExamDateTime(schedule: EssayExamSchedule): string {
  return `${schedule.date} · ${formatExamPeriodTime(schedule)}`;
}
