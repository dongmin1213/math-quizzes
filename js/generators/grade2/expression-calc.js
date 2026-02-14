// 중2 - 식의 계산 (Expression Calculation)
(function() {
  var utils = MathQuiz.utils;

  // 단항식 곱셈/나눗셈 문제 생성
  function generateMonomialOperation(difficulty) {
    if (difficulty <= 1) {
      // 간단한 지수법칙: a^m * a^n = a^(m+n)
      var base = utils.randChoice(['a', 'x', 'y']);
      var m = utils.randInt(2, 5);
      var n = utils.randInt(2, 5);
      var answer = m + n;
      var questionText = '$' + base + '^{' + m + '} \\times ' + base + '^{' + n + '}$ 을 계산하시오.';
      var questionLatex = base + '^{' + m + '} \\times ' + base + '^{' + n + '}';
      var answerStr = '$' + base + '^{' + answer + '}$';
      var explanation = '$' + base + '^{' + m + '} \\times ' + base + '^{' + n + '} = ' +
        base + '^{' + m + '+' + n + '} = ' + base + '^{' + answer + '}$';

      var distractors = utils.generateDistractors(answer, 3, function() {
        return utils.randChoice([m * n, answer + 1, answer - 1, Math.abs(m - n)]);
      });

      var choices = ['$' + base + '^{' + answer + '}$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + base + '^{' + distractors[i] + '}$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: questionLatex,
        answer: answerStr,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation
      };
    } else if (difficulty === 2) {
      // 단항식 곱셈: 계수와 변수 포함
      var coeff1 = utils.randIntNonZero(-5, 5);
      var coeff2 = utils.randIntNonZero(-5, 5);
      var exp1 = utils.randInt(1, 3);
      var exp2 = utils.randInt(1, 3);

      var resultCoeff = coeff1 * coeff2;
      var resultExp = exp1 + exp2;

      var term1Latex = (coeff1 === 1 ? '' : (coeff1 === -1 ? '-' : coeff1)) + 'x^{' + exp1 + '}';
      var term2Latex = (coeff2 === 1 ? '' : (coeff2 === -1 ? '-' : coeff2)) + 'x^{' + exp2 + '}';

      var resultCoeffStr = resultCoeff === 1 ? '' : (resultCoeff === -1 ? '-' : String(resultCoeff));
      var answerLatex = resultCoeffStr + 'x^{' + resultExp + '}';

      var questionText = '$(' + term1Latex + ') \\times (' + term2Latex + ')$ 을 계산하시오.';
      var questionLatex2 = '(' + term1Latex + ') \\times (' + term2Latex + ')';

      var explanation = '$(' + term1Latex + ') \\times (' + term2Latex + ') = ' + answerLatex + '$';

      var distCoeffs = utils.generateDistractors(resultCoeff, 3, function() {
        return utils.randChoice([resultCoeff + utils.randIntNonZero(-3, 3), -resultCoeff, coeff1 + coeff2]);
      });

      var choices = ['$' + answerLatex + '$'];
      for (var i = 0; i < distCoeffs.length; i++) {
        var dc = distCoeffs[i];
        var dcStr = dc === 1 ? '' : (dc === -1 ? '-' : String(dc));
        var wrongExp = utils.randChoice([resultExp, exp1 * exp2, resultExp + 1]);
        choices.push('$' + dcStr + 'x^{' + wrongExp + '}$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: questionLatex2,
        answer: '$' + answerLatex + '$',
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation
      };
    } else {
      // (a^m)^n = a^(mn), 거듭제곱의 거듭제곱
      var base = utils.randChoice(['x', 'a', 'y']);
      var m = utils.randInt(2, 4);
      var n = utils.randInt(2, 4);
      var coeff = utils.randIntNonZero(2, 4);
      var outerExp = utils.randInt(2, 3);

      // (coeff * base^m)^outerExp = coeff^outerExp * base^(m*outerExp)
      var resultCoeff = Math.pow(coeff, outerExp);
      var resultExp = m * outerExp;

      var innerLatex = coeff + base + '^{' + m + '}';
      var answerLatex = resultCoeff + base + '^{' + resultExp + '}';

      var questionText = '$(' + innerLatex + ')^{' + outerExp + '}$ 을 계산하시오.';
      var questionLatex3 = '(' + innerLatex + ')^{' + outerExp + '}';

      var explanation = '$(' + innerLatex + ')^{' + outerExp + '} = ' +
        coeff + '^{' + outerExp + '} \\times ' + base + '^{' + m + ' \\times ' + outerExp + '} = ' +
        answerLatex + '$';

      var wrongAnswers = [
        (coeff * outerExp) + base + '^{' + resultExp + '}',
        resultCoeff + base + '^{' + (m + outerExp) + '}',
        (coeff * outerExp) + base + '^{' + (m + outerExp) + '}'
      ];

      var choices = ['$' + answerLatex + '$'];
      for (var i = 0; i < wrongAnswers.length; i++) {
        choices.push('$' + wrongAnswers[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: questionLatex3,
        answer: '$' + answerLatex + '$',
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation
      };
    }
  }

  // 단항식 나눗셈 문제: a^m ÷ a^n = a^(m-n)
  function generateMonomialDivision(difficulty) {
    var base = utils.randChoice(['a', 'x', 'y']);
    var n = utils.randInt(2, 4);
    var m = n + utils.randInt(1, 4); // m > n 보장
    var answer = m - n;

    if (difficulty >= 2) {
      // 계수 포함: (coeff1 * base^m) ÷ (coeff2 * base^n)
      var coeff2 = utils.randChoice([2, 3, 4, 5]);
      var quotientCoeff = utils.randIntNonZero(-4, 4);
      var coeff1 = quotientCoeff * coeff2;

      var term1 = (coeff1 === 1 ? '' : (coeff1 === -1 ? '-' : coeff1)) + base + '^{' + m + '}';
      var term2 = coeff2 + base + '^{' + n + '}';
      var resCoeffStr = quotientCoeff === 1 ? '' : (quotientCoeff === -1 ? '-' : String(quotientCoeff));
      var answerLatex = answer === 1 ? resCoeffStr + base : resCoeffStr + base + '^{' + answer + '}';

      var questionText = '$' + term1 + ' \\div ' + term2 + '$ 을 계산하시오.';
      var explanation = '$' + term1 + ' \\div ' + term2 + ' = ' + answerLatex + '$';

      var wrongAnswers = [
        (quotientCoeff === 1 ? '' : quotientCoeff) + base + '^{' + (m + n) + '}',
        (coeff1 + coeff2) + base + '^{' + answer + '}',
        resCoeffStr + base + '^{' + (m * n) + '}'
      ];

      var choices = ['$' + answerLatex + '$'];
      for (var i = 0; i < wrongAnswers.length; i++) {
        choices.push('$' + wrongAnswers[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        choices.push('$' + (quotientCoeff + _safe) + base + '^{' + (answer + _safe) + '}$');
        choices = utils.unique(choices);
      }
      choices = choices.slice(0, 4);
      var correctChoice = choices[0];
      choices = utils.shuffle(choices);
      var answerIndex = choices.indexOf(correctChoice);

      return {
        questionText: questionText,
        questionLatex: term1 + ' \\div ' + term2,
        answer: '$' + answerLatex + '$',
        answerIndex: answerIndex,
        choices: choices,
        explanation: explanation
      };
    }

    // 단순: a^m ÷ a^n
    var questionText = '$' + base + '^{' + m + '} \\div ' + base + '^{' + n + '}$ 을 계산하시오.';
    var answerStr = answer === 1 ? '$' + base + '$' : '$' + base + '^{' + answer + '}$';
    var answerLatex2 = answer === 1 ? base : base + '^{' + answer + '}';
    var explanation = '$' + base + '^{' + m + '} \\div ' + base + '^{' + n + '} = ' + base + '^{' + m + '-' + n + '} = ' + answerLatex2 + '$';

    var distractors = utils.generateDistractors(answer, 3, function() {
      return utils.randChoice([m + n, m * n, answer + 1, Math.abs(answer - 1)]);
    });

    var choices = ['$' + answerLatex2 + '$'];
    for (var i = 0; i < distractors.length; i++) {
      choices.push('$' + base + '^{' + distractors[i] + '}$');
    }
    var shuffled = utils.shuffle([0, 1, 2, 3]);
    var reordered = shuffled.map(function(idx) { return choices[idx]; });
    var answerIndex = shuffled.indexOf(0);

    return {
      questionText: questionText,
      questionLatex: base + '^{' + m + '} \\div ' + base + '^{' + n + '}',
      answer: answerStr,
      answerIndex: answerIndex,
      choices: reordered,
      explanation: explanation
    };
  }

  // 다항식 ÷ 단항식 (난이도 3)
  function generatePolynomialDivision() {
    // (ax^2 + bx) ÷ x = ax + b
    var divisor = utils.randIntNonZero(1, 4);
    var resA = utils.randIntNonZero(-5, 5);
    var resB = utils.randIntNonZero(-8, 8);

    var polyA = resA * divisor;
    var polyB = resB * divisor;

    var polyLatex = utils.coeffStr(polyA, 'x^{2}', true) + utils.coeffStr(polyB, 'x', false);
    var divisorLatex = divisor === 1 ? 'x' : divisor + 'x';
    var answerLatex = utils.coeffStr(resA, 'x', true) + utils.constStr(resB, false);

    var questionText = '$(' + polyLatex + ') \\div ' + divisorLatex + '$ 을 계산하시오.';
    var explanation = '$(' + polyLatex + ') \\div ' + divisorLatex + ' = ' + answerLatex + '$';

    var wrongAnswers = [
      utils.coeffStr(resA, 'x', true) + utils.constStr(-resB, false),
      utils.coeffStr(-resA, 'x', true) + utils.constStr(resB, false),
      utils.coeffStr(polyA, 'x', true) + utils.constStr(resB, false)
    ];

    var choices = ['$' + answerLatex + '$'];
    for (var i = 0; i < wrongAnswers.length; i++) {
      choices.push('$' + wrongAnswers[i] + '$');
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$' + utils.coeffStr(resA + _safe, 'x', true) + utils.constStr(resB + _safe, false) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: '(' + polyLatex + ') \\div ' + divisorLatex,
      answer: '$' + answerLatex + '$',
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation
    };
  }

  // 다항식 덧셈/뺄셈 문제 생성
  function generatePolynomialAddSub(difficulty) {
    if (difficulty <= 1) {
      // (ax + b) + (cx + d) 또는 뺄셈
      var a = utils.randIntNonZero(-5, 5);
      var b = utils.randIntNonZero(-9, 9);
      var c = utils.randIntNonZero(-5, 5);
      var d = utils.randIntNonZero(-9, 9);
      var isSub = utils.randChoice([true, false]);

      var resA, resB;
      if (isSub) {
        resA = a - c;
        resB = b - d;
      } else {
        resA = a + c;
        resB = b + d;
      }

      var poly1 = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
      var poly2 = utils.coeffStr(c, 'x', true) + utils.constStr(d, false);
      var op = isSub ? '-' : '+';

      var answerLatex = '';
      if (resA !== 0) answerLatex += utils.coeffStr(resA, 'x', true);
      if (resB !== 0) answerLatex += utils.constStr(resB, resA === 0);
      if (resA === 0 && resB === 0) answerLatex = '0';

      var questionText = '$(' + poly1 + ') ' + op + ' (' + poly2 + ')$ 을 계산하시오.';
      var questionLatex = '(' + poly1 + ') ' + op + ' (' + poly2 + ')';

      var explanation = '$(' + poly1 + ') ' + op + ' (' + poly2 + ') = ' + answerLatex + '$';

      var distCoeffs = utils.generateDistractors(resA * 100 + resB, 3, function() {
        var da = resA + utils.randIntNonZero(-2, 2);
        var db = resB + utils.randIntNonZero(-2, 2);
        return da * 100 + db;
      });

      var choices = ['$' + answerLatex + '$'];
      for (var i = 0; i < distCoeffs.length; i++) {
        var da = Math.floor(distCoeffs[i] / 100);
        var db = distCoeffs[i] % 100;
        if (db > 50) { da += 1; db -= 100; }
        if (db < -50) { da -= 1; db += 100; }
        var wrongLatex = '';
        if (da !== 0) wrongLatex += utils.coeffStr(da, 'x', true);
        if (db !== 0) wrongLatex += utils.constStr(db, da === 0);
        if (da === 0 && db === 0) wrongLatex = '0';
        choices.push('$' + wrongLatex + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: questionLatex,
        answer: '$' + answerLatex + '$',
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation
      };
    } else {
      // 다항식 곱셈: (ax+b)(cx+d) = acx^2 + (ad+bc)x + bd
      var a = utils.randIntNonZero(-4, 4);
      var b = utils.randIntNonZero(-6, 6);
      var c = utils.randIntNonZero(-4, 4);
      var d = utils.randIntNonZero(-6, 6);

      if (difficulty === 2) {
        a = utils.randChoice([1, -1, 2, -2]);
        c = utils.randChoice([1, -1, 2, -2]);
      }

      var resA = a * c;
      var resB = a * d + b * c;
      var resC = b * d;

      var poly1 = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
      var poly2 = utils.coeffStr(c, 'x', true) + utils.constStr(d, false);

      var answerLatex = '';
      if (resA !== 0) answerLatex += utils.coeffStr(resA, 'x^{2}', true);
      if (resB !== 0) answerLatex += utils.coeffStr(resB, 'x', resA === 0);
      if (resC !== 0) answerLatex += utils.constStr(resC, resA === 0 && resB === 0);
      if (resA === 0 && resB === 0 && resC === 0) answerLatex = '0';

      var questionText = '$(' + poly1 + ')(' + poly2 + ')$ 을 전개하시오.';
      var questionLatex = '(' + poly1 + ')(' + poly2 + ')';

      var explanation = '$(' + poly1 + ')(' + poly2 + ')$에서 분배법칙을 적용하면\n$= ' + answerLatex + '$';

      // 오답: 흔한 실수 반영
      var wrongAnswers = [];
      // 중간항 부호 실수
      var w1 = '';
      if (resA !== 0) w1 += utils.coeffStr(resA, 'x^{2}', true);
      if (resB !== 0) w1 += utils.coeffStr(-resB, 'x', resA === 0);
      if (resC !== 0) w1 += utils.constStr(resC, resA === 0 && resB === 0);
      wrongAnswers.push(w1 || '0');
      // 상수항 실수
      var w2 = '';
      if (resA !== 0) w2 += utils.coeffStr(resA, 'x^{2}', true);
      if (resB !== 0) w2 += utils.coeffStr(resB, 'x', resA === 0);
      w2 += utils.constStr(-resC, resA === 0 && resB === 0);
      wrongAnswers.push(w2 || '0');
      // 중간항 계산 실수 (a*d - b*c)
      var wrongB = a * d - b * c;
      var w3 = '';
      if (resA !== 0) w3 += utils.coeffStr(resA, 'x^{2}', true);
      if (wrongB !== 0) w3 += utils.coeffStr(wrongB, 'x', resA === 0);
      if (resC !== 0) w3 += utils.constStr(resC, resA === 0 && wrongB === 0);
      wrongAnswers.push(w3 || '0');

      var choices = ['$' + answerLatex + '$'];
      for (var i = 0; i < wrongAnswers.length; i++) {
        choices.push('$' + wrongAnswers[i] + '$');
      }
      // 중복 제거 후 부족하면 추가
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var extraA = resA;
        var extraB = resB + utils.randIntNonZero(-3, 3);
        var extraC = resC + utils.randIntNonZero(-3, 3);
        var ex = '';
        if (extraA !== 0) ex += utils.coeffStr(extraA, 'x^{2}', true);
        if (extraB !== 0) ex += utils.coeffStr(extraB, 'x', extraA === 0);
        if (extraC !== 0) ex += utils.constStr(extraC, extraA === 0 && extraB === 0);
        choices.push('$' + (ex || '0') + '$');
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
  }

  MathQuiz.generators['grade2-expression-calc'] = {
    meta: {
      grade: 2,
      topic: '식의 계산',
      topicId: 'expression-calc',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      // 난이도에 따라 하위 유형 선택
      var subtype;
      if (difficulty === 1) {
        subtype = utils.randChoice(['monomial', 'poly-addsub', 'monomial-div']);
      } else if (difficulty === 2) {
        subtype = utils.randChoice(['monomial', 'poly-addsub', 'poly-mult', 'monomial-div']);
      } else {
        subtype = utils.randChoice(['monomial', 'poly-mult', 'poly-mult', 'poly-div']);
      }

      var result;
      if (subtype === 'monomial') {
        result = generateMonomialOperation(difficulty);
      } else if (subtype === 'monomial-div') {
        result = generateMonomialDivision(difficulty);
      } else if (subtype === 'poly-addsub') {
        result = generatePolynomialAddSub(1);
      } else if (subtype === 'poly-div') {
        result = generatePolynomialDivision();
      } else {
        result = generatePolynomialAddSub(difficulty);
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
