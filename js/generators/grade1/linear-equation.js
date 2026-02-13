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
        return this._generateSimple(type);
      } else if (difficulty === 2) {
        return utils.randChoice([
          this._generateTwoStep(type),
          this._generateBothSides(type, false)
        ]);
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
        // 분수 해를 허용
        var den = utils.randChoice([2, 3, 4, 5]);
        var num = utils.randIntNonZero(-10, 10);
        x = num; // 실제 값은 num/den
        a = utils.randIntNonZero(2, 6);
        c = utils.randIntNonZero(2, 6);
        while (a === c) c = utils.randIntNonZero(2, 6);
        // (a - c) * (num/den) = d - b
        // 이를 정수로 만들기 위해: a-c의 배수가 되도록
        var diff = a - c;
        b = utils.randIntNonZero(-10, 10);
        d = diff * num / den + b;
        // d가 정수가 아니면 다시 시도
        if (d !== Math.floor(d)) {
          // 정수 해로 폴백
          x = utils.randIntNonZero(-8, 8);
          d = diff * x + b;
        }
      } else {
        x = utils.randIntNonZero(-8, 8);
        a = utils.randIntNonZero(2, 7);
        c = utils.randIntNonZero(1, 6);
        while (a === c) c = utils.randIntNonZero(1, 6);
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

      // 우변에 상수 추가 가능
      var e = utils.randIntNonZero(-10, 10);
      var rhs = d + e;

      var lhs;
      if (a < 0) {
        lhs = '(' + a + ')(' + utils.coeffStr(b, 'x', true) + utils.constStr(c, false) + ')';
      } else {
        lhs = a + '(' + utils.coeffStr(b, 'x', true) + utils.constStr(c, false) + ')';
      }
      var equation = lhs + utils.constStr(e, false) + ' = ' + rhs + utils.constStr(e, false);

      // 단순화: a(bx+c) = d
      equation = lhs + ' = ' + d;
      rhs = d;

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
