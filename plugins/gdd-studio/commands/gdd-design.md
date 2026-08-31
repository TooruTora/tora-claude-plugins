---
description: 특정 게임 시스템의 전체 GDD를 8섹션 포맷으로 작성합니다. game-designer와 systems-designer가 협업합니다.
argument-hint: "[시스템명] (예: combat, progression, crafting)"
---

게임 시스템 GDD 작성 워크플로우를 시작합니다.

대상 시스템: $ARGUMENTS

**워크플로우:**

1. **기존 파일 확인:**
   - `design/gdd/$ARGUMENTS.md`가 존재하면: 현재 내용을 읽고 "업데이트 모드"로 진입 (어떤 섹션을 수정할지 질문). **수정으로 md를 갱신하면 대응 html(`design/html/gdd/$ARGUMENTS.html`)도 md 전체를 다시 렌더해 반드시 재생성합니다.**
   - 존재하지 않으면: 새 GDD 작성 시작

2. **사전 컨텍스트 로드:**
   - `design/concept/game-concept.md` 읽기 (존재하면)
   - `design/registry/entities.yaml` 읽기 (존재하면)
   - `${CLAUDE_PLUGIN_ROOT}/templates/game-design-document.md` 읽기 (8섹션 GDD 표준 템플릿 — 스켈레톤 구조와 각 섹션 작성의 기준)

3. **스켈레톤 파일 먼저 생성:**
   `${CLAUDE_PLUGIN_ROOT}/templates/game-design-document.md` 템플릿의 섹션 구조(8개 표준 섹션 + Summary·Visual/Audio·Open Questions 보조 섹션)를 기반으로 `design/gdd/$ARGUMENTS.md`를 섹션 헤더만 있는 빈 파일로 즉시 생성합니다.
   "스켈레톤을 design/gdd/$ARGUMENTS.md에 생성해도 될까요?"

4. **섹션별 순서대로 작성 (각 섹션마다 대화 → 초안 → 승인 → 작성):**

   **섹션 1: Overview**
   - 신규 팀원도 이해할 수 있는 1단락 요약
   - Quick reference: Layer / Priority / Key deps

   **섹션 2: Player Fantasy**
   - MDA 프레임워크 기반 플레이어가 느껴야 할 것
   - 이 메카닉이 주로 서비스하는 Aesthetics

   **섹션 3: Detailed Rules**
   - 프로그래머가 구현 가능한 정밀한 규칙
   - 상태와 전이 테이블 (해당하는 경우)

   **섹션 4: Formulas**
   - 모든 수식: 명명된 표현식 + 변수 테이블 + 출력 범위 + 작동 예시

   **섹션 5: Edge Cases**
   - 비정상 상황 처리 표

   **섹션 6: Dependencies**
   - 다른 시스템과의 의존 관계 테이블

   **섹션 7: Tuning Knobs**
   - 밸런싱용 파라미터: 현재 값, 안전 범위, 증가/감소 효과

   **섹션 8: Acceptance Criteria**
   - 테스트 가능한 완료 기준 체크리스트

5. **각 섹션 후:**
   - `production/session-state/active.md` 업데이트 (현재 섹션, 완료된 섹션, 핵심 결정사항)

6. **완성 후 다음 단계:**
   - `/gdd-review design/gdd/$ARGUMENTS.md` — 작성된 GDD 검토
   - 새로운 크로스시스템 엔티티가 있으면 `design/registry/entities.yaml` 업데이트 제안

**유저 결정 질문 규칙 (필독):**
- 스켈레톤 생성 확인·섹션 승인("작성해도 될까요?")·업데이트 모드의 수정 섹션 선택(multiSelect)·설계 옵션 택일 등 유저 결정이 필요한 질문은 산문이 아니라 **AskUserQuestion 도구**로 묻습니다.
- 상세 규칙은 `${CLAUDE_PLUGIN_ROOT}/docs/decision-policy.md`를 반드시 따릅니다.

**산출물 출력 규칙 (필독):**
- 정본은 Markdown으로 `design/...`에 작성합니다 — 에이전트 간 공유·후속 리뷰의 기준.
- md를 생성/갱신할 때마다 동일 내용을 HTML 표시본으로 `design/html/...`(같은 하위 경로 미러)에 함께 생성합니다 — 사용자 뷰용. md가 승인·기록되면 html은 자동 동반 생성합니다.
- 구체적 위치·표준 스타일·절차는 `${CLAUDE_PLUGIN_ROOT}/docs/output-policy.md`를 반드시 따릅니다.
- html을 쓴 뒤에는 **인덱스 페이지 `design/html/index.html`도 반드시 재생성**합니다 (output-policy 「인덱스 페이지」 절차 — 기존 문서 수정이어도 항상).
- 작업 완료 시 사용자에게 html 표시본 경로와 인덱스 경로를 안내합니다.

**에이전트 역할:**
- game-designer 관점: 플레이어 경험, 코어 루프 정렬, 메카닉 방향
- systems-designer 관점: 공식 설계, 수학적 모델, 튜닝 파라미터
- 복잡한 공식이나 상호작용 매트릭스는 `@systems-designer`에게 명시적으로 위임 가능
