// 수학 퀴즈 설정
window.MathQuiz = window.MathQuiz || {};

MathQuiz.config = {
  // Google Apps Script 배포 URL (선생님이 배포 후 여기에 입력)
  APPS_SCRIPT_URL: '',

  // 관리자 비밀번호 (선생님이 변경)
  ADMIN_PASSWORD: 'math1234',

  // 기본 설정
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
