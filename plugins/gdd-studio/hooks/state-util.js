'use strict';
/**
 * GDD 스튜디오 — 세션 상태 파일(active.md) 파싱 유틸.
 *
 * session-start / task-start / task-stop 훅이 공통으로 사용한다.
 * "## <제목>" 섹션의 본문을 추출하고, 그 본문이 플레이스홀더가 아닌
 * 실제 내용을 담고 있는지 판정한다.
 */

const fs = require('fs');
const path = require('path');

// 훅 stdin(JSON)에서 프로젝트 cwd 를 얻는다. 실패하면 process.cwd() 로 폴백.
function readInput() {
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (_) {
    /* stdin 없음 */
  }
  try {
    return JSON.parse(raw || '{}');
  } catch (_) {
    return {};
  }
}

// 상태 파일 경로: <cwd>/production/session-state/active.md
function stateFilePath(input) {
  const cwd =
    input && typeof input.cwd === 'string' && input.cwd ? input.cwd : process.cwd();
  return path.join(cwd, 'production', 'session-state', 'active.md');
}

// "## <title>" 섹션의 본문(다음 "## " 헤딩 전까지)을 문자열로 반환.
// 해당 섹션이 없으면 빈 문자열.
function extractSection(content, title) {
  const lines = content.split(/\r?\n/);
  const out = [];
  let inside = false;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.*\S)\s*$/);
    if (heading) {
      if (inside) break; // 다음 섹션 시작 → 종료
      if (heading[1].trim() === title) inside = true;
      continue;
    }
    if (inside) out.push(line);
  }
  return out.join('\n');
}

// 섹션 본문에 플레이스홀더([...])·인용(>)이 아닌 실제 내용이 하나라도 있으면 true.
function hasRealContent(section) {
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .some((l) => l && !l.startsWith('>') && !/^\[.*\]$/.test(l));
}

module.exports = { readInput, stateFilePath, extractSection, hasRealContent };
