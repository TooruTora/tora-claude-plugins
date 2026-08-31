---
description: 특정 GDD 파일의 품질을 검토합니다. 8섹션 완성도, 내적 일관성, 구현 가능성을 평가하고 APPROVED / NEEDS REVISION / MAJOR REVISION NEEDED 판정을 내립니다.
argument-hint: "[파일경로] (예: design/gdd/combat.md)"
---

GDD 품질 검토를 시작합니다.

대상 파일: $ARGUMENTS

**워크플로우:**

1. **파일 읽기:**
   - `$ARGUMENTS` 파일 전체 읽기
   - 파일이 없으면: 오류 메시지 출력 및 `design/gdd/` 목록 제안

2. **컨텍스트 로드:**
   - `design/concept/game-concept.md` 읽기 (필라 확인용)
   - `design/registry/entities.yaml` 읽기 (엔티티 일관성 확인용)

3. **8섹션 완성도 체크:**

   | 섹션 | 있음/없음 | 품질 |
   |------|---------|------|
   | Overview | | |
   | Player Fantasy | | |
   | Detailed Rules | | |
   | Formulas | | |
   | Edge Cases | | |
   | Dependencies | | |
   | Tuning Knobs | | |
   | Acceptance Criteria | | |

4. **내적 일관성 체크:**
   - 공식이 설명된 동작과 일치하는가?
   - 상태 전이가 완전하고 모순이 없는가?
   - 엣지 케이스가 주요 규칙과 충돌하는가?

5. **구현 가능성 체크:**
   - 프로그래머가 추가 질문 없이 구현할 수 있는가?
   - 모든 수식에 변수 테이블이 있는가?
   - 수용 기준이 테스트 가능하고 측정 가능한가?

6. **필라 정렬 체크 (컨셉 문서가 있는 경우):**
   - 이 시스템이 게임 필라 중 하나 이상을 지원하는가?
   - 루도내러티브 조화 문제가 있는가?

7. **결과 출력 (구조화된 리포트):**

   ```
   ## GDD 검토 리포트: [파일명]
   
   ### 완성도: X/8 섹션
   [섹션별 상태 표]
   
   ### 내적 일관성
   [발견된 문제 또는 "문제 없음"]
   
   ### 구현 가능성
   [발견된 갭 또는 "구현 준비 완료"]
   
   ### 필라 정렬
   [정렬 상태 또는 "컨셉 문서 없음 — 건너뜀"]
   
   ### 개선 권고사항
   [구체적이고 실행 가능한 피드백]
   
   ---
   판정: APPROVED / NEEDS REVISION / MAJOR REVISION NEEDED
   ```

**판정 기준:**
- **APPROVED**: 8섹션 모두 완성, 주요 일관성 문제 없음, 구현 준비 완료
- **NEEDS REVISION**: 7/8 섹션 또는 사소한 일관성 문제
- **MAJOR REVISION NEEDED**: 3개 이상 섹션 누락 또는 심각한 일관성 문제

**노트:** 이 커맨드는 읽기 전용입니다 — 파일을 수정하지 않습니다.
