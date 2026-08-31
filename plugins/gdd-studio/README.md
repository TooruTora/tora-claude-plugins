# GDD 스튜디오

> AI 에이전트로 구성된 게임 기획팀 — Claude Code 플러그인

게임 디자인 문서(GDD) 작성부터 시스템 설계, 내러티브·레벨 기획까지 전 과정을 지원하는 Claude Code 플러그인입니다. 6명의 전문 기획 에이전트와 5개의 워크플로우 커맨드를 제공합니다.

## 설치

```
/plugin marketplace add TooruTora/game-gdd-studio
/plugin install gdd-studio@gdd-studio
```

설치 후 새 게임 프로젝트 디렉터리에서 `/gdd-concept`으로 시작하세요.

## 권장 설정: 출력 규칙을 프로젝트에 고정

이 플러그인은 기획 문서를 작성할 때 정본 Markdown(`design/...`)과 함께 보기 좋은 HTML 표시본(`design/html/...`)을 자동 생성하고, 모든 표시본으로 진입하는 인덱스 페이지(`design/html/index.html`)를 유지합니다. 단, **커맨드를 거치지 않고 대화로 "이 부분 수정해줘"처럼 고칠 때**도 html이 함께 갱신되게 하려면, 플러그인을 사용하는 **프로젝트의 `CLAUDE.md`에 아래 규칙을 추가**하세요.

```markdown
## GDD 산출물 출력 규칙
- 정본은 `design/...`의 Markdown, 표시본은 `design/html/...`에 같은 경로로 미러링한다.
- md를 새로 만들거나 **수정할 때마다** 대응 html도 **md 전체를 다시 렌더해 재생성**한다.
- html은 gdd-studio 플러그인의 뷰어 템플릿을 사용한다. (상세: 플러그인 docs/output-policy.md)
- html을 생성/갱신/삭제하면 인덱스 페이지 `design/html/index.html`도 함께 재생성한다.
- 승인·선택 등 유저 결정이 필요한 질문은 AskUserQuestion 도구(구조화 선택지)로 묻는다. (상세: 플러그인 docs/decision-policy.md)
```

> 플러그인의 커맨드·에이전트에는 이 규칙이 이미 포함돼 있지만, 메인 세션이 커맨드 없이 직접 수정하는 경우엔 프로젝트 `CLAUDE.md`에 있어야 항상 적용됩니다.

## 기획팀 에이전트

| 에이전트 | 역할 | 담당 영역 |
|---------|------|---------|
| `creative-director` | 크리에이티브 디렉터 | 게임 비전, 필라 정의, 최종 창작 결정권 |
| `game-designer` | 게임 디자이너 | 코어 루프, 게임플레이 시스템, 밸런스 |
| `narrative-director` | 내러티브 디렉터 | 스토리 구조, 세계관, 캐릭터 아크 |
| `systems-designer` | 시스템 디자이너 | 수학적 모델, 공식, 서브시스템 세부 설계 |
| `level-designer` | 레벨 디자이너 | 레벨 레이아웃, 인카운터, 공간 기획 |
| `writer` | 시나리오 라이터 | 대화, 로어, 플레이어 대상 텍스트 |

에이전트는 `@creative-director 게임 필라를 정의해줘` 처럼 직접 호출할 수 있습니다.

## 슬래시 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/gdd-concept` | 새 게임 컨셉 문서 작성 시작 (비전·코어 루프·필라) |
| `/gdd-design [시스템명]` | 특정 시스템의 전체 GDD 작성 (8섹션 풀 포맷) |
| `/gdd-quick [기능명]` | 소규모 기능의 빠른 기획 노트 (3섹션 경량 포맷) |
| `/gdd-review [파일경로]` | GDD 품질 검토 및 피드백 |
| `/gdd-review-all` | 전체 GDD 교차 일관성 검토 |
| `/gdd-html [문서명]` | HTML 표시본·인덱스 동기화/재생성 (인자 없으면 전체) |

## GDD 작성 워크플로우

```
1. 게임 컨셉 정의 → /gdd-concept
   └─ creative-director + game-designer 협업
   └─ 산출물: design/concept/game-concept.md

2. 게임 필라 확정 → @creative-director
   └─ 산출물: design/concept/pillars.md

3. 시스템 GDD 작성 → /gdd-design [시스템명]
   └─ game-designer (방향) + systems-designer (공식/상세)
   └─ 산출물: design/gdd/[시스템명].md

4. 내러티브 기획 → @narrative-director (writer와 협업)
   └─ 산출물: design/narrative/

5. 레벨 기획 → @level-designer
   └─ 산출물: design/levels/

6. 빠른 기획 노트 → /gdd-quick [기능명]
   └─ 산출물: design/quick-notes/[기능명].md

7. GDD 리뷰 → /gdd-review [파일경로]
8. 전체 교차 검토 → /gdd-review-all
```

## GDD 표준 섹션 (8섹션)

모든 `design/gdd/` 문서는 다음 8개 섹션을 포함합니다:

1. **Overview** — 신규 팀원도 이해할 수 있는 1단락 요약
2. **Player Fantasy** — 플레이어가 느껴야 할 감정/경험 (MDA 기반)
3. **Detailed Rules** — 프로그래머가 구현 가능한 수준의 정밀한 규칙
4. **Formulas** — 모든 수식 (변수 테이블 + 계산 예시 포함)
5. **Edge Cases** — 예외 상황 처리 방침
6. **Dependencies** — 다른 시스템과의 의존 관계
7. **Tuning Knobs** — 밸런싱용 조정 파라미터
8. **Acceptance Criteria** — 테스트 가능한 완료 기준

## 산출물 폴더 구조

플러그인 커맨드는 **현재 작업 중인 프로젝트 디렉터리**에 다음 구조로 문서를 생성합니다:

```
design/
├── concept/          # 게임 컨셉 & 필라
├── gdd/              # 시스템별 GDD (8섹션 풀 포맷)
├── narrative/        # 스토리, 세계관, 캐릭터
├── levels/           # 레벨 설계 문서
├── quick-notes/      # 빠른 기획 노트 (3섹션 경량 포맷)
└── registry/
    └── entities.yaml # 크로스시스템 엔티티 등록부
```

## 협업 원칙

- 에이전트는 **컨설턴트**, 유저가 **크리에이티브 디렉터**
- 파일 작성 전 반드시 "이 섹션을 [파일경로]에 작성해도 될까요?" 확인
- 섹션 단위로 초안 → 검토 → 승인 → 작성
- 불확실할 때는 가정하지 않고 질문
- 승인·선택 등 유저 결정 질문은 구조화 선택지(AskUserQuestion)로 진행 — 열린 질문은 세션 복원 시 자동으로 다시 물음

## 라이선스

MIT
