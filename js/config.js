// ============================================================
//  ★ 선생님이 수정할 부분은 여기 2곳뿐입니다! ★
//
//  1) APPS_SCRIPT_URL : Google Apps Script 배포 후 받은 URL
//  2) ADMIN_PASSWORD  : 관리자 페이지 비밀번호
//
//  수정 방법:
//   - 따옴표('') 안의 내용만 바꾸세요
//   - 따옴표 자체는 지우지 마세요
//   - 수정 후 저장 → GitHub에 push 하면 반영됩니다
// ============================================================
window.MathQuiz = window.MathQuiz || {};

MathQuiz.config = {
  // ★ [수정 1] 아래 따옴표 안에 Google Apps Script URL을 붙여넣으세요
  // 예시: 'https://script.google.com/macros/s/AKfycbx.../exec'
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx6lpJqymbwuisPF5LolanbVWngKgOx-yzX4taEwz8kUWTtXJgic3-72oCnHrxc_xYr/exec',

  // ★ [수정 2] 관리자 비밀번호를 원하는 것으로 바꾸세요
  ADMIN_PASSWORD: 'math1234',

  // 버전 (커밋 시 자동 갱신)
  VERSION: 'v2025.02.14-83b8ab0',

  // ── 아래는 수정하지 않아도 됩니다 ──
  DEFAULT_PROBLEM_COUNT: 10,
  DEFAULT_DIFFICULTY: 2,
  DEFAULT_MC_RATIO: 0.7,

  // 학년별 단원 정보
  GRADES: {
    1: {
      name: '중1',
      topics: [
        { id: 'prime-factorization', name: '소인수분해' },
        { id: 'integer-rational', name: '정수와 유리수' },
        { id: 'linear-equation', name: '일차방정식' },
        { id: 'coordinates-graph', name: '좌표와 그래프' },
        { id: 'basic-geometry', name: '기본 도형' }
      ]
    },
    2: {
      name: '중2',
      topics: [
        { id: 'expression-calc', name: '식의 계산' },
        { id: 'simultaneous-eq', name: '연립방정식' },
        { id: 'inequality', name: '부등식' },
        { id: 'linear-function', name: '일차함수' },
        { id: 'shape-properties', name: '도형의 성질' },
        { id: 'probability', name: '확률' }
      ]
    },
    3: {
      name: '중3',
      topics: [
        { id: 'square-root-real', name: '제곱근과 실수' },
        { id: 'factoring', name: '인수분해' },
        { id: 'quadratic-equation', name: '이차방정식' },
        { id: 'quadratic-function', name: '이차함수' },
        { id: 'trigonometric-ratio', name: '삼각비' },
        { id: 'circle-properties', name: '원의 성질' },
        { id: 'statistics', name: '통계' }
      ]
    }
  }
};
