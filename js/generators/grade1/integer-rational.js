// 중1 - 정수와 유리수 문제 생성기
(function() {
  var utils = MathQuiz.utils;

  // 난이도별 정수 범위
  function intRange(difficulty) {
    if (difficulty === 1) return { min: 1, max: 9 };
    if (difficulty === 2) return { min: 10, max: 50 };
    return { min: 10, max: 99 };
  }

  // 부호 있는 정수 생성
  function signedInt(difficulty) {
    var r = intRange(difficulty);
    var n = utils.randInt(r.min, r.max);
    if (difficulty >= 2 && Math.random() < 0.5) n = -n;
    return n;
  }

  // 간단한 분수 생성 (기약분수)
  function simpleFraction(difficulty) {
    var maxDen;
    if (difficulty === 1) maxDen = 6;
    else if (difficulty === 2) maxDen = 10;
    else maxDen = 12;

    var den = utils.randInt(2, maxDen);
    var num = utils.randIntNonZero(-den + 1, den - 1);
    if (difficulty < 3 && num < 0) num = -num;
    var g = utils.gcd(Math.abs(num), den);
    return { num: num / g, den: den / g };
  }

  // 분수를 표시 문자열로
  function fracDisplay(num, den) {
    return utils.fractionToLatex(num, den);
  }

  MathQuiz.generators['grade1-integer-rational'] = {
    meta: {
      grade: 1,
      topic: '정수와 유리수',
      topicId: 'integer-rational',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var problemTypes;
      if (difficulty === 1) {
        problemTypes = ['int-add', 'int-sub', 'int-mul', 'absolute'];
      } else if (difficulty === 2) {
        problemTypes = ['int-add', 'int-sub', 'int-mul', 'int-div', 'absolute', 'int-mixed'];
      } else {
        problemTypes = ['frac-add', 'frac-sub', 'frac-mul', 'frac-div', 'frac-mixed', 'absolute-frac'];
      }
      var problemType = utils.randChoice(problemTypes);

      switch (problemType) {
        case 'int-add': return this._intAdd(difficulty, type);
        case 'int-sub': return this._intSub(difficulty, type);
        case 'int-mul': return this._intMul(difficulty, type);
        case 'int-div': return this._intDiv(difficulty, type);
        case 'int-mixed': return this._intMixed(difficulty, type);
        case 'absolute': return this._absolute(difficulty, type);
        case 'absolute-frac': return this._absoluteFrac(difficulty, type);
        case 'frac-add': return this._fracAdd(difficulty, type);
        case 'frac-sub': return this._fracSub(difficulty, type);
        case 'frac-mul': return this._fracMul(difficulty, type);
        case 'frac-div': return this._fracDiv(difficulty, type);
        case 'frac-mixed': return this._fracMixed(difficulty, type);
        default: return this._intAdd(difficulty, type);
      }
    },

    // 정수 덧셈
    _intAdd: function(difficulty, type) {
      var a = signedInt(difficulty);
      var b = signedInt(difficulty);
      var answer = a + b;

      var aStr = a < 0 ? '(' + a + ')' : String(a);
      var bStr = b < 0 ? '(' + b + ')' : String(b);
      var latex = aStr + ' + ' + bStr;

      return this._buildResult(type, '다음을 계산하시오.', latex, answer, difficulty, true);
    },

    // 정수 뺄셈
    _intSub: function(difficulty, type) {
      var a = signedInt(difficulty);
      var b = signedInt(difficulty);
      var answer = a - b;

      var aStr = a < 0 ? '(' + a + ')' : String(a);
      var bStr = b < 0 ? '(' + b + ')' : String(b);
      var latex = aStr + ' - ' + bStr;

      return this._buildResult(type, '다음을 계산하시오.', latex, answer, difficulty, true);
    },

    // 정수 곱셈
    _intMul: function(difficulty, type) {
      var a = signedInt(difficulty);
      var b = signedInt(Math.max(1, difficulty - 1));
      var answer = a * b;

      var aStr = a < 0 ? '(' + a + ')' : String(a);
      var bStr = b < 0 ? '(' + b + ')' : String(b);
      var latex = aStr + ' \\times ' + bStr;

      return this._buildResult(type, '다음을 계산하시오.', latex, answer, difficulty, true);
    },

    // 정수 나눗셈 (나누어 떨어지는 경우)
    _intDiv: function(difficulty, type) {
      // 역생성: 몫을 먼저 정하고 나누는 수를 정해서 피제수를 구함
      var quotient = signedInt(Math.max(1, difficulty - 1));
      var divisor = utils.randIntNonZero(
        difficulty === 1 ? 2 : -9,
        difficulty === 1 ? 9 : 9
      );
      if (divisor === 0) divisor = 2;
      var dividend = quotient * divisor;

      var aStr = dividend < 0 ? '(' + dividend + ')' : String(dividend);
      var bStr = divisor < 0 ? '(' + divisor + ')' : String(divisor);
      var latex = aStr + ' \\div ' + bStr;

      return this._buildResult(type, '다음을 계산하시오.', latex, quotient, difficulty, true);
    },

    // 정수 혼합 연산
    _intMixed: function(difficulty, type) {
      var a = signedInt(difficulty);
      var b = signedInt(Math.max(1, difficulty - 1));
      var c = signedInt(Math.max(1, difficulty - 1));

      // a + b * c 또는 a * b + c
      var pattern = utils.randChoice(['addmul', 'muladd']);
      var answer, latex;

      if (pattern === 'addmul') {
        answer = a + b * c;
        var aStr = a < 0 ? '(' + a + ')' : String(a);
        var bStr = b < 0 ? '(' + b + ')' : String(b);
        var cStr = c < 0 ? '(' + c + ')' : String(c);
        latex = aStr + ' + ' + bStr + ' \\times ' + cStr;
      } else {
        answer = a * b + c;
        var aStr2 = a < 0 ? '(' + a + ')' : String(a);
        var bStr2 = b < 0 ? '(' + b + ')' : String(b);
        var cStr2 = c < 0 ? '(' + c + ')' : String(c);
        latex = aStr2 + ' \\times ' + bStr2 + ' + ' + cStr2;
      }

      return this._buildResult(type, '다음을 계산하시오.', latex, answer, difficulty, true);
    },

    // 절댓값 (정수)
    _absolute: function(difficulty, type) {
      var a = signedInt(difficulty);
      if (difficulty >= 2 && a > 0) a = -a; // 음수 위주

      var answer = Math.abs(a);
      var latex = '|' + a + '|';

      // 복합 절댓값
      if (difficulty >= 2) {
        var b = signedInt(difficulty);
        var pattern = utils.randChoice(['sum', 'diff']);
        if (pattern === 'sum') {
          answer = Math.abs(a) + Math.abs(b);
          latex = '|' + a + '| + |' + b + '|';
        } else {
          answer = Math.abs(a) - Math.abs(b);
          latex = '|' + a + '| - |' + b + '|';
        }
      }

      return this._buildResult(type, '다음을 계산하시오.', latex, answer, difficulty, true);
    },

    // 절댓값 (유리수)
    _absoluteFrac: function(difficulty, type) {
      var f = simpleFraction(difficulty);
      var absNum = Math.abs(f.num);
      var answer = fracDisplay(absNum, f.den);

      var innerLatex = fracDisplay(f.num, f.den);
      var latex = '\\left| ' + innerLatex + ' \\right|';

      var questionText = '다음의 절댓값을 구하시오.';

      if (type === 'multiple-choice') {
        var choices = [answer];

        // 오답: 부호 반대
        choices.push(fracDisplay(-absNum, f.den));
        // 오답: 분모분자 바꿈
        if (f.den !== 1 && absNum !== f.den) {
          choices.push(fracDisplay(f.den, absNum > 0 ? absNum : 1));
        }
        // 오답: 분자에 1 더함
        choices.push(fracDisplay(absNum + 1, f.den));

        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(fracDisplay(absNum + choices.length, f.den));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(answer);

        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: answer,
          answerIndex: correctIndex,
          explanation: '$' + latex + ' = ' + answer + '$'
        };
      } else {
        var simplifiedAnswer = (f.den === 1) ? String(absNum) : absNum + '/' + f.den;
        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: null,
          answer: simplifiedAnswer,
          answerIndex: null,
          explanation: '$' + latex + ' = ' + answer + '$'
        };
      }
    },

    // 분수 덧셈
    _fracAdd: function(difficulty, type) {
      var f1 = simpleFraction(difficulty);
      var f2 = simpleFraction(difficulty);

      // 답을 먼저 계산
      var ansNum = f1.num * f2.den + f2.num * f1.den;
      var ansDen = f1.den * f2.den;
      var simplified = utils.simplifyFraction(ansNum, ansDen);

      var latex = fracDisplay(f1.num, f1.den) + ' + ' + fracDisplay(f2.num, f2.den);
      var answerLatex = fracDisplay(simplified.num, simplified.den);

      return this._buildFracResult(type, '다음을 계산하시오.', latex, simplified.num, simplified.den, answerLatex, difficulty);
    },

    // 분수 뺄셈
    _fracSub: function(difficulty, type) {
      var f1 = simpleFraction(difficulty);
      var f2 = simpleFraction(difficulty);

      var ansNum = f1.num * f2.den - f2.num * f1.den;
      var ansDen = f1.den * f2.den;
      var simplified = utils.simplifyFraction(ansNum, ansDen);

      var f2Display = fracDisplay(f2.num, f2.den);
      var latex = fracDisplay(f1.num, f1.den) + ' - ';
      // 음수 분수를 뺄 때 괄호
      if (f2.num < 0) {
        latex += '\\left(' + f2Display + '\\right)';
      } else {
        latex += f2Display;
      }

      var answerLatex = fracDisplay(simplified.num, simplified.den);

      return this._buildFracResult(type, '다음을 계산하시오.', latex, simplified.num, simplified.den, answerLatex, difficulty);
    },

    // 분수 곱셈
    _fracMul: function(difficulty, type) {
      var f1 = simpleFraction(difficulty);
      var f2 = simpleFraction(difficulty);

      var ansNum = f1.num * f2.num;
      var ansDen = f1.den * f2.den;
      var simplified = utils.simplifyFraction(ansNum, ansDen);

      var latex = fracDisplay(f1.num, f1.den) + ' \\times ' + fracDisplay(f2.num, f2.den);
      var answerLatex = fracDisplay(simplified.num, simplified.den);

      return this._buildFracResult(type, '다음을 계산하시오.', latex, simplified.num, simplified.den, answerLatex, difficulty);
    },

    // 분수 나눗셈
    _fracDiv: function(difficulty, type) {
      // 역생성: 깔끔한 답이 나오도록
      var f2 = simpleFraction(difficulty);
      var _safe = 0;
      while (f2.num === 0 && _safe++ < 20) f2 = simpleFraction(difficulty);

      var simplified = simpleFraction(difficulty);
      var _safe2 = 0;
      while (simplified.num === 0 && _safe2++ < 20) simplified = simpleFraction(difficulty);

      // f1 = answer * f2
      var f1Num = simplified.num * f2.num;
      var f1Den = simplified.den * f2.den;
      var f1 = utils.simplifyFraction(f1Num, f1Den);

      var latex = fracDisplay(f1.num, f1.den) + ' \\div ' + fracDisplay(f2.num, f2.den);
      var answerLatex = fracDisplay(simplified.num, simplified.den);

      return this._buildFracResult(type, '다음을 계산하시오.', latex, simplified.num, simplified.den, answerLatex, difficulty);
    },

    // 분수 혼합 연산
    _fracMixed: function(difficulty, type) {
      var f1 = simpleFraction(difficulty);
      var f2 = simpleFraction(difficulty);
      var _safe = 0;
      while (f2.num === 0 && _safe++ < 20) f2 = simpleFraction(difficulty);

      var a = signedInt(1); // 정수
      // a + f1/f2 형태
      var fracNum = f1.num * f2.den + f2.num * f1.den;
      var fracDen = f1.den * f2.den;
      var totalNum = a * fracDen + fracNum;
      var simplified = utils.simplifyFraction(totalNum, fracDen);

      var aStr = a < 0 ? '(' + a + ')' : String(a);
      var latex = aStr + ' + ' + fracDisplay(f1.num, f1.den) + ' + ' + fracDisplay(f2.num, f2.den);
      var answerLatex = fracDisplay(simplified.num, simplified.den);

      return this._buildFracResult(type, '다음을 계산하시오.', latex, simplified.num, simplified.den, answerLatex, difficulty);
    },

    // 정수 결과를 조립하는 헬퍼
    _buildResult: function(type, questionText, latex, answer, difficulty, isInteger) {
      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(answer, 3, function() {
          var offsets = [-3, -2, -1, 1, 2, 3];
          if (difficulty >= 2) offsets = offsets.concat([-5, 5, -10, 10]);
          var offset = utils.randChoice(offsets);
          return answer + offset;
        });

        var choices = [String(answer)].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(answer + choices.length + 3));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(answer));

        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: String(answer),
          answerIndex: correctIndex,
          explanation: '$' + latex + ' = ' + answer + '$'
        };
      } else {
        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: null,
          answer: String(answer),
          answerIndex: null,
          explanation: '$' + latex + ' = ' + answer + '$'
        };
      }
    },

    // 분수 결과를 조립하는 헬퍼
    _buildFracResult: function(type, questionText, latex, ansNum, ansDen, answerLatex, difficulty) {
      if (type === 'multiple-choice') {
        var choices = [answerLatex];

        // 오답: 부호 반대
        choices.push(fracDisplay(-ansNum, ansDen));
        // 오답: 약분 안 함 (또는 다른 분수)
        choices.push(fracDisplay(ansNum + 1, ansDen));
        // 오답: 분모 다름
        choices.push(fracDisplay(ansNum, ansDen + 1 > 0 ? ansDen + 1 : 2));

        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(fracDisplay(ansNum + choices.length, ansDen));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(answerLatex);

        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: answerLatex,
          answerIndex: correctIndex,
          explanation: '$' + latex + ' = ' + answerLatex + '$'
        };
      } else {
        var plainAnswer = (ansDen === 1) ? String(ansNum) : ansNum + '/' + ansDen;
        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: null,
          choices: null,
          answer: plainAnswer,
          answerIndex: null,
          explanation: '$' + latex + ' = ' + answerLatex + '$'
        };
      }
    }
  };
})();
