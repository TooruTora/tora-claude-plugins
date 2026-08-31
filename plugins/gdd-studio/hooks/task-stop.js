#!/usr/bin/env node
/**
 * GDD 스튜디오 — Stop 훅 (작업 완료 체크 & 저장 강제)
 *
 * 에이전트가 응답을 마치려 할 때 실행된다. 상태 파일의 "## 현재 작업"에
 * 아직 내용이 남아있으면(= 추적 중인 작업이 마무리 반영되지 않음),
 * 정지를 막고(block) active.md 를 정리한 뒤 끝내라고 지시한다.
 *
 * 무한 루프 방지: Claude Code 는 이 훅 때문에 재진입할 때 stop_hook_active=true
 * 를 넘겨준다. 그때는 통과시켜 최대 한 번만 block 한다.
 *
 * "## 현재 작업"이 비어있으면(플레이스홀더) 추적할 작업이 없다고 보고 통과한다
 * — 단순 질문·대화는 자연히 여기서 걸리지 않는다.
 */
'use strict';

const fs = require('fs');
const { readInput, stateFilePath, extractSection, hasRealContent } = require('./state-util');

const input = readInput();

// 이미 이번 정지 사이클에서 한 번 block 했으면 통과(루프 방지).
if (input && input.stop_hook_active === true) {
  process.exit(0);
}

const stateFile = stateFilePath(input);

let content;
try {
  content = fs.readFileSync(stateFile, 'utf8');
} catch (_) {
  process.exit(0); // 상태 파일 없음 → 강제할 것 없음
}

// 현재 작업이 비어있으면 마무리할 작업이 없다고 보고 통과.
if (!hasRealContent(extractSection(content, '현재 작업'))) {
  process.exit(0);
}

const reason =
  '작업을 마치기 전에 production/session-state/active.md 를 정리하세요:\n' +
  '- 방금 완료한 것은 "## 완료된 섹션"으로 옮기세요.\n' +
  '- 작업이 끝났다면 "## 현재 작업"을 플레이스홀더([...])로 비우고 "## 다음 섹션"을 갱신하세요.\n' +
  '- 아직 진행 중이면 "## 현재 작업"에 최신 진행 상황을 반영하세요.\n' +
  '- 유저 결정이 필요한 미결 항목은 "## 열린 질문"에 남기세요.\n' +
  '- "**마지막 갱신:**"을 현재 시각으로 갱신하세요.\n' +
  '이 파일은 내부 세션 상태이므로 HTML 표시본은 만들지 마세요(Markdown 정본만). ' +
  '갱신할 내용이 정말 없으면 그대로 다시 종료하세요.';

process.stdout.write(JSON.stringify({ decision: 'block', reason }));
