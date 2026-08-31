#!/usr/bin/env node
/**
 * GDD 스튜디오 — SessionStart 훅 (세션 상태 복원)
 *
 * 새 세션 시작 / 재개 / 컨텍스트 압축 시 실행되어,
 * 프로젝트의 production/session-state/active.md 를 읽어 그 내용을
 * additionalContext 로 세션에 주입한다. 이렇게 하면 진행 맥락이
 * 컨텍스트 압축이나 세션 경계를 넘어 이어진다.
 *
 * 파일이 없거나 아직 플레이스홀더(미갱신) 상태면 아무것도 출력하지 않는다
 * (새 프로젝트나 빈 상태에서 소음을 만들지 않기 위함).
 *
 * Claude Code 는 훅 입력 JSON 을 stdin 으로 전달한다. 여기서 cwd(프로젝트
 * 루트)를 얻어 상태 파일 경로를 구성한다.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (_) {
    return '';
  }
}

// 훅 입력에서 프로젝트 cwd 를 얻는다. 없으면 프로세스 cwd 로 폴백.
let cwd = process.cwd();
try {
  const input = JSON.parse(readStdin() || '{}');
  if (input && typeof input.cwd === 'string' && input.cwd) {
    cwd = input.cwd;
  }
} catch (_) {
  /* 입력 파싱 실패 시 process.cwd() 유지 */
}

const stateFile = path.join(cwd, 'production', 'session-state', 'active.md');

let content;
try {
  content = fs.readFileSync(stateFile, 'utf8');
} catch (_) {
  // 상태 파일 없음 → 복원할 것 없음.
  process.exit(0);
}

// 실제 진행 내용이 있는지 판단한다.
// 제목(#), 인용(>), '마지막 갱신' 줄, [플레이스홀더] 줄, 빈 줄을 제외하고
// 남는 의미 있는 줄이 하나라도 있으면 실제 내용으로 본다.
const meaningful = content
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(
    (l) =>
      l &&
      !l.startsWith('#') &&
      !l.startsWith('>') &&
      !/^\*\*마지막 갱신:\*\*/.test(l) &&
      !/^\[.*\]$/.test(l)
  );

if (meaningful.length === 0) {
  // 미갱신 플레이스홀더 상태 → 복원 생략.
  process.exit(0);
}

// "## 열린 질문"에 미해결 항목(플레이스홀더 제외)이 있는지 확인한다.
const openSection = content
  .split(/^## /m)
  .find((s) => s.startsWith('열린 질문'));
const hasOpenQuestions =
  !!openSection &&
  openSection
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.trim())
    .some((l) => l && !/^\[.*\]$/.test(l));

const additionalContext =
  '이전 GDD 스튜디오 세션 상태를 복원합니다 ' +
  '(production/session-state/active.md). 아래 진행 상황을 이어서 작업하세요. ' +
  '새 진행이 생기면 /gdd-checkpoint 로 이 파일을 갱신하세요.\n\n' +
  (hasOpenQuestions
    ? '⚠️ "## 열린 질문"에 유저 결정 대기 항목이 있습니다. 새 작업을 시작하기 전에 ' +
      'AskUserQuestion 도구(구조화 선택지)로 이 결정들을 유저에게 물어 해소하고, ' +
      '답은 "핵심 결정사항"으로 옮기세요 (상세: 플러그인 docs/decision-policy.md).\n\n'
    : '') +
  '----- session-state/active.md -----\n' +
  content.trim();

process.stdout.write(JSON.stringify({ additionalContext }));
