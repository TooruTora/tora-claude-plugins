---
description: 소규모 기능의 빠른 기획 노트 작성. 4시간 미만의 단일 시스템 기능에 적합한 3섹션 경량 포맷.
argument-hint: "[기능명] (예: pause-menu, item-tooltip, minimap)"
---

빠른 기획 노트 작성 워크플로우를 시작합니다.

대상 기능: $ARGUMENTS

**범위 체크 (먼저 실행):**

다음 질문으로 범위를 확인합니다:
- 이 기능이 영향을 미치는 시스템이 몇 개인가요?
- 수학적 공식이나 복잡한 상태 머신이 필요한가요?
- 설계 시간이 4시간을 초과할 것 같나요?

→ 범위가 너무 크면: "이 기능은 quick-design보다 큰 범위입니다. `/gdd-design $ARGUMENTS`로 전체 GDD를 작성하는 것을 권장합니다." 출력 후 종료.

**워크플로우 (범위 내인 경우):**

1. **기존 파일 확인:**
   - `design/quick-notes/$ARGUMENTS.md`가 존재하면: 현재 내용을 보여주고 업데이트 여부 질문. **수정으로 md를 갱신하면 대응 html(`design/html/quick-notes/$ARGUMENTS.html`)도 md 전체를 다시 렌더해 반드시 재생성합니다.**

2. **3가지 질문으로 시작:**
   - 이 기능이 정확히 무엇을 하나요?
   - 플레이어가 이것을 어떻게 경험하나요?
   - 완료를 어떻게 판단하나요?

3. **3섹션 스펙 초안 작성:**

   **섹션 1: Overview**
   - 이 기능이 무엇이고 왜 존재하는지 2-3문장

   **섹션 2: Rules**
   - 구현을 위한 간결하고 명확한 규칙들
   - 전체 GDD 포맷 불필요 — 핵심 동작만

   **섹션 3: Acceptance Criteria**
   - 이 기능이 올바르게 작동하는지 확인하는 테스트 가능한 체크리스트

4. **초안 보여준 후:**
   - "이 기획 노트를 design/quick-notes/$ARGUMENTS.md에 작성해도 될까요?"

**유저 결정 질문 규칙 (필독):**
- 기존 노트 업데이트 여부·작성 승인("작성해도 될까요?")·범위 초과 시 `/gdd-design` 전환 여부 등 유저 결정이 필요한 질문은 산문이 아니라 **AskUserQuestion 도구**로 묻습니다.
- 상세 규칙은 `${CLAUDE_PLUGIN_ROOT}/docs/decision-policy.md`를 반드시 따릅니다.

**산출물 출력 규칙 (필독):**
- 정본은 Markdown으로 `design/quick-notes/...`에 작성합니다 — 에이전트 간 공유·후속 리뷰의 기준.
- md를 생성/갱신할 때마다 동일 내용을 HTML 표시본으로 `design/html/quick-notes/...`에 함께 생성합니다 — 사용자 뷰용. md가 승인·기록되면 html은 자동 동반 생성합니다.
- 구체적 위치·표준 스타일·절차는 `${CLAUDE_PLUGIN_ROOT}/docs/output-policy.md`를 반드시 따릅니다.
- html을 쓴 뒤에는 **인덱스 페이지 `design/html/index.html`도 반드시 재생성**합니다 (output-policy 「인덱스 페이지」 절차 — 기존 문서 수정이어도 항상).
- 작업 완료 시 사용자에게 html 표시본 경로와 인덱스 경로를 안내합니다.

**노트:** 이 커맨드에는 director 검토 게이트가 없습니다 — 소규모 기능에서는 오버헤드를 줄이기 위한 의도적인 설계입니다. 기능이 성장하여 전체 GDD가 필요해지면 `/gdd-design`으로 전환하세요.
