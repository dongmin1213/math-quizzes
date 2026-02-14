// 중1 - 일차방정식 문제 생성기
(function() {
  var utils = MathQuiz.utils;

  MathQuiz.generators['grade1-linear-equation'] = {
    meta: {
      grade: 1,
      topic: '일차방정식',
      topicId: 'linear-equation',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      if (difficulty === 1) {
        var gen1 = utils.randChoice(['simple', 'oneStep', 'subtractForm', 'reverseForm']);
        if (gen1 === 'simple') return this._generateSimple(type);
        if (gen1 === 'oneStep') return this._generateOneStep(type);
        if (gen1 === 'subtractForm') return this._generateSubtractForm(type);
        return this._generateReverseForm(type);
      } else if (difficulty === 2) {
        var gen2 = utils.randChoice(['twoStep', 'bothSides', 'simpleDistrib', 'negativeCoeff']);
        if (gen2 === 'twoStep') return this._generateTwoStep(type);
        if (gen2 === 'bothSides') return this._generateBothSides(type, false);
        if (gen2 === 'simpleDistrib') return this._generateSimpleDistrib(type);
        return this._generateNegativeCoeff(type);
      } else {
        return utils.randChoice([
          this._generateBothSides(type, true),
          this._generateWithFractions(type),
          this._generateWithParentheses(type)
        ]);
      }
    },

    // 난이도 1: ax + b = c (단순 형태, x는 양의 정수)
    _generateSimple: function(type) {
      // 역생성: x를 먼저 정한다
      var x = utils.randInt(1, 9);
      var a = utils.randInt(2, 5);
      var b = utils.randInt(1, 9);
      var c = a * x + b;

      var equation = utils.coeffStr(a, 'x', true) + utils.constStr(b, false) + ' = ' + c;

      return this._buildResult(type, equation, x, '양변에서 $' + b + '$을 빼면 $' + a + 'x = ' + (c - b) + '$, 양변을 $' + a + '$로 나누면 $x = ' + x + '$');
    },

    // 난이도 1: 한 단계 방정식 (ax = c 또는 x + b = c)
    _generateOneStep: function(type) {
      var pattern = utils.randChoice(['mult', 'add']);
      var x, equation, explanation;

      if (pattern === 'mult') {
        // ax = c
        x = utils.randInt(2, 9);
        var a = utils.randInt(2, 9);
        var c = a * x;
        equation = utils.coeffStr(a, 'x', true) + ' = ' + c;
        explanation = '양변을 $' + a + '$로 나누면 $x = ' + x + '$';
      } else {
        // x + b = c
        x = utils.randInt(1, 15);
        var b = utils.randInt(1, 9);
        var c = x + b;
        equation = 'x' + utils.constStr(b, false) + ' = ' + c;
        explanation = '양변에서 $' + b + '$을 빼면 $x = ' + x + '$';
      }

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 1: ax - b = c (뺄셈 형태)
    _generateSubtractForm: function(type) {
      var x = utils.randInt(2, 9);
      var a = utils.randInt(2, 5);
      var b = utils.randInt(1, a * x - 1);
      var c = a * x - b;

      var equation = utils.coeffStr(a, 'x', true) + ' - ' + b + ' = ' + c;
      var explanation = '양변에 $' + b + '$을 더하면 $' + a + 'x = ' + (c + b) + '$, 양변을 $' + a + '$로 나누면 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 1: c = ax + b (좌우 반전 형태)
    _generateReverseForm: function(type) {
      var x = utils.randInt(1, 9);
      var a = utils.randInt(2, 5);
      var b = utils.randInt(1, 9);
      var c = a * x + b;

      var equation = c + ' = ' + utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
      var explanation = '좌변과 우변을 바꾸면 $' + utils.coeffStr(a, 'x', true) + utils.constStr(b, false) + ' = ' + c + '$, 정리하면 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 2: a(x + b) = c (단순 분배법칙)
    _generateSimpleDistrib: function(type) {
      var x = utils.randIntNonZero(-8, 8);
      var a = utils.randIntNonZero(2, 5);
      var b = utils.randIntNonZero(-6, 6);
      var c = a * (x + b);

      var equation = a + '(' + 'x' + utils.constStr(b, false) + ') = ' + c;
      var explanation = '분배법칙으로 전개하면 $' + utils.coeffStr(a, 'x', true) + utils.constStr(a * b, false) + ' = ' + c + '$, 정리하면 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 2: 음수 계수 방정식 -ax + b = c
    _generateNegativeCoeff: function(type) {
      var x = utils.randIntNonZero(-8, 8);
      var a = utils.randInt(-5, -2);
      var b = utils.randIntNonZero(-10, 10);
      var c = a * x + b;

      var equation = utils.coeffStr(a, 'x', true) + utils.constStr(b, false) + ' = ' + c;
      var explanation = '$' + equation + '$에서 이항하면 $' + utils.coeffStr(a, 'x', true) + ' = ' + (c - b) + '$, 양변을 $' + a + '$로 나누면 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 2: ax + b = c (x가 음수일 수 있음, 두 단계)
    _generateTwoStep: function(type) {
      var x = utils.randIntNonZero(-10, 10);
      var a = utils.randIntNonZero(2, 8);
      var b = utils.randIntNonZero(-15, 15);
      var c = a * x + b;

      var equation = utils.coeffStr(a, 'x', true) + utils.constStr(b, false) + ' = ' + c;

      var step1 = a + 'x = ' + c + utils.constStr(-b, false);
      var step2 = a + 'x = ' + (c - b);

      return this._buildResult(type, equation, x, '$' + equation + '$에서 $' + b + '$을 이항하면 $' + step2 + '$, 양변을 $' + a + '$로 나누면 $x = ' + x + '$');
    },

    // 난이도 2~3: ax + b = cx + d (양변에 x)
    _generateBothSides: function(type, allowFractionAnswer) {
      var x, a, c, b, d;

      if (allowFractionAnswer) {
        // 분수 해를 허용: 정수 해로 생성 (분수 표현이 채점에서 어려우므로)
        x = utils.randIntNonZero(-8, 8);
        a = utils.randIntNonZero(2, 6);
        c = utils.randIntNonZero(2, 6);
        var _safe = 0;
        while (a === c && _safe++ < 20) c = utils.randIntNonZero(2, 6);
        var diff = a - c;
        b = utils.randIntNonZero(-10, 10);
        d = diff * x + b;
      } else {
        x = utils.randIntNonZero(-8, 8);
        a = utils.randIntNonZero(2, 7);
        c = utils.randIntNonZero(1, 6);
        var _safe2 = 0;
        while (a === c && _safe2++ < 20) c = utils.randIntNonZero(1, 6);
        b = utils.randIntNonZero(-12, 12);
        d = (a - c) * x + b;
      }

      var lhs = utils.coeffStr(a, 'x', true) + utils.constStr(b, false);
      var rhs = utils.coeffStr(c, 'x', true) + utils.constStr(d, false);
      var equation = lhs + ' = ' + rhs;

      var coeff = a - c;
      var constant = d - b;

      var explanation = '$' + equation + '$에서 $x$항을 좌변으로, 상수항을 우변으로 이항하면 $' +
        utils.coeffStr(coeff, 'x', true) + ' = ' + constant + '$, 따라서 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 3: 분수 계수
    _generateWithFractions: function(type) {
      // 역생성: 깔끔한 정수 해
      var x = utils.randIntNonZero(-6, 6);
      var den = utils.randChoice([2, 3, 4, 6]);

      // (num/den)x + b = c 형태, 각 항이 정수가 되도록
      var num = utils.randIntNonZero(1, den - 1);
      var g = utils.gcd(Math.abs(num), den);
      num = num / g;
      var actualDen = den / g;

      // x가 actualDen의 배수가 되도록 조정
      if (x % actualDen !== 0) {
        x = actualDen * utils.randIntNonZero(-3, 3);
      }

      var fracResult = num * x / actualDen; // 이것이 정수
      var b = utils.randIntNonZero(-10, 10);
      var c = fracResult + b;

      var fracLatex = utils.fractionToLatex(num, actualDen);
      var equation = fracLatex + 'x' + utils.constStr(b, false) + ' = ' + c;

      var explanation = '양변에 $' + actualDen + '$을 곱하면 $' + num + 'x' + utils.constStr(b * actualDen, false) + ' = ' + (c * actualDen) + '$, 정리하면 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 난이도 3: 괄호 있는 방정식 a(bx + c) = d
    _generateWithParentheses: function(type) {
      var x = utils.randIntNonZero(-8, 8);
      var b = utils.randIntNonZero(2, 5);
      var c = utils.randIntNonZero(-8, 8);
      var inner = b * x + c;
      var a = utils.randIntNonZero(2, 4);
      var d = a * inner;

      var lhs;
      if (a < 0) {
        lhs = '(' + a + ')(' + utils.coeffStr(b, 'x', true) + utils.constStr(c, false) + ')';
      } else {
        lhs = a + '(' + utils.coeffStr(b, 'x', true) + utils.constStr(c, false) + ')';
      }
      var equation = lhs + ' = ' + d;
      var rhs = d;

      var expanded = a * b;
      var expandedConst = a * c;
      var explanation = '분배법칙으로 전개하면 $' + utils.coeffStr(expanded, 'x', true) + utils.constStr(expandedConst, false) + ' = ' + rhs + '$, 정리하면 $' + utils.coeffStr(expanded, 'x', true) + ' = ' + (rhs - expandedConst) + '$, 따라서 $x = ' + x + '$';

      return this._buildResult(type, equation, x, explanation);
    },

    // 결과 조립 헬퍼
    _buildResult: function(type, equation, answer, explanation) {
      var answerStr = String(answer);

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(answer, 3, function() {
          // 흔한 실수 기반 오답 생성
          var mistakes = [
            answer + 1,
            answer - 1,
            -answer,
            answer + 2,
            answer - 2,
            answer * 2,
            Math.floor(answer / 2)
          ];
          return utils.randChoice(mistakes);
        });

        var choices = [answerStr].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(answer + choices.length + 2));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(answerStr);

        return {
          type: type,
          questionText: '다음 일차방정식을 풀어 $x$의 값을 구하시오.',
          questionLatex: equation,
          svg: null,
          choices: choices.map(function(c) { return '$x = ' + c + '$'; }),
          answer: answerStr,
          answerIndex: correctIndex,
          explanation: explanation
        };
      } else {
        return {
          type: type,
          questionText: '다음 일차방정식을 풀어 $x$의 값을 구하시오.',
          questionLatex: equation,
          svg: null,
          choices: null,
          answer: answerStr,
          answerIndex: null,
          explanation: explanation
        };
      }
    }
  };
})();
