# 수학 퀴즈 웹앱 - AI 작업 가이드

이 문서는 AI(Claude, Gemini 등)가 이 프로젝트에서 작업할 때 읽는 규칙서입니다.
코드 품질과 일관성을 유지하기 위해 반드시 이 가이드를 따라주세요.

## 프로젝트 개요

중학교 수학학원 선생님용 퀴즈 시스템입니다.
- **학생**: iPad Safari에서 이름/학년/반 입력 → 퀴즈 풀기 → 결과 확인
- **선생님**: 관리자 페이지에서 단원/난이도 선택 → 원클릭 퀴즈 생성 → 배포
- **호스팅**: GitHub Pages(무료) + Google Apps Script(무료 백엔드)
- **기술 스택**: 순수 HTML/CSS/JS (빌드 도구 없음, 프레임워크 없음)

## 파일 구조

```
math-quiz/
├── index.html          # 학생 입장 페이지 (이름/학년/반 입력)
├── quiz.html           # 퀴즈 풀기 페이지
├── result.html         # 결과 확인 페이지
├── admin.html          # 관리자 페이지 (퀴즈 생성/배포/결과조회)
├── css/style.css       # 전체 스타일 (CSS 변수, 모바일 퍼스트)
├── js/
│   ├── config.js       # 설정 (Apps Script URL, 비밀번호, 학년/단원 목록)
│   ├── api.js          # Google Apps Script API 통신
│   ├── katex-helpers.js # KaTeX 수식 렌더링
│   ├── svg-diagrams.js  # SVG 도형 헬퍼
│   ├── quiz-engine.js   # 학생 퀴즈 풀기 로직
│   ├── admin-engine.js  # 관리자 페이지 로직
│   └── generators/
│       ├── generator-base.js    # 공통 유틸 + 퀴즈 오케스트레이터
│       ├── grade1/              # 중1 생성기 (5개)
│       │   ├── prime-factorization.js   # 소인수분해
│       │   ├── integer-rational.js      # 정수와 유리수
│       │   ├── linear-equation.js       # 일차방정식
│       │   ├── coordinates-graph.js     # 좌표와 그래프
│       │   └── basic-geometry.js        # 기본 도형
│       ├── grade2/              # 중2 생성기 (6개)
│       │   ├── expression-calc.js       # 식의 계산
│       │   ├── simultaneous-eq.js       # 연립방정식
│       │   ├── inequality.js            # 부등식
│       │   ├── linear-function.js       # 일차함수
│       │   ├── shape-properties.js      # 도형의 성질
│       │   └── probability.js           # 확률
│       └── grade3/              # 중3 생성기 (7개)
│           ├── square-root-real.js      # 제곱근과 실수
│           ├── factoring.js             # 인수분해
│           ├── quadratic-equation.js    # 이차방정식
│           ├── quadratic-function.js    # 이차함수
│           ├── trigonometric-ratio.js   # 삼각비
│           ├── circle-properties.js     # 원의 성질
│           └── statistics.js            # 통계
└── apps-script/
    └── Code.gs          # Google Apps Script 백엔드 코드
```

## 핵심 아키텍처

### 네임스페이스

모든 코드는 `window.MathQuiz` 글로벌 객체 아래에 존재합니다.

```js
window.MathQuiz = window.MathQuiz || {};
MathQuiz.config     // 설정
MathQuiz.api        // API 통신
MathQuiz.renderMath // KaTeX 렌더링
MathQuiz.svg        // SVG 도형 헬퍼
MathQuiz.utils      // 유틸리티 함수
MathQuiz.generators // 생성기 레지스트리 (키: 'grade{N}-{topicId}')
MathQuiz.generateQuiz()        // 퀴즈 생성 오케스트레이터
MathQuiz.getAvailableGenerators() // 사용 가능한 생성기 목록
MathQuiz.quizEngine // 퀴즈 풀기 엔진
MathQuiz.admin      // 관리자 엔진
```

### 데이터 흐름

```
[관리자 페이지]                    [Google Sheets]           [학생 페이지]
config.js 설정 읽기
  ↓
generateQuiz() 호출
  ↓
문제 생성 (클라이언트)
  ↓
deploy() → POST ─────────────→ "현재퀴즈" 시트 저장
                                    ↓
                               GET (답 제거) ←──── loadQuiz()
                                                     ↓
                                                 퀴즈 풀기
                                                     ↓
                               "결과" 시트 ←── submitResult()
  ↓                                                  ↓
loadResults() → GET ←─── "결과" 시트              result.html
```

### 저장소 키

| 키 | 저장소 | 용도 |
|---|---|---|
| `studentName`, `grade`, `classNum` | sessionStorage | 학생 정보 |
| `quizData` | sessionStorage | 현재 퀴즈 데이터 |
| `quizAnswers` | sessionStorage | 학생 답안 (새로고침 복구용) |
| `quizResult` | sessionStorage | 채점 결과 |
| `testMode` | sessionStorage | 로컬 테스트 모드 플래그 |
| `adminAuth` | sessionStorage | 관리자 인증 |
| `localQuiz` | localStorage | 로컬 테스트 시 퀴즈 저장 |

## 문제 생성기 작성 규칙

### 필수 패턴 (IIFE)

새 생성기를 만들 때 반드시 이 패턴을 따라야 합니다:

```js
// js/generators/grade{N}/{topic-id}.js
(function() {
  var utils = MathQuiz.utils;
  var svgHelper = MathQuiz.svg; // SVG 도형이 필요한 경우만

  // 비공개 헬퍼 함수들
  function generateEasyProblem() { ... }
  function generateMediumProblem() { ... }
  function generateHardProblem() { ... }

  // 생성기 등록
  MathQuiz.generators['grade{N}-{topicId}'] = {
    meta: {
      grade: N,           // 1, 2, 3
      topic: '한국어 이름',
      topicId: '{topicId}',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2; // 1=하, 2=중, 3=상
      var type = options.type || 'multiple-choice';

      var result;
      if (difficulty === 1) {
        result = generateEasyProblem();
      } else if (difficulty === 2) {
        result = generateMediumProblem();
      } else {
        result = generateHardProblem();
      }

      return {
        type: type,
        questionText: result.questionText,    // 텍스트 ($...$로 수식 포함 가능)
        questionLatex: result.questionLatex,   // 별도 수식 블록 (없으면 null)
        svg: result.svg || null,              // SVG 도형 (없으면 null)
        choices: type === 'multiple-choice' ? result.choices : null,
        answer: result.answer,                // 정답 문자열
        answerIndex: type === 'multiple-choice' ? result.answerIndex : null,
        explanation: result.explanation        // 해설
      };
    }
  };
})();
```

### 역생성 (Backward Generation) 원칙

**절대 랜덤으로 문제를 만들고 풀지 마세요.** 반드시 정답을 먼저 정하고, 그 정답이 나오는 문제를 역으로 구성하세요.

```js
// 나쁜 예 (하지 마세요)
var a = randInt(1, 10);
var b = randInt(1, 10);
var answer = a + b;  // 답이 지저분할 수 있음

// 좋은 예 (이렇게 하세요)
var answer = randInt(5, 20);        // 깔끔한 답 먼저 결정
var a = randInt(1, answer - 1);     // 답에서 역으로 계산
var b = answer - a;
```

### 객관식 보기 생성 규칙

1. **정답을 choices[0]에 넣고** 오답 3개를 추가
2. `utils.unique()`로 중복 제거
3. `while` 루프에 **반드시 안전 카운터** 추가 (무한루프 방지)
4. `utils.shuffle()`로 섞고 `indexOf()`로 정답 위치 추적

```js
// 보기 생성 표준 패턴
var choices = [correctAnswer];
choices.push(distractor1, distractor2, distractor3);
choices = utils.unique(choices);
var _safe = 0;
while (choices.length < 4 && _safe++ < 20) {
  choices.push(fallbackChoice);
  choices = utils.unique(choices);
}
choices = choices.slice(0, 4);
var correctChoice = choices[0];
choices = utils.shuffle(choices);
var answerIndex = choices.indexOf(correctChoice);
```

### 사용 가능한 유틸리티 (MathQuiz.utils)

```js
// 랜덤
utils.randInt(min, max)           // 정수 랜덤 [min, max]
utils.randIntNonZero(min, max)    // 0 제외 랜덤
utils.randChoice(arr)             // 배열에서 랜덤 선택

// 배열
utils.shuffle(arr)                // 셔플 (새 배열 반환)
utils.unique(arr)                 // 중복 제거

// 수학
utils.gcd(a, b)                   // 최대공약수
utils.lcm(a, b)                   // 최소공배수
utils.isPrime(n)                  // 소수 판별
utils.primeFactors(n)             // 소인수분해 → {2: 3, 5: 1}

// 분수
utils.simplifyFraction(num, den)  // 약분 → {num, den}
utils.fractionToLatex(num, den)   // LaTeX → "\\frac{1}{3}"

// 수식 포맷
utils.primeFactorsToLatex(factors)// "2^{3} \\times 5"
utils.coeffStr(c, 'x', isFirst)  // 계수 표시 (1x→x, -1x→-x)
utils.constStr(c, isFirst)       // 상수항 표시 (+3, -5)

// 문제 생성
utils.generateUnique(gen, count, opts)          // 중복 없는 문제 생성
utils.generateDistractors(answer, count, fn)    // 오답 생성
utils.ensureUniqueChoices(answer, choices, fn)  // 보기 중복 제거 + 패딩
```

### SVG 도형 사용법 (MathQuiz.svg)

```js
var svg = MathQuiz.svg;

// 기본 도형
svg.open(width, height)                      // SVG 시작 태그
svg.close()                                  // SVG 끝 태그
svg.line(x1, y1, x2, y2, opts)              // 직선
svg.circle(cx, cy, r, opts)                  // 원
svg.polygon([[x,y], ...], opts)              // 다각형
svg.text(x, y, content, opts)                // 텍스트
svg.arc(cx, cy, r, startDeg, endDeg, opts)   // 호
svg.dot(x, y, opts)                          // 점

// 고수준 도형
svg.triangle(ax, ay, bx, by, cx, cy, labels) // 삼각형
svg.rightAngle(vx, vy, p1x, p1y, p2x, p2y)  // 직각 표시
svg.coordinateGrid(xMin, xMax, yMin, yMax, w, h) // 좌표평면
// → {svg: 문자열, toPixel: function(x,y)}
```

### 수식 표기 규칙

- **문제 텍스트 내 인라인 수식**: `$...$` 사용 → `"$x = 3$일 때"`
- **별도 수식 블록**: `questionLatex` 필드 → `"x^2 + 2x + 1 = 0"`
- **해설**: `$...$` 인라인 사용
- **보기**: `"$\\frac{1}{3}$"` 형태

## 새 생성기 추가 체크리스트

1. `js/generators/grade{N}/{topic-id}.js` 파일 생성
2. 위의 IIFE 패턴을 정확히 따름
3. `js/config.js`의 `GRADES[N].topics` 배열에 `{id, name}` 추가
4. `admin.html`에 `<script src="js/generators/grade{N}/{topic-id}.js">` 추가
5. 난이도 1/2/3 모두 구현
6. 객관식/주관식 모두 지원
7. `while` 루프에 안전 카운터 추가 확인
8. Node.js 문법 검사: `node -c 파일경로`
9. 테스트: 각 난이도/유형 조합에서 5문제씩 생성하여 오류 없는지 확인

## 코드 스타일 규칙

- **ES5 문법만 사용** (var, function, 프로토타입). let/const/화살표 함수/템플릿 리터럴 사용 금지
- **모든 텍스트는 한국어**
- **빌드 도구 없음**: 순수 HTML/CSS/JS 파일을 직접 로드
- **IIFE로 스코프 격리**: 전역 변수 오염 방지
- **세미콜론 필수**
- **들여쓰기**: 스페이스 2칸

## CSS 변수 (디자인 토큰)

```css
--primary: #4A90D9;        /* 파란색 (주요 버튼, 강조) */
--primary-light: #EBF3FC;  /* 연한 파랑 (배경) */
--success: #4CAF50;        /* 초록색 (정답, 성공) */
--error: #F44336;          /* 빨간색 (오답, 에러) */
--warning: #FF9800;        /* 주황색 (주관식 배지) */
--bg: #F5F7FA;             /* 페이지 배경 */
--text: #333333;           /* 본문 텍스트 */
--text-light: #888888;     /* 보조 텍스트 */
--border: #E0E4E8;         /* 테두리 */
--radius: 14px;            /* 모서리 둥글기 */
```

## Google Apps Script API

| 메서드 | 액션 | 보안 | 설명 |
|---|---|---|---|
| GET | `getQuiz` | 없음 | 현재 퀴즈 로드 (답 제거됨) |
| GET | `getResults&password=` | 비밀번호 | 결과 조회 |
| POST | `deployQuiz` | 비밀번호 | 퀴즈 배포 |
| POST | `submitResult` | 없음 | 결과 제출 (중복 방지) |

CORS 우회: `Content-Type: text/plain`으로 POST 요청

## 테스트 방법

### 로컬 테스트 (Apps Script 없이)

```bash
cd math-quiz
python3 -m http.server 8080
# → http://localhost:8080/admin.html (비밀번호: math1234)
# → http://localhost:8080/
```

`config.js`의 `APPS_SCRIPT_URL`이 빈 문자열이면 자동으로 localStorage 기반 로컬 모드로 동작합니다.

### Node.js 문법 검사

```bash
node -c js/generators/grade1/basic-geometry.js
```

## 주의사항

- `while (choices.length < 4)` 루프에는 반드시 `&& _safe++ < 20` 안전장치 필요
- `generateUnique`의 중복 키: `questionText + questionLatex + answer` 조합
- iPad Safari에서 `position: sticky`, `inputmode="decimal"` 호환성 확인 필요
- KaTeX CDN 버전: v0.16.21 (변경 시 호환성 테스트 필요)
