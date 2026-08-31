#!/usr/bin/env node
/**
 * GDD 스튜디오 — Stop 훅 (HTML 인덱스 누락/스테일 감지)
 *
 * 응답을 마치려 할 때 design/html/ 아래에 표시본 html이 있는데
 * 인덱스(design/html/index.html)가 없거나 어떤 표시본보다 오래됐으면,
 * 정지를 막고(block) 인덱스를 재생성하라고 지시한다.
 * 지침 누락으로 인덱스 생성이 빠지는 것을 기계적으로 보정하는 안전망이다.
 *
 * 무한 루프 방지: stop_hook_active=true 재진입 시 통과 (task-stop.js와 동일).
 * design/html 이 없거나 표시본이 하나도 없으면 아무것도 하지 않는다.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { readInput } = require('./state-util');

const input = readInput();
if (input && input.stop_hook_active === true) {
  process.exit(0);
}

const cwd = (input && typeof input.cwd === 'string' && input.cwd) || process.cwd();
const htmlDir = path.join(cwd, 'design', 'html');
const indexPath = path.join(htmlDir, 'index.html');

const docs = [];
(function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return; // 디렉터리 없음 → 표시본 없음
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.html') && p !== indexPath) docs.push(p);
  }
})(htmlDir);

if (docs.length === 0) {
  process.exit(0);
}

let indexMtime = -1; // 인덱스 없음
try {
  indexMtime = fs.statSync(indexPath).mtimeMs;
} catch (_) {
  /* 없음 → 생성 필요 */
}

let newestDoc = 0;
for (const p of docs) {
  try {
    const m = fs.statSync(p).mtimeMs;
    if (m > newestDoc) newestDoc = m;
  } catch (_) {
    /* 스캔 후 삭제된 파일은 무시 */
  }
}

if (indexMtime >= newestDoc) {
  process.exit(0); // 인덱스가 최신 → 통과
}

const reason =
  (indexMtime < 0
    ? 'design/html/ 에 표시본 html이 있지만 인덱스 페이지(design/html/index.html)가 없습니다.'
    : 'design/html/ 의 표시본 html이 인덱스 페이지(design/html/index.html)보다 최신입니다.') +
  ' 작업을 마치기 전에 인덱스를 재생성하세요:\n' +
  '- gdd-studio 플러그인 docs/output-policy.md 의 「인덱스 페이지」 절차를 따르세요.\n' +
  '- templates/gdd-index.html 을 셸로 사용해 design/html/**/*.html 전체를 스캔하고,\n' +
  '  카테고리별 카드 목록({{SECTIONS}})을 채워 design/html/index.html 로 저장(UTF-8, BOM 없이)하세요.\n' +
  '- 각 문서 제목은 대응 정본 md의 첫 # 헤딩에서 가져오세요.';

process.stdout.write(JSON.stringify({ decision: 'block', reason }));
