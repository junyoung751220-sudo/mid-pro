import type { NonsulDataset } from "@/types/nonsul";

export const UNIVERSITIES: NonsulDataset["universities"] = [
  { id: "snu", name: "서울대학교" },
  { id: "yonsei", name: "연세대학교" },
  { id: "korea", name: "고려대학교" },
  { id: "sogang", name: "서강대학교" },
  { id: "skku", name: "성균관대학교" },
  { id: "hanyang", name: "한양대학교" },
  { id: "cau", name: "중앙대학교" },
  { id: "khu", name: "경희대학교" },
  { id: "hufs", name: "한국외국어대학교" },
  { id: "uos", name: "서울시립대학교" },
  { id: "konkuk", name: "건국대학교" },
  { id: "dongguk", name: "동국대학교" },
  { id: "hongik", name: "홍익대학교" },
  { id: "ssu", name: "숭실대학교" },
  { id: "sejong", name: "세종대학교" },
];

function departmentsFor(
  universityId: string,
  names: { name: string; track: NonsulDataset["departments"][number]["track"] }[]
): NonsulDataset["departments"] {
  return names.map(({ name, track }) => ({
    id: `${universityId}-${name}`,
    universityId,
    name,
    track,
  }));
}

const COMMON_DEPARTMENTS: {
  name: string;
  track: NonsulDataset["departments"][number]["track"];
}[] = [
  { name: "국어국문학과", track: "인문" },
  { name: "사학과", track: "인문" },
  { name: "철학과", track: "인문" },
  { name: "경영학과", track: "상경" },
  { name: "경제학과", track: "상경" },
  { name: "수학과", track: "자연" },
  { name: "화학과", track: "자연" },
  { name: "컴퓨터공학과", track: "공학" },
  { name: "전자공학과", track: "공학" },
  { name: "소프트웨어학과", track: "공학" },
];

export const DEPARTMENTS: NonsulDataset["departments"] = UNIVERSITIES.flatMap(
  (university) => departmentsFor(university.id, COMMON_DEPARTMENTS)
);

export const SCHEDULES: NonsulDataset["schedules"] = [];

export const MINIMUM_REQUIREMENTS: NonsulDataset["minimumRequirements"] = [];

export const REFLECTION_RATIOS: NonsulDataset["reflectionRatios"] = [];

export const NONSUL_DATASET: NonsulDataset = {
  universities: UNIVERSITIES,
  departments: DEPARTMENTS,
  schedules: SCHEDULES,
  minimumRequirements: MINIMUM_REQUIREMENTS,
  reflectionRatios: REFLECTION_RATIOS,
};
