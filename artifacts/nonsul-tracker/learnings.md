---
category: task-ordering
applied: not-yet
---
## MAX_SEARCH_ENTRIES를 계획된 Task4보다 앞당겨 Task2에서 도입

**상황**: Step 5 (plan-reviewer) 검토에서 wireframe의 검색 화면들에 상시 노출되는 "N / 10" 카운터가 plan.md Task 2 구현대상에 빠져 있다는 Important 이슈가 나왔다. 카운터를 보여주려면 최대값 상수가 필요한데, plan은 그 상수를 Task 4(제한 로직)에서 도입하도록 배치해 두었다.
**판단**: `MAX_SEARCH_ENTRIES` 상수를 Task 2에서 먼저 config에 추가해 카운터에 사용하고, Task 4는 그 상수를 이용한 "제한 강제" 로직만 추가하도록 역할을 나눴다. plan.md를 그대로 따랐다면 Task 2에서 카운터를 하드코딩("/10")하거나 아예 빠뜨렸을 것.
**다시 마주칠 가능성**: 중간 — "상수/설정값이 여러 Task에 걸쳐 쓰이는데 plan이 그 상수의 최초 도입 시점을 가장 마지막 사용 Task에 배치하는" 패턴은 다른 feature의 draft-plan에서도 재발할 수 있다. draft-plan 단계에서 "이 값을 쓰는 가장 이른 Task"를 상수 도입 지점으로 고르는 습관을 룰로 승격할 만한지는 사례가 더 쌓여야 판단 가능.

---
category: tooling
applied: rule
---
## Radix 기반 Combobox/Select 대신 shadcn native-select로 전환

**상황**: plan.md는 학교=Select, 학과=Combobox(검색 가능)를 지정했으나, 구현 시작 전 이 프로젝트의 `Combobox`가 `@base-ui/react` 기반 포털 컴포넌트라 jsdom(RTL) 환경에서 포인터 캡처·포지셔닝 관련 테스트가 불안정할 위험이 높다고 판단했다.
**판단**: shadcn 레지스트리에 이미 존재하는 `native-select`(순수 `<select>` 래퍼)를 설치해 학교·학과 선택 모두에 사용했다. 실제 `<select>` + `userEvent.selectOptions`는 jsdom에서 완전히 안정적으로 동작해 7개 테스트가 한 번의 재시도 없이 통과했다. spec의 "드롭다운/자동완성, 자유 텍스트 금지" 요구는 native-select로도 충족된다.
**다시 마주칠 가능성**: 높음 — 이 프로젝트(components.json: base-ui + radix-ui 혼재)에서 폼 입력 테스트가 필요한 다른 feature도 같은 이유로 Radix/base-ui Select·Combobox 대신 native-select를 우선 검토하게 될 것. `.claude/skills/shadcn/rules/forms.md`의 "Choosing form controls" 표에 "jsdom 테스트가 필요하면 native-select 우선"이라는 안내를 추가해 즉시 승격함 — 다음 feature부터는 이 판단을 반복하지 않고 룰을 따른다.

---
category: tooling
applied: rule
---
## vitest.config.ts의 exclude에 e2e/**가 빠져 있던 기존 버그 수정

**상황**: Task 1 체크포인트에서 `bun run test`(Vitest)가 `e2e/smoke.spec.ts`(Playwright 전용 `test()` API 사용)까지 주워서 "Playwright Test did not expect test() to be called here" 오류로 실패했다. `git stash`로 확인한 결과 이 문제는 이번 세션 변경과 무관하게 이미 존재했던 설정 누락이었다.
**판단**: `exclude` 배열에 `"e2e/**"`를 추가해 근본 원인을 고쳤다. 우회(예: e2e 테스트를 건너뛰거나 실패를 무시)하지 않았다.
**다시 마주칠 가능성**: 낮음(이미 고쳤으므로) — 다만 "Vitest와 Playwright가 같은 저장소에 있는데 config 분리가 안 된" 패턴 자체는 다른 신규 프로젝트 스캐폴드에서도 나타날 수 있어 `applied: rule`로 즉시 반영. (별도 규칙 파일 승격은 이 프로젝트에 한 곳만 있어 CLAUDE.md 수정 없이 커밋으로 충분하다고 판단했다.)

---
category: code-review
applied: rule
---
## 인쇄 스타일에서 강조 색상은 print-color-adjust 없이 사라질 수 있다

**상황**: Step 4 code-reviewer가 겹침 강조(`bg-destructive/10`, `Badge variant="destructive"`)가 브라우저의 "배경 그래픽 인쇄" 기본 꺼짐 설정 때문에 실제 인쇄물에서 사라질 수 있다는 Important 이슈를 지적했다. `page.emulateMedia({media:'print'})`를 쓰는 Playwright 테스트는 미디어 쿠리만 전환할 뿐 배경색 생략 동작을 재현하지 않아 이 문제를 잡지 못했다.
**판단**: `app/globals.css`에 `@media print { * { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }`를 추가해 수정. 동시에 `@page { size: A4; margin: 12mm; }`도 함께 넣어 "A4 인쇄" 요구를 CSS로 명시했다.
**다시 마주칠 가능성**: 높음 — 이 저장소에서 배경색/강조 스타일이 들어간 다른 인쇄 기능을 만들 때 반드시 재발한다. `applied: rule`로 즉시 반영(이번 수정 자체가 향후 인쇄 관련 CSS의 기준점이 됨). Playwright의 `emulateMedia`가 배경 그래픽 생략을 검증하지 못한다는 사실도 함께 기억해 둘 것 — 이 부분은 사람 확인(실제 인쇄 미리보기)이 필요한 영역으로 남는다.
