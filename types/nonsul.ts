export type Track = "인문" | "상경" | "자연" | "공학" | "예체능";

export type ExamPeriod = "오전" | "오후";

export interface University {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  universityId: string;
  name: string;
  track: Track;
}

export interface EssayExamSchedule {
  departmentId: string;
  /** ISO date, e.g. "2026-09-20" */
  date: string;
  period: ExamPeriod;
  /** e.g. "09:00" */
  time: string;
}

export interface MinimumRequirement {
  departmentId: string;
  rawText: string;
}

export interface ReflectionRatio {
  departmentId: string;
  essayPercent: number;
  recordPercent: number;
}

export interface NonsulDataset {
  universities: University[];
  departments: Department[];
  schedules: EssayExamSchedule[];
  minimumRequirements: MinimumRequirement[];
  reflectionRatios: ReflectionRatio[];
}

export interface ResolvedDepartmentInfo {
  universityName: string;
  requestedDepartmentName: string;
  displayDepartmentName: string;
  isSubstituted: boolean;
  schedule: EssayExamSchedule | null;
  minimumRequirement: MinimumRequirement | null;
  reflectionRatio: ReflectionRatio | null;
}
