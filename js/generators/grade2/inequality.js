// 중2 - 부등식 (Inequalities)
(function() {
  var utils = MathQuiz.utils;

  var ineqSymbols = ['<', '>', '\\leq', '\\geq'];
  var ineqNames = ['작다', '크다', '작거나 같다', '크거나 같다'];
  var ineqReverseMap = { '<': '>', '>': '<', '\\leq': '\\geq', '\\geq': '\\leq' };

  // 부등호 반전 (음수로 나눌 때)
  function reverseIneq(sym) {
    return ineqReverseMap[sym] || sym;
  }

  // 부등호를 사람 읽기용 한글로
  function ineqToKorean(sym) {
    var idx = ineqSymbols.indexOf(sym);
    return idx >= 0 ? ineqNames[idx] : sym;
  }

  // 난이도 1: ax + b < c 형태 (한쪽에만 x)
  function generateSimpleInequality() {
    var a = utils.randIntNonZero(-5, 5);
    var b = utils.randIntNonZero(-10, 10);
    var ineqIdx = utils.randInt(0, 3);
    var ineq = ineqSymbols[ineqIdx];

    // backward: 정수 해의 경계값 설정
    var xBound = utils.randIntNonZero(-8, 8);
    var c = a * xBound + b;

    // ax + b < c  =>  ax < c - b  =>  x < (c-b)/a
    // 정답: x < xBound (a>0) 또는 x > xBound (a<0)
    var resultIneq = a > 0 ? ineq : reverseIneq(ineq);
    var answerLatex = 'x ' + resultIneq + ' ' + xBound;

    var lhs = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
    var questionText = '부등식 $' + lhs + ' ' + ineq + ' ' + c + '$을 풀어 $x$의 범위를 구하시오.';
    var questionLatex = lhs + ' ' + ineq + ' ' + c;

    // 풀이 과정
    var explanation = '$' + lhs + ' ' + ineq + ' ' + c + '$에서\n';
    explanation += '$' + utils.coeffStr(a, 'x', true) + ' ' + ineq + ' ' + (c - b) + '$\n';
    if (a < 0) {
      explanation += '양변을 $' + a + '$으로 나누면 부등호 방향이 바뀌므로\n';
    } else {
      explanation += '양변을 $' + a + '$으로 나누면\n';
    }
    explanation += '$' + answerLatex + '$';

    // 오답: 부등호 방향 실수, 계산 실수
    var wrongAnswers = [
      'x ' + reverseIneq(resultIneq) + ' ' + xBound,            // 부등호 방향 실수
      'x ' + resultIneq + ' ' + (-xBound),                       // 부호 실수
      'x ' + resultIneq + ' ' + (xBound + (a > 0 ? 1 : -1))     // 계산 실수
    ];

    var choices = ['$' + answerLatex + '$'];
    for (var i = 0; i < wrongAnswers.length; i++) {
      choices.push('$' + wrongAnswers[i] + '$');
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$x ' + utils.randChoice(ineqSymbols) + ' ' + (xBound + utils.randIntNonZero(-4, 4)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: '$' + answerLatex + '$',
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  // 난이도 2: ax + b < cx + d 형태 (양쪽에 x)
  function generateTwoSideInequality() {
    var a = utils.randIntNonZero(-6, 6);
    var c = utils.randIntNonZero(-6, 6);
    while (a === c) { c = utils.randIntNonZero(-6, 6); }

    var ineqIdx = utils.randInt(0, 3);
    var ineq = ineqSymbols[ineqIdx];

    // backward: 정수 경계값
    var xBound = utils.randIntNonZero(-8, 8);
    var diff = a - c; // (a-c)x < d-b
    // d - b = diff * xBound
    var dMinusB = diff * xBound;
    var b = utils.randIntNonZero(-10, 10);
    var d = dMinusB + b;

    // (a-c)x < d-b => 부호에 따라 부등호 반전
    var resultIneq = diff > 0 ? ineq : reverseIneq(ineq);
    var answerLatex = 'x ' + resultIneq + ' ' + xBound;

    var lhs = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
    var rhs = utils.coeffStr(c, 'x', true) + utils.constStr(d, false);

    var questionText = '부등식 $' + lhs + ' ' + ineq + ' ' + rhs + '$을 풀어 $x$의 범위를 구하시오.';
    var questionLatex = lhs + ' ' + ineq + ' ' + rhs;

    var explanation = '$' + lhs + ' ' + ineq + ' ' + rhs + '$에서\n';
    explanation += '$x$가 있는 항을 왼쪽, 상수항을 오른쪽으로 이항하면\n';
    explanation += '$' + utils.coeffStr(diff, 'x', true) + ' ' + ineq + ' ' + dMinusB + '$\n';
    if (diff < 0) {
      explanation += '양변을 $' + diff + '$으로 나누면 부등호 방향이 바뀌므로\n';
    } else {
      explanation += '양변을 $' + diff + '$으로 나누면\n';
    }
    explanation += '$' + answerLatex + '$';

    var wrongAnswers = [
      'x ' + reverseIneq(resultIneq) + ' ' + xBound,
      'x ' + resultIneq + ' ' + (-xBound),
      'x ' + ineq + ' ' + xBound
    ];

    var choices = ['$' + answerLatex + '$'];
    for (var i = 0; i < wrongAnswers.length; i++) {
      choices.push('$' + wrongAnswers[i] + '$');
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$x ' + utils.randChoice(ineqSymbols) + ' ' + (xBound + utils.randIntNonZero(-4, 4)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: '$' + answerLatex + '$',
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  // 난이도 1-2: 괄호가 있는 부등식 a(x + b) < c
  function generateParenInequality() {
    var a = utils.randIntNonZero(2, 5);
    var b = utils.randIntNonZero(-8, 8);
    var ineqIdx = utils.randInt(0, 3);
    var ineq = ineqSymbols[ineqIdx];

    var xBound = utils.randIntNonZero(-6, 6);
    var c = a * (xBound + b);

    var resultIneq = a > 0 ? ineq : reverseIneq(ineq);
    var answerLatex = 'x ' + resultIneq + ' ' + xBound;

    var inner = 'x' + utils.constStr(b, false);
    var questionText = '부등식 $' + a + '(' + inner + ') ' + ineq + ' ' + c + '$을 풀어 $x$의 범위를 구하시오.';
    var questionLatex = a + '(' + inner + ') ' + ineq + ' ' + c;

    var explanation = '양변을 $' + a + '$로 나누면\n';
    explanation += '$' + inner + ' ' + resultIneq + ' ' + (c / a) + '$\n';
    explanation += '정리하면 $' + answerLatex + '$';

    var wrongAnswers = [
      'x ' + reverseIneq(resultIneq) + ' ' + xBound,
      'x ' + resultIneq + ' ' + (-xBound),
      'x ' + resultIneq + ' ' + (xBound + b)
    ];

    var choices = ['$' + answerLatex + '$'];
    for (var i = 0; i < wrongAnswers.length; i++) {
      choices.push('$' + wrongAnswers[i] + '$');
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$x ' + utils.randChoice(ineqSymbols) + ' ' + (xBound + utils.randIntNonZero(-4, 4)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: '$' + answerLatex + '$',
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  // 난이도 1: ax > b 형태 (상수항 없는 단순)
  function generateOneStepInequality() {
    var a = utils.randIntNonZero(-6, 6);
    var ineqIdx = utils.randInt(0, 3);
    var ineq = ineqSymbols[ineqIdx];

    var xBound = utils.randIntNonZero(-8, 8);
    var c = a * xBound;

    var resultIneq = a > 0 ? ineq : reverseIneq(ineq);
    var answerLatex = 'x ' + resultIneq + ' ' + xBound;

    var lhs = utils.coeffStr(a, 'x', true);
    var questionText = '부등식 $' + lhs + ' ' + ineq + ' ' + c + '$을 풀어 $x$의 범위를 구하시오.';
    var questionLatex = lhs + ' ' + ineq + ' ' + c;

    var explanation = '양변을 $' + a + '$로 나누면';
    if (a < 0) explanation += ' (부등호 방향 반전)';
    explanation += '\n$' + answerLatex + '$';

    var wrongAnswers = [
      'x ' + reverseIneq(resultIneq) + ' ' + xBound,
      'x ' + resultIneq + ' ' + (-xBound),
      'x ' + ineq + ' ' + xBound
    ];

    var choices = ['$' + answerLatex + '$'];
    for (var i = 0; i < wrongAnswers.length; i++) {
      choices.push('$' + wrongAnswers[i] + '$');
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$x ' + utils.randChoice(ineqSymbols) + ' ' + (xBound + utils.randIntNonZero(-4, 4)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: '$' + answerLatex + '$',
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  // 난이도 3: 연립부등식 (두 부등식 동시에 만족)
  function generateSystemInequality() {
    // backward: x의 범위를 먼저 정함
    var lower = utils.randIntNonZero(-6, 4);
    var upper = lower + utils.randInt(3, 7);

    // 부등식 1: a1*x + b1 >= c1 (하한)
    var a1 = utils.randIntNonZero(1, 4);
    var b1 = utils.randIntNonZero(-10, 10);
    var c1 = a1 * lower + b1;

    // 부등식 2: a2*x + b2 < c2 (상한)
    var a2 = utils.randIntNonZero(1, 4);
    var b2 = utils.randIntNonZero(-10, 10);
    var c2 = a2 * upper + b2;

    var lhs1 = utils.coeffStr(a1, 'x', true) + utils.constStr(b1, false);
    var lhs2 = utils.coeffStr(a2, 'x', true) + utils.constStr(b2, false);

    var questionText = '연립부등식 $\\begin{cases} ' + lhs1 + ' \\geq ' + c1 + ' \\\\ ' + lhs2 + ' < ' + c2 + ' \\end{cases}$을 만족하는 정수 $x$의 개수를 구하시오.';
    var questionLatex = '\\begin{cases} ' + lhs1 + ' \\geq ' + c1 + ' \\\\ ' + lhs2 + ' < ' + c2 + ' \\end{cases}';

    var count = upper - lower; // lower <= x < upper 이므로 개수 = upper - lower

    var explanation = '첫째 부등식에서 $x \\geq ' + lower + '$\n';
    explanation += '둘째 부등식에서 $x < ' + upper + '$\n';
    explanation += '따라서 $' + lower + ' \\leq x < ' + upper + '$\n';
    explanation += '정수: $' + lower + ', ' + (lower + 1) + ', \\ldots, ' + (upper - 1) + '$ → $' + count + '$개';

    var answer = String(count);

    var distractors = utils.generateDistractors(count, 3, function() {
      return count + utils.randChoice([-2, -1, 1, 2, 3]);
    });
    distractors = distractors.filter(function(d) { return d > 0; });
    while (distractors.length < 3) {
      distractors.push(count + distractors.length + 1);
    }

    var choices = ['$' + count + '$'];
    for (var i = 0; i < 3; i++) {
      choices.push('$' + distractors[i] + '$');
    }
    var shuffled = utils.shuffle([0, 1, 2, 3]);
    var reordered = shuffled.map(function(idx) { return choices[idx]; });
    var answerIndex = shuffled.indexOf(0);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: answer,
      answerIndex: answerIndex,
      choices: reordered,
      explanation: explanation
    };
  }

  // 난이도 3: 정수 해의 개수 구하기
  function generateCountIntegerSolutions() {
    var a = utils.randIntNonZero(-5, 5);
    var b = utils.randIntNonZero(-15, 15);
    var c = utils.randIntNonZero(-15, 15);

    // ax + b < c => ax < c-b => x < (c-b)/a or x > (c-b)/a
    var rhs = c - b;
    var isPositiveA = a > 0;

    // 구간을 만들기 위해 두 번째 부등식 추가
    var lower, upper;
    if (isPositiveA) {
      upper = Math.floor(rhs / a); // x 의 상한 (< 이면)
      if (rhs % a === 0) upper = upper - 1; // strict inequality
      lower = utils.randInt(upper - 6, upper - 2);
    } else {
      lower = Math.ceil(rhs / a); // x의 하한 (> 이면)
      if (rhs % a === 0) lower = lower + 1;
      upper = utils.randInt(lower + 2, lower + 6);
    }

    // 정수 해 개수 = upper - lower + 1
    var count = upper - lower + 1;
    if (count <= 0) {
      // 안전 장치: 기본값 재설정
      lower = -2; upper = 3;
      count = upper - lower + 1;
    }

    // ax + b < c, x >= lower 형태의 연립부등식
    var lhs1 = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);

    var questionText = '$' + lower + ' \\leq x$ 이고 $' + lhs1 + ' < ' + c + '$ 을 만족하는 정수 $x$의 개수를 구하시오.';
    var questionLatex = lower + ' \\leq x, \\quad ' + lhs1 + ' < ' + c;

    var explanation = '$' + lhs1 + ' < ' + c + '$에서 ';
    explanation += '$' + utils.coeffStr(a, 'x', true) + ' < ' + rhs + '$\n';
    if (a < 0) {
      explanation += '양변을 $' + a + '$으로 나누면 (부등호 반전) ';
      explanation += '$x > ' + utils.fractionToLatex(rhs, a) + '$\n';
    } else {
      explanation += '$x < ' + utils.fractionToLatex(rhs, a) + '$\n';
    }
    explanation += '$' + lower + ' \\leq x$ 조건과 합치면 ';
    explanation += '정수 $x$는 $' + lower + ', ' + (lower + 1) + ', \\ldots, ' + upper + '$으로 총 $' + count + '$개';

    var answer = String(count);

    var distractors = utils.generateDistractors(count, 3, function() {
      return count + utils.randChoice([-2, -1, 1, 2, 3]);
    });
    // 음수 개수는 제거
    distractors = distractors.filter(function(d) { return d > 0; });
    while (distractors.length < 3) {
      var nd = count + utils.randIntNonZero(1, 5);
      if (nd !== count && nd > 0 && distractors.indexOf(nd) === -1) {
        distractors.push(nd);
      }
    }

    var choices = ['$' + count + '$'];
    for (var i = 0; i < 3; i++) {
      choices.push('$' + distractors[i] + '$');
    }
    var shuffled = utils.shuffle([0, 1, 2, 3]);
    var reordered = shuffled.map(function(idx) { return choices[idx]; });
    var answerIndex = shuffled.indexOf(0);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: answer,
      answerIndex: answerIndex,
      choices: reordered,
      explanation: explanation
    };
  }

  MathQuiz.generators['grade2-inequality'] = {
    meta: {
      grade: 2,
      topic: '부등식',
      topicId: 'inequality',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var result;
      if (difficulty <= 1) {
        result = utils.randChoice([generateSimpleInequality, generateOneStepInequality, generateParenInequality])();
      } else if (difficulty === 2) {
        result = utils.randChoice([generateSimpleInequality, generateTwoSideInequality, generateParenInequality])();
      } else {
        result = utils.randChoice([generateTwoSideInequality, generateCountIntegerSolutions, generateSystemInequality])();
      }

      return {
        type: type,
        questionText: result.questionText,
        questionLatex: result.questionLatex,
        svg: null,
        choices: type === 'multiple-choice' ? result.choices : null,
        answer: result.answer,
        answerIndex: type === 'multiple-choice' ? result.answerIndex : null,
        explanation: result.explanation
      };
    }
  };
})();
