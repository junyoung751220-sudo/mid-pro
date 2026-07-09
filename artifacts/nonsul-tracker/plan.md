# nonsul-tracker 구현 계획

## 아키텍처 결정

| 결정 | 선택 | 이유 |
|---|---|---|
| 라우팅 | 단일 페이지(`app/page.tsx`), 클라이언트 상태로 뷰 전환 | 두 뷰(날짜순/검색) 모두 같은 데이터셋을 즉시 조합해 보여주는 조회 도구라 별도 라우트/서버 상태가 불필요. 로그인·저장 없음(spec 제외 항목) |
| 학교 선택 UI | `Select` (고정 15개 목록) | 목록이 짧고 고정 — 검색보다 즉시 선택이 빠름 |
| 학과 선택 UI | `Combobox` (선택된 학교의 학과만 필터링해 검색 가능) | 학과 수가 학교마다 여러 개일 수 있어 자유 텍스트 없이도 빠르게 찾을 수 있어야 함(spec 자유 텍스트 입력 금지 규칙) |
| 인쇄 구현 | `window.print()` + `@media print` CSS로 조작 UI 숨기고 인쇄 전용 표만 노출 (같은 페이지, 화면 전환 없음) | 별도 인쇄 미리보기 라우트 없이 브라우저 네이티브 인쇄 다이얼로그로 A4 결과 확인 가능 — wireframe의 "조작 UI 없음" 요구를 CSS로 충족. wireframe의 `screen-4`/`screen-5`("인쇄 미리보기" 화면 및 "돌아가기" 버튼)는 검토용 데모 편의 장치이며 실제 구현 대상이 아님 — 실제로는 탭 전환 없이 같은 화면에서 인쇄 스타일만 적용됨 |
| 학과 수치 데이터 계열 대체 범위 | 같은 대학 내 같은 계열(track)만 탐색 | 사용자 확정 사항 — 다른 대학 데이터로 대체하면 오해 소지가 커 학교 경계를 넘지 않음 |
| 데이터 소스 | `config/nonsulData.ts`의 정적 TS 모듈 (대학 15개 + 학과 목록만 시드, 논술일/수능최저/반영비율은 빈 배열) | spec: 자동 스크래핑 없음, 수동 입력 전제. 학과 목록(고정 정보)은 미리 채워 드롭다운이 동작하게 하고, 연도별로 바뀌는 수치 데이터만 비워 둠 |

## 인프라 리소스

None — 정적 데이터, 클라이언트 상태만 사용. 외부 서비스·env var·cron 없음.

## 데이터 모델

### University
- id (required)
- name (required)

### Department
- id (required)
- universityId → University (required)
- name (required)
- track: "인문" | "상경" | "자연" | "공학" | "예체능" (required) — 계열 대체 판단 기준

### EssayExamSchedule
- departmentId → Department (required)
- date (required, `YYYY-MM-DD`)
- period: "오전" | "오후" (required)
- time (required, `HH:mm`)

### MinimumRequirement
- departmentId → Department (required)
- rawText (required) — 원문 텍스트 그대로 저장(구조화 파싱 없이 표시)

### ReflectionRatio
- departmentId → Department (required)
- essayPercent (required)
- recordPercent (required)

### NonsulDataset
- universities → University[]
- departments → Department[]
- schedules → EssayExamSchedule[]
- minimumRequirements → MinimumRequirement[]
- reflectionRatios → ReflectionRatio[]

### ResolvedDepartmentInfo (조회 결과, 저장되지 않는 파생 값)
- universityName (required)
- requestedDepartmentName (required) — 사용자가 선택한 학과명
- displayDepartmentName (required) — 실제로 표시 중인 학과명(대체 시 다름)
- isSubstituted (required)
- schedule → EssayExamSchedule | null
- minimumRequirement → MinimumRequirement | null
- reflectionRatio → ReflectionRatio | null

## 필요 스킬

| 스킬 | 적용 Task | 용도 |
|---|---|---|
| shadcn | Task 2, 5 | `.claude/skills/shadcn/rules/`의 base-vs-radix, composition, forms 규칙 준수 — `Select`/`Combobox`/`Button` 조합 방식 확인, `components/ui/*` 직접 수정 금지 |
| next-best-practices | 전체 | App Router 파일 배치, client/server 컴포넌트 경계, 메타데이터 규칙 |
| vercel-react-best-practices | Task 2, 3, 4 | 리스트 렌더링·상태 업데이트 성능 패턴 (불필요한 리렌더 방지) |

## 영향 받는 파일

| 파일 경로 | 변경 유형 | 관련 Task |
|---|---|---|
| `types/nonsul.ts` | New | Task 1 |
| `config/nonsulData.ts` | New | Task 1, 4 |
| `lib/nonsulFormat.ts` | New | Task 1 |
| `services/nonsulSchedule.ts` | New | Task 1 |
| `services/nonsulResolve.ts` | New | Task 2 |
| `services/nonsulOverlap.ts` | New | Task 3 |
| `components/nonsul/date-sorted-list.tsx` | New | Task 1, 5 |
| `components/nonsul/view-tabs.tsx` | New | Task 2 |
| `components/nonsul/search-view.tsx` | New | Task 2, 3, 4, 5 |
| `components/nonsul/search-result-row.tsx` | New | Task 3 |
| `components/nonsul/print-button.tsx` | New | Task 5 |
| `app/page.tsx` | Modify | Task 1, 2 |
| `app/layout.tsx` | Modify | Task 1 (title/metadata 교체) |
| `app/globals.css` | Modify | Task 5 |
| `components/component-example.tsx`, `components/example.tsx` | Delete | Task 1 (미사용 스캐폴드 예시 제거) |
| `e2e/smoke.spec.ts` | Modify | Task 1 (타이틀 단언을 실제 앱 타이틀로 교체) |

## Tasks

### Task 1: 데이터 모델 + 날짜순 보기

- **담당 시나리오**: Scenario 1 (full)
- **크기**: M (신규 구현 파일 5개: types/config/lib/service/component. 그 외 `app/page.tsx`·`app/layout.tsx` 수정과 미사용 스캐폴드 삭제·`e2e/smoke.spec.ts` 타이틀 갱신은 부수적 정리로 크기 산정에서 제외)
- **의존성**: None
- **참조**:
  - `artifacts/nonsul-tracker/spec.md`
  - `artifacts/nonsul-tracker/wireframe.html` (screen-0)
- **구현 대상**:
  - `types/nonsul.ts`
  - `config/nonsulData.ts` — 서울 15개 대학 목록 + 대학별 학과(이름·계열) 시드, `schedules`/`minimumRequirements`/`reflectionRatios`는 빈 배열
  - `lib/nonsulFormat.ts` — `formatExamDateTime(schedule)` 등 순수 포맷 함수, `lib/nonsulFormat.test.ts`
  - `services/nonsulSchedule.ts` — `listSchedulesSortedByDate(dataset)`: 일정이 있는 대학을 날짜 오름차순으로, 일정이 없는 대학은 별도 목록으로 반환. `services/nonsulSchedule.test.ts`
  - `components/nonsul/date-sorted-list.tsx` — 위 서비스 결과를 렌더링. `components/nonsul/date-sorted-list.test.tsx`
  - `app/page.tsx` (modify) — `DateSortedList`를 기본 화면으로 렌더링
  - `app/layout.tsx` (modify) — title/description을 실제 앱 이름으로 교체
  - `components/component-example.tsx`, `components/example.tsx` (delete) — 미사용 스캐폴드
  - `e2e/smoke.spec.ts` (modify) — 새 타이틀 단언
- **수용 기준**:
  - [ ] 일정 데이터가 있는 대학 4곳(날짜가 2026-09-20, 2026-09-20, 2026-09-26, 2026-10-03인 경우)을 화면에 로드하면 날짜 오름차순으로 한 줄씩 나열된다
  - [ ] 각 행에는 대학명과 "날짜 + 오전/오후 + 시:분"이 표시된다 (예: "2026-09-20", "오전 · 09:00")
  - [ ] 일정 데이터가 없는 대학은 "데이터 없음" 문구와 함께 별도 구획에 표시된다
- **검증**: `bun run test -- nonsul` (Vitest, RTL) — 정렬 순서·포맷·데이터없음 케이스 단언. 마지막에 `bun run build`로 페이지 교체가 깨지지 않는지 확인

---

### Task 2: 학교·학과 검색으로 상세 정보 확인

- **담당 시나리오**: Scenario 2 (full)
- **크기**: M (4 파일)
- **의존성**: Task 1 (데이터 타입·config·포맷 함수 재사용)
- **참조**:
  - `artifacts/nonsul-tracker/spec.md`
  - `artifacts/nonsul-tracker/wireframe.html` (screen-1)
  - shadcn — `components/ui/select.tsx`, `components/ui/combobox.tsx` 기존 컴포넌트 사용, `.claude/skills/shadcn/rules/forms.md` 준수
- **구현 대상**:
  - `services/nonsulResolve.ts` — `resolveDepartmentDisplay(dataset, universityId, departmentId)`: 정확히 일치하는 데이터가 있으면 그대로, 없으면 같은 대학·같은 계열 내 데이터가 있는 다른 학과로 대체(표시 학과명 포함), 그것도 없으면 전부 null. `services/nonsulResolve.test.ts`
  - `components/nonsul/view-tabs.tsx` — "날짜순"/"검색" 전환 탭
  - `components/nonsul/search-view.tsx` — 학교(`Select`)·학과(`Combobox`, 선택된 학교의 학과만 노출) 입력 폼 + 현재 담긴 항목 수 표시("N / 10", wireframe screen-1~3 상시 노출 배지) + 추가된 항목 결과 리스트(학교/학과명, 논술일, 수능최저 원문, 반영비율, 대체 안내 문구, 데이터없음) + 제거 버튼. `components/nonsul/search-view.test.tsx`
  - `app/page.tsx` (modify) — `ViewTabs`로 `DateSortedList`/`SearchView` 전환
- **수용 기준**:
  - [ ] 학교="A대학교", 학과="경영학과" 선택 후 추가 → 결과 리스트에 "A대학교 / 경영학과" 행이 나타나고 논술일·수능최저·반영비율 값이 채워진다
  - [ ] 정확한 데이터가 없는 학과를 추가했을 때 같은 대학·같은 계열의 대체 데이터가 있으면, 행에 실제로 표시 중인 학과명이 함께 나타난다
  - [ ] 같은 계열 대체 데이터도 없는 학과를 추가하면 논술일·수능최저·반영비율 칸에 모두 "데이터 없음"이 표시된다
  - [ ] "검색" 탭 클릭 시 검색 화면으로, "날짜순" 탭 클릭 시 Task 1의 날짜순 화면으로 전환된다
  - [ ] 항목을 추가/제거할 때마다 "N / 10" 카운터 표시가 실제 담긴 개수와 일치한다
- **검증**: `bun run test -- nonsul` — 대체 로직 3가지 케이스(정확 일치/계열 대체/데이터 없음) 단위 테스트 + 폼 입력→행 추가 RTL 테스트 + 카운터 값 단언

---

### Task 3: 여러 학교 입력 시 논술일 겹침 강조

- **담당 시나리오**: Scenario 3 (full)
- **크기**: S (3 파일)
- **의존성**: Task 2 (검색 결과 리스트에 강조 스타일 적용)
- **참조**:
  - `artifacts/nonsul-tracker/spec.md`
  - `artifacts/nonsul-tracker/wireframe.html` (screen-2)
- **구현 대상**:
  - `services/nonsulOverlap.ts` — `findOverlappingEntryIds(entries)`: 논술일(날짜만, 시간대 무관)이 같은 항목들의 id 집합 반환. `services/nonsulOverlap.test.ts`
  - `components/nonsul/search-result-row.tsx` — `search-view.tsx`에서 행 렌더링을 분리, `isOverlapping` prop에 따라 강조 스타일 적용
  - `components/nonsul/search-view.tsx` (modify) — 겹침 계산 결과를 각 행에 전달 + 겹침 요약 배지 노출
- **수용 기준**:
  - [ ] 논술일이 2026-09-20(오전)인 "B대학교 / 국어국문학과"와 2026-09-20(오후)인 "C대학교 / 사학과"를 모두 추가하면 두 행 모두 강조 스타일이 적용된다
  - [ ] 겹치지 않는 날짜의 다른 행에는 강조 스타일이 적용되지 않는다
  - [ ] 겹치는 두 항목 중 하나를 제거하면 남은 행의 강조가 사라진다
- **검증**: `bun run test -- nonsul` — 겹침 판정 단위 테스트(날짜만 비교, 시간대 무관) + RTL로 강조 클래스 유무 단언

---

### Task 4: 검색 결과 항목 개수 제한 (최대 10개)

- **담당 시나리오**: Scenario 4 (full)
- **크기**: S (2 파일)
- **의존성**: Task 2 (검색 폼·결과 리스트에 상한 적용)
- **참조**:
  - `artifacts/nonsul-tracker/spec.md`
  - `artifacts/nonsul-tracker/wireframe.html` (screen-3)
- **구현 대상**:
  - `config/nonsulData.ts` (modify) — `MAX_SEARCH_ENTRIES = 10` 상수 추가
  - `components/nonsul/search-view.tsx` (modify) — 항목이 10개일 때 입력 폼 비활성화 + 안내 문구, 9개 이하로 줄면 다시 활성화
- **수용 기준**:
  - [ ] 항목 10개가 담긴 상태에서 11번째 추가를 시도하면 새 행이 생기지 않고 "최대 10개까지 담을 수 있습니다" 안내가 나타난다
  - [ ] 항목 하나를 제거해 9개가 되면 학교/학과 선택과 추가 버튼이 다시 활성화된다
- **검증**: `bun run test -- nonsul` — 10개 채운 fixture로 11번째 추가 시도 → 행 미생성 + 안내문구 단언, 제거 후 재활성화 단언

---

### Checkpoint: Tasks 1-4 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] 빌드 성공: `bun run build`
- [ ] 날짜순 보기 ↔ 검색 보기 전환, 검색 항목 추가/제거, 겹침 강조, 10개 상한이 실제 브라우저에서 end-to-end로 동작 (`bun run dev` 후 수동 확인 또는 Playwright)

---

### Task 5: 검색 보기·날짜순 보기 결과를 A4로 인쇄

- **담당 시나리오**: Scenario 5 (full)
- **크기**: M (5 파일)
- **의존성**: Task 1 (날짜순 화면), Task 3 (검색 화면 + 겹침 강조가 인쇄에도 유지되어야 함)
- **참조**:
  - `artifacts/nonsul-tracker/spec.md`
  - `artifacts/nonsul-tracker/wireframe.html` (screen-4, screen-5)
- **구현 대상**:
  - `components/nonsul/print-button.tsx` — 클릭 시 `window.print()` 호출
  - `app/globals.css` (modify) — `@media print` 규칙: 입력 폼·탭·버튼(인쇄 버튼 포함) 등 조작 UI `display:none`, 결과 표만 노출
  - `components/nonsul/date-sorted-list.tsx` (modify) — 인쇄 전용 요약 마크업/데이터 속성 추가
  - `components/nonsul/search-view.tsx` (modify) — 인쇄 전용 요약 마크업(겹침 강조·대체 안내 문구 유지) 추가, `PrintButton` 배치
  - `app/page.tsx` (modify) — 필요 시 `PrintButton` 배치 조정
- **수용 기준**:
  - [ ] 검색 보기에서 "인쇄" 클릭 → 현재 담긴 항목들의 표(학교·학과·논술일·수능최저·반영비율, 겹침 강조 포함)가 인쇄용 레이아웃으로 나타난다
  - [ ] 날짜순 보기에서 "인쇄" 클릭 → 날짜순 리스트가 인쇄용 레이아웃으로 나타난다
  - [ ] 인쇄 레이아웃에는 입력 폼·드롭다운·탭·버튼 등 조작 UI가 나타나지 않는다
  - [ ] 날짜순 보기에서 데이터가 없는 대학("데이터 없음")도 인쇄 레이아웃에 그대로 유지되어 나타난다
- **검증**: Playwright (`bun run test:e2e`) — `page.emulateMedia({ media: 'print' })`로 전환 후 조작 UI가 `visible`이 아님을 단언, 결과 표(겹침 강조·대체 안내·데이터없음 포함)는 보임을 단언. 실제 인쇄 다이얼로그 호출은 `window.print` 스텁을 주입해 클릭 시 호출됨을 단언. wireframe에서 "돌아가기" 버튼으로 표현됐던 화면 전환은 구현하지 않음(같은 페이지 유지)을 명시적으로 확인

---

### Checkpoint: Tasks 1-5 이후 (최종)
- [ ] 모든 테스트 통과: `bun run test`
- [ ] E2E 통과: `bun run test:e2e`
- [ ] 빌드 성공: `bun run build`
- [ ] spec.md의 5개 시나리오 전부 브라우저에서 end-to-end로 동작

## 미결정 항목

- 없음
