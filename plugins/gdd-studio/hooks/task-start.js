#!/usr/bin/env node
/**
 * GDD 스튜디오 — UserPromptSubmit 훅 (작업 시작 추적)
 *
 * 유저가 새 지시를 보낼 때 실행된다. 상태 파일의 "## 현재 작업"이
 * 비어있는(플레이스홀더) 상태 — 즉 지금 추적 중인 작업이 없을 때만,
 * "실질 작업이면 시작 전에 현재 작업을 기록하라"는 안내를 주입한다.
 *
 * 이미 진행 중인 작업이 있으면(현재 작업에 내용 있음) 안내하지 않는다
 * — 매 프롬프트마다 소음을 만들지 않기 위함.
 */
'use strict';

const fs = require('fs');
const { readInput, stateFilePath, extractSection, hasRealContent } = require('./state-util');

const input = readInput();
const stateFile = stateFilePath(input);

let content;
try {
  content = fs.readFileSync(stateFile, 'utf8');
} catch (_) {
  process.exit(0); // 상태 파일 없음 → 추적 대상 아님
}

// 이미 진행 중인 작업이 있으면 시작 안내를 생략.
if (hasRealContent(extractSection(content, '현재 작업'))) {
  process.exit(0);
}

const additionalContext =
  '[GDD 세션 상태 추적] 이 요청이 실질적인 기획 작업(문서·시스템 설계, 섹션 작성/수정 등)이라면, ' +
  '작업을 시작하기 전에 production/session-state/active.md의 "## 현재 작업" 섹션을 이번 작업 내용으로 갱신하고 ' +
  '"**마지막 갱신:**"을 현재 시각으로 채우세요. ' +
  '단순 질문·조회·대화면 갱신하지 말고 그대로 진행하세요.';

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext,
    },
  })
);
