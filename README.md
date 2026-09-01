# tora-claude-plugins

개인용 Claude Code 플러그인 마켓플레이스입니다. 레포지토리 하나가 마켓플레이스 역할을 하고, `plugins/` 아래에 플러그인이 폴더 단위로 들어갑니다.

## 플러그인 목록

### clear-korean

Claude Code가 명확하고 자연스러운 한국어로 응답하게 하는 output style입니다. 코딩 지침은 유지합니다(`keep-coding-instructions: true`).

- 번역투와 만능 동사("진행하다", "수행하다")를 피하고 실제 동작을 나타내는 어휘를 쓰게 합니다.
- 문장 성분과 조사를 생략하지 않은 완결된 문장을 쓰게 합니다.
- 거슬리는 표현을 발견할 때마다 본문의 「피해야 할 표현 목록」에 `[나쁜 예 → 좋은 예]` 형식으로 추가하며 다듬는 것을 전제로 합니다.

### gdd-studio

AI 에이전트로 구성된 게임 기획팀입니다. 게임 컨셉 정의부터 시스템 GDD 작성, 내러티브·레벨 기획까지 GDD 전 과정을 다룹니다.

- 에이전트 6종: 크리에이티브 디렉터, 게임 디자이너, 내러티브 디렉터, 시스템 디자이너, 레벨 디자이너, 시나리오 라이터.
- 커맨드 7종: `/gdd-concept`, `/gdd-design`, `/gdd-quick`, `/gdd-review`, `/gdd-review-all`, `/gdd-html`, `/gdd-checkpoint`.
- 훅이 세션 시작·작업 시작·종료 시점에 `production/session-state/active.md`를 읽고 갱신해 진행 상황을 이어줍니다.
- 산출물은 작업 중인 프로젝트의 `design/` 아래에 쌓입니다.

## 설치

Claude Code 프롬프트에서 실행합니다.

```
/plugin marketplace add TooruTora/tora-claude-plugins
/plugin install clear-korean@tora-claude-plugins
/output-style        ← clear-korean 선택
```

```
/plugin install gdd-studio@tora-claude-plugins
```

## 수정 반영

설치 시 플러그인이 로컬 캐시로 복사되므로, 이 레포지토리를 수정해도 바로 반영되지 않습니다. 절차는 다음과 같습니다.

1. 파일을 수정하고 커밋한 뒤 푸시합니다.
2. `/plugin marketplace update tora-claude-plugins`를 실행합니다.
3. Claude Code를 재시작합니다.

## 플러그인 추가

1. `plugins/<이름>/` 폴더를 만들고 `.claude-plugin/plugin.json`을 작성합니다.
2. 용도에 맞는 폴더(`output-styles/`, `commands/`, `skills/`, `agents/` 등)에 내용을 넣습니다.
3. `.claude-plugin/marketplace.json`의 `plugins` 배열에 항목을 추가합니다.
4. 루트 `README.md`의 「플러그인 목록」에 설명을 추가합니다.

플러그인 폴더에는 `CLAUDE.md`를 두지 않습니다(`.gitignore`로 막아둠). 이 레포에서 해당 폴더를 작업할 때 프로젝트 지침으로 딸려 들어오기 때문입니다. 플러그인 설명은 각 폴더의 `README.md`에 씁니다.
