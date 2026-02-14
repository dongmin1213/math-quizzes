// 중2 - 연립방정식 (Simultaneous Equations)
(function() {
  var utils = MathQuiz.utils;

  // 연립방정식 LaTeX 생성 헬퍼
  function eqToLatex(a, b, c) {
    // ax + by = c
    var parts = '';
    parts += utils.coeffStr(a, 'x', true);
    parts += utils.coeffStr(b, 'y', false);
    parts += ' = ' + c;
    return parts;
  }

  // 연립방정식 생성 (backward: x, y를 먼저 결정)
  function generateSystem(difficulty) {
    var x, y, a1, b1, a2, b2, c1, c2;

    if (difficulty <= 1) {
      // 간단한 양의 정수 해, 작은 계수
      x = utils.randInt(1, 5);
      y = utils.randInt(1, 5);
      a1 = utils.randInt(1, 3);
      b1 = utils.randInt(1, 3);
      a2 = utils.randInt(1, 3);
      b2 = utils.randInt(1, 3);
      // 두 식이 같지 않도록
      var _safe = 0;
      while (a1 * b2 === a2 * b1 && _safe++ < 20) {
        a2 = utils.randInt(1, 3);
        b2 = utils.randInt(1, 3);
      }
    } else if (difficulty === 2) {
      // 음수 포함, 더 큰 계수
      x = utils.randIntNonZero(-5, 5);
      y = utils.randIntNonZero(-5, 5);
      a1 = utils.randIntNonZero(-5, 5);
      b1 = utils.randIntNonZero(-5, 5);
      a2 = utils.randIntNonZero(-5, 5);
      b2 = utils.randIntNonZero(-5, 5);
      var _safe = 0;
      while (a1 * b2 === a2 * b1 && _safe++ < 20) {
        a2 = utils.randIntNonZero(-5, 5);
        b2 = utils.randIntNonZero(-5, 5);
      }
    } else {
      // 큰 계수, 음수 해 포함
      x = utils.randIntNonZero(-8, 8);
      y = utils.randIntNonZero(-8, 8);
      a1 = utils.randIntNonZero(-7, 7);
      b1 = utils.randIntNonZero(-7, 7);
      a2 = utils.randIntNonZero(-7, 7);
      b2 = utils.randIntNonZero(-7, 7);
      var _safe = 0;
      while (a1 * b2 === a2 * b1 && _safe++ < 20) {
        a2 = utils.randIntNonZero(-7, 7);
        b2 = utils.randIntNonZero(-7, 7);
      }
    }

    c1 = a1 * x + b1 * y;
    c2 = a2 * x + b2 * y;

    return { x: x, y: y, a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: c2 };
  }

  // x 값을 묻는 문제
  function generateFindX(difficulty) {
    var sys = generateSystem(difficulty);
    var eq1 = eqToLatex(sys.a1, sys.b1, sys.c1);
    var eq2 = eqToLatex(sys.a2, sys.b2, sys.c2);

    var questionText = '다음 연립방정식의 해에서 $x$의 값을 구하시오.\n$$\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$$';
    var questionLatex = '\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}';
    var answer = String(sys.x);

    // 풀이 (가감법)
    var explanation = '연립방정식 $\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$\n';
    explanation += '가감법 또는 대입법을 이용하면 $x = ' + sys.x + '$, $y = ' + sys.y + '$';

    // 오답 생성
    var distractors = utils.generateDistractors(sys.x, 3, function() {
      return utils.randChoice([sys.y, sys.x + utils.randIntNonZero(-3, 3), -sys.x, sys.x + 1, sys.x - 1]);
    });

    var choices = ['$' + sys.x + '$'];
    for (var i = 0; i < distractors.length; i++) {
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

  // y 값을 묻는 문제
  function generateFindY(difficulty) {
    var sys = generateSystem(difficulty);
    var eq1 = eqToLatex(sys.a1, sys.b1, sys.c1);
    var eq2 = eqToLatex(sys.a2, sys.b2, sys.c2);

    var questionText = '다음 연립방정식의 해에서 $y$의 값을 구하시오.\n$$\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$$';
    var questionLatex = '\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}';
    var answer = String(sys.y);

    var explanation = '연립방정식 $\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$\n';
    explanation += '가감법 또는 대입법을 이용하면 $x = ' + sys.x + '$, $y = ' + sys.y + '$';

    var distractors = utils.generateDistractors(sys.y, 3, function() {
      return utils.randChoice([sys.x, sys.y + utils.randIntNonZero(-3, 3), -sys.y, sys.y + 1, sys.y - 1]);
    });

    var choices = ['$' + sys.y + '$'];
    for (var i = 0; i < distractors.length; i++) {
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

  // x + y 또는 x - y를 묻는 문제
  function generateFindXplusY(difficulty) {
    var sys = generateSystem(difficulty);
    var eq1 = eqToLatex(sys.a1, sys.b1, sys.c1);
    var eq2 = eqToLatex(sys.a2, sys.b2, sys.c2);
    var isSum = utils.randChoice([true, false]);
    var targetVal = isSum ? sys.x + sys.y : sys.x - sys.y;
    var targetExpr = isSum ? 'x + y' : 'x - y';

    var questionText = '다음 연립방정식을 풀어 $' + targetExpr + '$의 값을 구하시오.\n$$\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$$';
    var questionLatex = '\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}';
    var answer = String(targetVal);

    var explanation = '연립방정식을 풀면 $x = ' + sys.x + '$, $y = ' + sys.y + '$이므로\n';
    explanation += '$' + targetExpr + ' = ' + targetVal + '$';

    var distractors = utils.generateDistractors(targetVal, 3, function() {
      var options = [
        isSum ? sys.x - sys.y : sys.x + sys.y,
        targetVal + utils.randIntNonZero(-3, 3),
        -targetVal,
        sys.x * sys.y
      ];
      return utils.randChoice(options);
    });

    var choices = ['$' + targetVal + '$'];
    for (var i = 0; i < distractors.length; i++) {
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

  // x, y 모두 구하기 (순서쌍)
  function generateFindXY(difficulty) {
    var sys = generateSystem(difficulty);
    var eq1 = eqToLatex(sys.a1, sys.b1, sys.c1);
    var eq2 = eqToLatex(sys.a2, sys.b2, sys.c2);

    var questionText = '다음 연립방정식의 해 $(x, y)$를 구하시오.\n$$\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}$$';
    var questionLatex = '\\begin{cases} ' + eq1 + ' \\\\ ' + eq2 + ' \\end{cases}';
    var correctAnswer = '(' + sys.x + ', ' + sys.y + ')';

    var explanation = '가감법 또는 대입법을 이용하면 $x = ' + sys.x + '$, $y = ' + sys.y + '$\n';
    explanation += '따라서 해는 $' + correctAnswer + '$';

    var choices = ['$' + correctAnswer + '$'];
    choices.push('$(' + sys.y + ', ' + sys.x + ')$');
    choices.push('$(' + (-sys.x) + ', ' + sys.y + ')$');
    choices.push('$(' + sys.x + ', ' + (-sys.y) + ')$');

    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$(' + (sys.x + _safe) + ', ' + (sys.y - _safe) + ')$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: questionLatex,
      answer: correctAnswer,
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  MathQuiz.generators['grade2-simultaneous-eq'] = {
    meta: {
      grade: 2,
      topic: '연립방정식',
      topicId: 'simultaneous-eq',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subtype;
      if (difficulty <= 1) {
        subtype = utils.randChoice(['findX', 'findY', 'findXY']);
      } else {
        subtype = utils.randChoice(['findX', 'findY', 'findXplusY', 'findXY']);
      }

      var result;
      if (subtype === 'findX') {
        result = generateFindX(difficulty);
      } else if (subtype === 'findY') {
        result = generateFindY(difficulty);
      } else if (subtype === 'findXplusY') {
        result = generateFindXplusY(difficulty);
      } else {
        result = generateFindXY(difficulty);
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
