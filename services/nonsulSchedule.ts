import type { EssayExamSchedule, NonsulDataset } from "@/types/nonsul";

export interface UniversityScheduleEntry {
  universityId: string;
  universityName: string;
  schedule: EssayExamSchedule;
}

export interface UniversityWithoutSchedule {
  universityId: string;
  universityName: string;
}

export interface ScheduleListResult {
  withSchedule: UniversityScheduleEntry[];
  withoutSchedule: UniversityWithoutSchedule[];
}

function scheduleSortKey(schedule: EssayExamSchedule): string {
  return `${schedule.date}T${schedule.time}`;
}

export function listSchedulesSortedByDate(
  dataset: NonsulDataset
): ScheduleListResult {
  const withSchedule: UniversityScheduleEntry[] = [];
  const withoutSchedule: UniversityWithoutSchedule[] = [];

  for (const university of dataset.universities) {
    const departmentIds = new Set(
      dataset.departments
        .filter((department) => department.universityId === university.id)
        .map((department) => department.id)
    );

    const schedules = dataset.schedules.filter((schedule) =>
      departmentIds.has(schedule.departmentId)
    );

    if (schedules.length === 0) {
      withoutSchedule.push({
        universityId: university.id,
        universityName: university.name,
      });
      continue;
    }

    const distinctSchedules = Array.from(
      new Map(
        schedules.map((schedule) => [
          `${schedule.date}-${schedule.period}-${schedule.time}`,
          schedule,
        ])
      ).values()
    );

    for (const schedule of distinctSchedules) {
      withSchedule.push({
        universityId: university.id,
        universityName: university.name,
        schedule,
      });
    }
  }

  withSchedule.sort((a, b) =>
    scheduleSortKey(a.schedule).localeCompare(scheduleSortKey(b.schedule))
  );

  return { withSchedule, withoutSchedule };
}
