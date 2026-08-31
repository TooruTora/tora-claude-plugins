# GDD 스튜디오 — 게임 기획팀 워크플로우

AI 에이전트로 구성된 게임 기획팀. 게임 디자인 문서(GDD) 작성부터 시스템 설계, 내러티브 기획까지 전 과정을 지원합니다.

## 기획팀 에이전트

| 에이전트 | 역할 | 담당 영역 |
|---------|------|---------|
| `creative-director` | 크리에이티브 디렉터 | 게임 비전, 필라 정의, 최종 창작 결정권 |
| `game-designer` | 게임 디자이너 | 코어 루프, 게임플레이 시스템, 밸런스 |
| `narrative-director` | 내러티브 디렉터 | 스토리 구조, 세계관, 캐릭터 아크 |
| `systems-designer` | 시스템 디자이너 | 수학적 모델, 공식, 서브시스템 세부 설계 |
| `level-designer` | 레벨 디자이너 | 레벨 레이아웃, 인카운터, 공간 기획 |
| `writer` | 시나리오 라이터 | 대화, 로어, 플레이어 대상 텍스트 |

## GDD 작성 워크플로우

```
1. 게임 컨셉 정의 → /gdd-concept
   └─ creative-director + game-designer 협업
   └─ 산출물: design/concept/game-concept.md

2. 게임 필라 확정 → creative-director에게 위임
   └─ 산출물: design/concept/pillars.md

3. 시스템 GDD 작성 → /gdd-design [시스템명]
   └─ game-designer (방향) + systems-designer (공식/상세)
   └─ 산출물: design/gdd/[시스템명].md

4. 내러티브 기획 → narrative-director에게 위임
   └─ writer와 협업
   └─ 산출물: design/narrative/

5. 레벨 기획 → level-designer에게 위임
   └─ 산출물: design/levels/

6. 빠른 기획 노트 → /gdd-quick [기능명]
   └─ 산출물: design/quick-notes/[기능명].md

7. GDD 리뷰 → /gdd-review [파일경로]
8. 전체 교차 검토 → /gdd-review-all
```

## 슬래시 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/gdd-concept` | 새 게임 컨셉 문서 작성 시작 |
| `/gdd-design [시스템명]` | 특정 시스템의 전체 GDD 작성 (8섹션) |
| `/gdd-quick [기능명]` | 소규모 기능의 빠른 기획 노트 (3섹션) |
| `/gdd-review [파일경로]` | GDD 품질 검토 및 피드백 |
| `/gdd-review-all` | 전체 GDD 교차 일관성 검토 |
| `/gdd-html [문서명]` | HTML 표시본·인덱스 동기화/재생성 (인자 없으면 전체) |

## 폴더 구조

```
design/
├── concept/          # 게임 컨셉 & 필라
├── gdd/              # 시스템별 GDD (8섹션 풀 포맷)
├── narrative/        # 스토리, 세계관, 캐릭터
│   └── characters/
├── levels/           # 레벨 설계 문서
├── quick-notes/      # 빠른 기획 노트 (3섹션 경량 포맷)
└── registry/
    └── entities.yaml # 크로스시스템 엔티티 등록부
```

## GDD 표준 섹션 (8섹션)

모든 `design/gdd/` 문서는 다음 8개 섹션을 포함해야 합니다:

1. **Overview** — 신규 팀원도 이해할 수 있는 1단락 요약
2. **Player Fantasy** — 플레이어가 느껴야 할 감정/경험 (MDA 기반)
3. **Detailed Rules** — 프로그래머가 구현 가능한 수준의 정밀한 규칙
4. **Formulas** — 모든 수식 (변수 테이블 + 계산 예시 포함)
5. **Edge Cases** — 예외 상황 처리 방침
6. **Dependencies** — 다른 시스템과의 의존 관계
7. **Tuning Knobs** — 밸런싱용 조정 파라미터
8. **Acceptance Criteria** — 테스트 가능한 완료 기준

## 협업 원칙

- 에이전트는 **컨설턴트**, 유저가 **크리에이티브 디렉터**
- 파일 작성 전 반드시 "이 섹션을 [파일경로]에 작성해도 될까요?" 확인
- 섹션 단위로 초안 → 검토 → 승인 → 작성
- 불확실할 때는 가정하지 않고 질문
- 승인·선택 등 유저 결정 질문은 구조화 선택지(AskUserQuestion)로 진행 (상세: docs/decision-policy.md)

## 에이전트 사용법

에이전트를 직접 호출하려면:
```
@creative-director 게임 필라를 정의해줘
@game-designer 전투 시스템 코어 루프 설계해줘
@narrative-director 스토리 구조 잡아줘
@systems-designer 전투 데미지 공식 설계해줘
```
