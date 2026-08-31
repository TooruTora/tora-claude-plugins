# GDD 스튜디오 산출물 출력 정책

> 모든 GDD 작성 커맨드·에이전트는 파일을 생성/갱신할 때 이 정책을 따릅니다.

## 핵심 원칙

- **정본(canonical source)은 항상 Markdown(`.md`)** — 에이전트 간 컨텍스트 공유, 후속 커맨드(`/gdd-review`, `/gdd-review-all`), 버전 관리의 기준입니다.
- **사용자에게 보여주는 표시본은 인터랙티브 HTML 뷰어** — 긴 문서를 탐색하기 쉽게 목차·검색·접기를 제공합니다. md 정본과 항상 동일한 내용을 담습니다.
- **md를 생성하거나 갱신할 때마다 대응 html을 함께 생성/갱신**합니다. (md 정본이 승인·기록되면 html은 별도 승인 없이 자동 동반 생성)

## 파일 위치 규칙

표시용 html은 정본 md와 **동일한 하위 경로를 `design/html/` 아래에 미러링**합니다.

| 정본 (md) | 표시본 (html) |
|-----------|--------------|
| `design/concept/game-concept.md` | `design/html/concept/game-concept.html` |
| `design/gdd/combat.md` | `design/html/gdd/combat.html` |
| `design/quick-notes/pause-menu.md` | `design/html/quick-notes/pause-menu.html` |
| `design/narrative/world.md` | `design/html/narrative/world.html` |
| `design/levels/level-01.md` | `design/html/levels/level-01.html` |

또한 `design/html/index.html`에 **모든 표시본으로 진입하는 인덱스 페이지**를 유지합니다. (아래 「인덱스 페이지」 참고)

## HTML 생성 방법 (뷰어 템플릿 사용)

HTML은 직접 스타일을 짜지 말고 **반드시 뷰어 템플릿을 셸로 사용**합니다. 템플릿이 목차 자동생성·검색·스크롤 강조·섹션 접기·다크모드를 모두 인라인으로 처리하므로, 매번 일관된 결과가 나옵니다.

### 절차

1. `${CLAUDE_PLUGIN_ROOT}/templates/gdd-view.html`을 **Read**한다.
2. 템플릿의 **3개 플레이스홀더만** 치환한다 (그 외 `<style>`·`<script>`는 **절대 수정 금지**):
   - `{{TITLE}}` → 문서 제목 (예: `전투 시스템 GDD`)
   - `{{SOURCE}}` → 정본 경로 표기 (예: `정본: design/gdd/combat.md`)
   - `{{CONTENT}}` → **md 본문을 HTML로 렌더한 조각** (아래 렌더 규칙 참고)
3. 치환된 전체 HTML을 `design/html/.../X.html`로 **Write**한다.
4. **인코딩은 반드시 UTF-8(BOM 없이)** 로 저장한다. 한글이 깨지지 않도록, 외부 셸(PowerShell `Get-Content`/`Out-File` 등)로 파일을 합치거나 변환하지 말고 에이전트의 `Write` 도구로 직접 저장한다.

### 본문(`{{CONTENT}}`) 렌더 규칙

md 본문을 표준 HTML로 변환해 넣는다. 뷰어의 목차·접기 기능이 작동하려면 **헤딩 레벨을 정확히** 지켜야 한다.

- 문서 제목 `#` → `<h1>` (문서당 1개, 본문 맨 위)
- 섹션 `##` → `<h2>` (목차 1레벨 + 접기 단위가 됨)
- 하위 `###` → `<h3>` (목차 2레벨)
- 표 → `<table><thead>…</thead><tbody>…</tbody></table>`
- 목록 → `<ul>`/`<ol><li>`, 강조 → `<strong>`/`<em>`
- 코드/공식 → `<pre><code>…</code></pre>`, 인라인 → `<code>`
- 인용/콜아웃 → `<blockquote>`
- `<section>`이나 목차는 **직접 만들지 말 것** — 템플릿 스크립트가 `<h2>` 기준으로 자동 생성한다.
- **시각 표현**: 아래 「시각 표현 어휘집」의 트리거에 해당하는 내용은 인라인 SVG/CSS 시각화를 원문 옆/아래에 **동반** 생성한다.

## 시각 표현 어휘집 (표시본 강화)

HTML 표시본은 정본 md보다 **시각적으로 더 풍부**해야 한다 — HTML을 따로 뽑는 이유가 바로 시각 표현이다. md 본문을 렌더할 때, 아래 트리거에 맞는 내용은 **인라인 SVG/CSS 시각화를 원문(표·서술) 옆/아래에 동반**해 넣는다. 이 시각화는 **자동**이며(별도 승인 불필요), md에서 매번 재도출하므로 html 전체 재생성 때 그대로 복원된다. 아래 유틸 클래스는 **템플릿에 내장**돼 있으니, 에이전트는 클래스를 **참조만** 하고 `<style>`을 수정하지 않는다.

### 디자인 품질 지향 (템플릿 기본값을 넘어서)

목표는 "라이브러리 기본값처럼 보이는" 시각화가 아니라, **의도적이고 완성도 높은** 표현이다.

- **`/frontend-design` 스킬 우선 참조 (있으면)** — 시각화를 짜기 전에 이 스킬이 **사용 가능하면 먼저 참조**해 색·간격·타이포·위계의 방향을 잡는다. **스킬이 없는 환경이면 이 스킬을 건너뛰고 아래 원칙만으로 자체 수행**한다(이 지침은 스킬 유무와 무관하게 항상 유효). 외부 스킬에 대한 하드 의존이 아니라 **품질을 끌어올리는 참고**다.
- **위계 우선** — 섹션마다 시각 요소를 남발하지 말고, 그 섹션에서 **가장 말해야 할 1~2개**만 시각화한다. 나머지는 표·텍스트로 둔다.
- **타이포 대비** — 핵심 수치는 크게, 라벨·단위는 작고 `--muted`. 숫자와 설명의 위계를 분명히.
- **색은 의미로만** — `--viz-pos/neg/neu`와 `--accent`는 **의미 전달**(유리·불리·강조)에만. 장식용 컬러 남발 금지. 회색·여백이 기본, 색은 절제.
- **데이터 잉크 절약** — 축·격자·테두리는 최소화(원칙 4의 축선 정도). 불필요한 눈금·상자는 뺀다.
- **정렬과 여백** — 카드·노드는 정렬을 맞추고 답답하지 않게 간격을 준다. 좁은 화면에서 깨지지 않는지(flex 줄바꿈) 항상 고려.

### 공통 원칙 (반드시 준수)

1. **대체가 아니라 동반** — 원문 표·텍스트는 그대로 두고 시각 요소를 **추가**한다. 정본 충실성 + 문서 내 검색 유지.
2. **인라인 전용·JS 불필요** — 외부 라이브러리/폰트 금지. 차트는 정적 `<svg>`, 나머지는 HTML+CSS. **표현 스타일은 아래 유틸 클래스만** 쓴다. 단, **위치·크기 좌표값**(SVG `points`, 바의 `width`/`left %`)은 데이터에서 계산해 인라인 `style`로 넣는다 — 색·폰트·테두리 등은 클래스로만.
3. **테마 변수만 사용** — 색은 `--accent / --fg / --muted / --border / --viz-pos / --viz-neg / --viz-neu`. 하드코딩 색 금지 (다크모드 대응).
4. **SVG 안에 `<text>` 금지** — 검색 JS가 SVG 텍스트를 `<span>`으로 감싸면 렌더가 깨진다. 축·데이터 라벨은 **SVG 밖 HTML**(`figcaption`·범례) 또는 동반 표로 낸다. SVG는 순수 그래픽(선·막대·축선)만.
5. **id 금지** — 시각 요소엔 클래스만 쓴다. 템플릿 id(`content`/`toc`/`h-*`/`progress`/`top` 등)와 겹치지 않게.

### P1 시각 표현 (현재 활성)

#### 1. 진행 커브 차트
- **트리거**: 레벨/티어 등 순서축 → 수치 컬럼을 가진 테이블, **3행 이상**.
- **출력**: 원문 표 **아래**에 동반. 라인(연속값) 또는 막대(이산값).
- **좌표 recipe**: 행 `i`(0..n−1) → `x = 8 + i×(304/(n−1))`; 값 `v` → `y = 120 − (v−min)/(max−min)×112`. 정수 반올림.
```html
<figure class="viz">
  <svg viewBox="0 0 320 140" class="viz-chart" preserveAspectRatio="xMidYMid meet"
       role="img" aria-label="레벨별 필요 경험치">
    <line class="viz-axis" x1="8" y1="8" x2="8" y2="120"/>
    <line class="viz-axis" x1="8" y1="120" x2="312" y2="120"/>
    <polyline class="viz-line" points="8,110 84,84 160,58 236,30 312,12"/>
  </svg>
  <figcaption class="viz-cap">레벨 1→5 필요 경험치 · 값은 위 표 참조</figcaption>
</figure>
```

#### 2. 공식 블록
- **트리거**: Formulas 섹션의 핵심 수식.
- **출력**: 강조된 공식 카드(변수는 `.v`로 색 강조). 계산 예시는 **스탯 카드 행**(아래 4)으로.
```html
<div class="formula">DMG = <span class="v">ATK</span> × (1 − <span class="v">DEF</span> / (<span class="v">DEF</span> + 100))</div>
```

#### 3. 상호작용 매트릭스
- **트리거**: N×N 상성/상호작용(상태효과·속성 상성 등).
- **출력**: 색상 셀 그리드. 유리=`pos`(초록)·불리=`neg`(빨강)·중립=`neu`(회색).
```html
<table class="matrix">
  <thead><tr><th></th><th>물</th><th>불</th><th>풀</th></tr></thead>
  <tbody>
    <tr><th>물</th><td class="neu">1×</td><td class="pos">2×</td><td class="neg">0.5×</td></tr>
    <tr><th>불</th><td class="neg">0.5×</td><td class="neu">1×</td><td class="pos">2×</td></tr>
    <tr><th>풀</th><td class="pos">2×</td><td class="neg">0.5×</td><td class="neu">1×</td></tr>
  </tbody>
</table>
```

#### 4. 스탯 카드 행
- **트리거**: Overview·핵심 수치 3~4개, 또는 공식의 계산 예시.
- **출력**: 큰 숫자 + 라벨 카드 가로 배치(at-a-glance).
```html
<div class="stat-row">
  <div class="stat-card"><div class="stat-num">120</div><div class="stat-label">기본 공격력</div></div>
  <div class="stat-card"><div class="stat-num">45</div><div class="stat-label">방어력</div></div>
  <div class="stat-card"><div class="stat-num">83</div><div class="stat-label">최종 데미지</div></div>
</div>
```

### P2 시각 표현 (활성)

다이어그램은 라벨이 검색돼야 하므로 **SVG가 아니라 HTML 박스 + 화살표 글리프(▶)** 로 만든다(원칙 4). 전부 flex라 좁은 화면에서 자동 줄바꿈된다.

#### 5. 코어 루프 플로우
- **트리거**: 순환/단계 흐름 서술(코어 루프 등).
- **출력**: 노드 박스를 `▶`로 연결. 순환이면 `.flow-loop`로 반복을 설명.
```html
<div class="flow">
  <span class="flow-node">적 처치</span><span class="flow-arrow">▶</span>
  <span class="flow-node">경험치 획득</span><span class="flow-arrow">▶</span>
  <span class="flow-node">레벨업</span><span class="flow-arrow">▶</span>
  <span class="flow-node">능력 강화</span>
</div>
<div class="flow-loop">↺ 위 흐름이 반복되며 난이도·보상이 함께 상승</div>
```

#### 6. 의존성 맵
- **트리거**: Dependencies 섹션.
- **출력**: 입력 노드들 `▶` 중앙 허브 `▶` 출력 노드들. 좌=의존(`.in`, 초록 테두리), 우=영향(`.out`, 보라 테두리).
```html
<div class="depmap">
  <div class="dep-col in">
    <div class="dep-lbl">의존 (입력)</div>
    <div class="dep-node">스탯 시스템</div>
    <div class="dep-node">인벤토리</div>
  </div>
  <div class="dep-arrow">▶</div>
  <div class="dep-hub">전투 시스템</div>
  <div class="dep-arrow">▶</div>
  <div class="dep-col out">
    <div class="dep-lbl">영향 (출력)</div>
    <div class="dep-node">퀘스트 진행</div>
    <div class="dep-node">경제/드롭</div>
  </div>
</div>
```

#### 7. 파라미터 레인지 바
- **트리거**: Tuning Knobs의 min–default–max 파라미터.
- **출력**: 트랙 + 기본값 마커. **좌표 recipe**: `기본값 위치% = (기본−min)/(max−min)×100`. `range-fill`은 `left:0; width:기본값 위치%`, `range-mark`는 `left:기본값 위치%`.
```html
<div class="range">
  <div class="range-head"><span class="range-name">이동 속도</span><span>기본 5.0</span></div>
  <div class="range-track"><div class="range-fill" style="left:0;width:60%"></div><div class="range-mark" style="left:60%"></div></div>
  <div class="range-scale"><span>2.0</span><span>7.0</span></div>
</div>
```

#### 8. 분포 바
- **트리거**: 합계 100%인 확률·비율(드롭 등급, 상태 분포 등).
- **출력**: 색상 스택 바. 세그먼트 클래스는 `c1`(보라)·`c2`(초록)·`c3`(빨강)·`c4`(회색), `width %`는 데이터값. **합계는 반드시 100%**.
```html
<div class="dist">
  <div class="dist-seg c1" style="width:55%">일반 55%</div>
  <div class="dist-seg c2" style="width:28%">레어 28%</div>
  <div class="dist-seg c3" style="width:12%">에픽 12%</div>
  <div class="dist-seg c4" style="width:5%">전설 5%</div>
</div>
```

## 뷰어 동작 (참고)

생성된 html은 외부 의존성 없는 단일 파일이며 다음을 제공한다:

- **좌측 사이드바 목차** — `h2`·`h3` 자동 추출, 클릭 점프, 현재 위치 자동 강조(스크롤스파이)
- **문서 내 검색** — 일치 섹션 필터 + 단어 하이라이트 + 일치 개수 표시
- **섹션 접기/펼치기** — 섹션 제목 클릭
- **다크모드 토글** — 우상단. **기본은 라이트모드**, 토글로 다크 전환(선택 기억)
- **상단 진행바 / 맨 위로 버튼 / 모바일 햄버거 메뉴**

## 인덱스 페이지 (`design/html/index.html`)

문서가 늘어나도 사용자가 **이 한 페이지만 열면** 모든 표시본으로 이동할 수 있게 하는 허브입니다. 개별 html 경로를 매번 찾아 열 필요가 없어집니다.

### 재생성 시점

- **어떤 표시본 html이든 생성/갱신/삭제(또는 이름 변경)할 때마다** 인덱스를 **전체 재생성해 덮어쓴다**. (자동 — 별도 승인 불필요)
- 부분 수정으로 인덱스만 고치지 말고, 항상 아래 절차로 전체를 다시 만든다. (표시본과 같은 원칙)
- 안전망: Stop 훅(`hooks/html-index-check.js`)이 표시본보다 인덱스가 오래됐거나 없으면 응답 종료를 막고 재생성을 지시한다. 훅에 걸리기 전에 위 규칙대로 먼저 생성하는 것이 정상 흐름이다.

### 절차

1. `${CLAUDE_PLUGIN_ROOT}/templates/gdd-index.html`을 **Read**한다.
2. **Glob**으로 `design/html/**/*.html`을 스캔한다 (`index.html` 자신은 제외).
3. 각 문서의 **제목**은 대응 정본 md의 첫 `#` 헤딩에서 가져온다. (없으면 파일명 사용)
4. 템플릿의 **2개 플레이스홀더만** 치환한다 (그 외 `<style>`·`<script>`는 **절대 수정 금지**):
   - `{{TITLE}}` → `design/concept/game-concept.md`의 `#` 제목에서 게임명을 알 수 있으면 `[게임명] — 기획 문서`, 아니면 `기획 문서 인덱스`
   - `{{SECTIONS}}` → 카테고리별 그룹 마크업 (아래 규칙)
5. `design/html/index.html`로 **Write**한다. **인코딩은 UTF-8(BOM 없이)** — 표시본과 동일하게 외부 셸 변환 없이 Write 도구로 직접 저장한다.

### `{{SECTIONS}}` 마크업 규칙

- 카테고리 순서는 고정: **컨셉 & 필라(concept) → 시스템 GDD(gdd) → 내러티브(narrative) → 레벨(levels) → 퀵 노트(quick-notes) → 기타(그 외 폴더)**. 문서가 없는 카테고리는 그룹 자체를 생략한다.
- 링크는 **index.html 기준 상대경로**(예: `gdd/combat.html`)로 쓴다 — `file://`로 열어도 동작해야 한다.
- 문서 수 집계(`grp-count`·전체 개수)는 템플릿 스크립트가 자동 계산하므로 **비워 둔다**.
- 카드에 클래스 외 스타일·id를 추가하지 않는다.

```html
<section class="grp">
  <h2 class="grp-title">⚙️ 시스템 GDD <span class="grp-count"></span></h2>
  <div class="cards">
    <a class="card" href="gdd/combat.html">
      <div class="card-title">전투 시스템 GDD</div>
      <div class="card-src">design/gdd/combat.md</div>
    </a>
  </div>
</section>
```

그룹 제목 아이콘: 🎯 컨셉 & 필라 · ⚙️ 시스템 GDD · 📖 내러티브 · 🗺️ 레벨 · 📝 퀵 노트 · 📄 기타

## 워크플로 통합

1. md 정본을 생성/승인/갱신한다. (섹션 단위 승인 게이트는 기존대로 md 기준으로 진행)
2. md가 기록되면(신규 작성이든 **기존 문서 수정이든**), 위 절차로 뷰어 html을 만들어 `design/html/...`에 **덮어쓴다**. 한 섹션만 고친 부분 수정이어도 **md 전체를 다시 렌더해 html 전체를 재생성**한다. (자동 — 별도 승인 불필요)

> ⚠️ 수정 워크플로 주의: 사용자가 기존 GDD의 일부를 고쳐달라고 하면, md만 수정하고 끝내지 말 것. **md를 갱신할 때마다 대응 html을 반드시 함께 재생성**한다 — 이는 커맨드를 거치지 않은 대화형 수정 요청에도 동일하게 적용된다.
3. html을 쓴 뒤에는 **인덱스 페이지(`design/html/index.html`)를 재생성**한다. (「인덱스 페이지」 절차 — 자동, 별도 승인 불필요. 신규 문서가 아니어도 제목이 바뀌었을 수 있으므로 항상 수행)
4. 작업 완료 시 사용자에게 html 표시본 경로를 안내한다.
   예: `표시본: design/html/gdd/combat.html · 전체 목록: design/html/index.html`

## 적용 범위

- **파일 산출물을 만드는 작성 커맨드/에이전트**: 위 규칙을 따른다.
- **읽기 전용 리뷰 커맨드**(`/gdd-review`, `/gdd-review-all`): 채팅으로 리포트를 출력하므로 html 산출물을 만들지 않는다. (단 사용자가 리포트 파일을 요청하면 동일 정책 적용)
