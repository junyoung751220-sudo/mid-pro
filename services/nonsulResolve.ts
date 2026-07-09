import type {
  Department,
  EssayExamSchedule,
  MinimumRequirement,
  NonsulDataset,
  ReflectionRatio,
  ResolvedDepartmentInfo,
} from "@/types/nonsul";

interface DepartmentRecords {
  schedule: EssayExamSchedule | null;
  minimumRequirement: MinimumRequirement | null;
  reflectionRatio: ReflectionRatio | null;
}

function recordsFor(dataset: NonsulDataset, departmentId: string): DepartmentRecords {
  return {
    schedule:
      dataset.schedules.find((item) => item.departmentId === departmentId) ?? null,
    minimumRequirement:
      dataset.minimumRequirements.find((item) => item.departmentId === departmentId) ??
      null,
    reflectionRatio:
      dataset.reflectionRatios.find((item) => item.departmentId === departmentId) ??
      null,
  };
}

function hasAnyRecord(records: DepartmentRecords): boolean {
  return (
    records.schedule !== null ||
    records.minimumRequirement !== null ||
    records.reflectionRatio !== null
  );
}

export function resolveDepartmentDisplay(
  dataset: NonsulDataset,
  universityId: string,
  departmentId: string
): ResolvedDepartmentInfo {
  const university = dataset.universities.find((item) => item.id === universityId);
  const requestedDepartment = dataset.departments.find(
    (item) => item.id === departmentId
  );

  if (!university || !requestedDepartment) {
    throw new Error(`Unknown university/department: ${universityId}/${departmentId}`);
  }

  const exactRecords = recordsFor(dataset, requestedDepartment.id);

  if (hasAnyRecord(exactRecords)) {
    return {
      universityName: university.name,
      requestedDepartmentName: requestedDepartment.name,
      displayDepartmentName: requestedDepartment.name,
      isSubstituted: false,
      ...exactRecords,
    };
  }

  const substitute = findSameTrackSubstitute(dataset, requestedDepartment);

  if (substitute) {
    return {
      universityName: university.name,
      requestedDepartmentName: requestedDepartment.name,
      displayDepartmentName: substitute.department.name,
      isSubstituted: true,
      ...substitute.records,
    };
  }

  return {
    universityName: university.name,
    requestedDepartmentName: requestedDepartment.name,
    displayDepartmentName: requestedDepartment.name,
    isSubstituted: false,
    schedule: null,
    minimumRequirement: null,
    reflectionRatio: null,
  };
}

function findSameTrackSubstitute(
  dataset: NonsulDataset,
  requestedDepartment: Department
): { department: Department; records: DepartmentRecords } | null {
  const candidates = dataset.departments.filter(
    (department) =>
      department.universityId === requestedDepartment.universityId &&
      department.track === requestedDepartment.track &&
      department.id !== requestedDepartment.id
  );

  for (const candidate of candidates) {
    const records = recordsFor(dataset, candidate.id);
    if (hasAnyRecord(records)) {
      return { department: candidate, records };
    }
  }

  return null;
}
