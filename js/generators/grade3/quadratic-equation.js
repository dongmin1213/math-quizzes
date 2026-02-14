// 중3 - 이차방정식
(function() {
  var utils = MathQuiz.utils;

  MathQuiz.generators['grade3-quadratic-equation'] = {
    meta: {
      grade: 3,
      topic: '이차방정식',
      topicId: 'quadratic-equation',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['positive-roots', 'one-zero-root', 'perfect-square-eq'];
      } else if (difficulty === 2) {
        subTypes = ['negative-roots', 'repeated-root', 'discriminant'];
      } else {
        subTypes = ['leading-coeff', 'quadratic-formula', 'word-problem'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;

      // 이차방정식을 LaTeX 문자열로 변환하는 헬퍼
      function eqToLatex(a, b, c) {
        var s = utils.coeffStr(a, 'x^2', true);
        s += utils.coeffStr(b, 'x', false);
        s += utils.constStr(c, false);
        return s + '=0';
      }

      switch (subType) {

        // ===== 난이도 1 =====
        case 'positive-roots': {
          // (x-r1)(x-r2) = 0, r1, r2 > 0
          var r1 = utils.randInt(1, 9);
          var r2 = utils.randInt(1, 9);
          var _safe = 0;
          while (r2 === r1 && _safe++ < 20) { r2 = utils.randInt(1, 9); }
          if (r1 > r2) { var tmp = r1; r1 = r2; r2 = tmp; }

          var b = -(r1 + r2);
          var c = r1 * r2;

          questionLatex = eqToLatex(1, b, c);
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';

          answer = '$x=' + r1 + '$ 또는 $x=' + r2 + '$';
          explanation = '$' + questionLatex.replace('=0', '') + ' = (x-' + r1 + ')(x-' + r2 + ') = 0$ 이므로 $x=' + r1 + '$ 또는 $x=' + r2 + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + r1 + '$ 또는 $x=' + r2 + '$',
              '$x=-' + r1 + '$ 또는 $x=-' + r2 + '$',
              '$x=' + r1 + '$ 또는 $x=-' + r2 + '$',
              '$x=' + (r1 + 1) + '$ 또는 $x=' + (r2 - 1) + '$'
            ];
            answer = choices[0];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'one-zero-root': {
          // x(x-a) = 0 형태
          var a = utils.randIntNonZero(-8, 8);
          var bCoeff = -a;

          questionLatex = 'x^2' + utils.coeffStr(bCoeff, 'x', false) + '=0';
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';

          var roots = [0, a].sort(function(x, y) { return x - y; });
          answer = '$x=' + roots[0] + '$ 또는 $x=' + roots[1] + '$';
          explanation = '$x^2' + utils.coeffStr(bCoeff, 'x', false) + ' = x(x' + utils.constStr(bCoeff, false) + ') = 0$ 이므로 $x=0$ 또는 $x=' + a + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + roots[0] + '$ 또는 $x=' + roots[1] + '$',
              '$x=' + (-a) + '$',
              '$x=0$ 또는 $x=' + (-a) + '$',
              '$x=' + a + '$'
            ];
            answer = choices[0];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'perfect-square-eq': {
          // x² = a² 형태 (a > 0)
          var a = utils.randInt(2, 12);
          var sq = a * a;

          questionLatex = 'x^2=' + sq;
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';
          answer = '$x=\\pm ' + a + '$';
          explanation = '$x^2=' + sq + '$ 에서 $x = \\pm\\sqrt{' + sq + '} = \\pm ' + a + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=\\pm ' + a + '$',
              '$x=' + a + '$',
              '$x=-' + a + '$',
              '$x=\\pm ' + sq + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'negative-roots': {
          // 음수 근 포함: (x-r1)(x-r2) = 0
          var r1 = utils.randInt(-8, -1);
          var r2 = utils.randIntNonZero(-5, 8);
          var _safe = 0;
          while (r2 === r1 && _safe++ < 20) { r2 = utils.randIntNonZero(-5, 8); }
          if (r1 > r2) { var tmp = r1; r1 = r2; r2 = tmp; }

          var b = -(r1 + r2);
          var c = r1 * r2;

          questionLatex = eqToLatex(1, b, c);
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';

          answer = '$x=' + r1 + '$ 또는 $x=' + r2 + '$';
          var factorStr = '(x' + (r1 > 0 ? '-' + r1 : '+' + (-r1)) + ')(x' + (r2 > 0 ? '-' + r2 : '+' + (-r2)) + ')';
          explanation = '$' + questionLatex.replace('=0', '') + ' = ' + factorStr + ' = 0$ 이므로 $x=' + r1 + '$ 또는 $x=' + r2 + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + r1 + '$ 또는 $x=' + r2 + '$',
              '$x=' + (-r1) + '$ 또는 $x=' + (-r2) + '$',
              '$x=' + r1 + '$ 또는 $x=' + (-r2) + '$',
              '$x=' + (r1 - 1) + '$ 또는 $x=' + (r2 + 1) + '$'
            ];
            answer = choices[0];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'repeated-root': {
          // 중근: (x-a)² = 0
          var a = utils.randIntNonZero(-7, 7);
          var b = -2 * a;
          var c = a * a;

          questionLatex = eqToLatex(1, b, c);
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';
          answer = '$x=' + a + '$ (중근)';
          var signA = a > 0 ? '-' + a : '+' + (-a);
          explanation = '$' + questionLatex.replace('=0', '') + ' = (x' + signA + ')^2 = 0$ 이므로 $x=' + a + '$ (중근)입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + a + '$ (중근)',
              '$x=' + (-a) + '$ (중근)',
              '$x=' + a + '$ 또는 $x=' + (-a) + '$',
              '$x=' + (a + 1) + '$ 또는 $x=' + (a - 1) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'discriminant': {
          // 판별식으로 근의 개수 판단
          var a = utils.randChoice([1, 2]);
          var b = utils.randInt(-6, 6);
          var targetD = utils.randChoice(['positive', 'zero', 'negative']);

          var c;
          if (targetD === 'positive') {
            // b²-4ac > 0 => c < b²/(4a)
            var maxC = Math.floor(b * b / (4 * a)) - 1;
            c = utils.randInt(Math.min(-5, maxC), maxC);
          } else if (targetD === 'zero') {
            // b²-4ac = 0 => c = b²/(4a)
            // 정수여야 하므로 b 조정
            b = 2 * a * utils.randIntNonZero(-4, 4);
            c = (b * b) / (4 * a);
          } else {
            // b²-4ac < 0 => c > b²/(4a)
            var minC = Math.ceil(b * b / (4 * a)) + 1;
            c = utils.randInt(minC, minC + 5);
          }

          var disc = b * b - 4 * a * c;
          var eq = eqToLatex(a, b, c);
          questionText = '이차방정식 $' + eq + '$ 의 근의 개수를 구하시오.';
          questionLatex = eq;

          var rootCount = disc > 0 ? '서로 다른 두 근' : (disc === 0 ? '중근 (한 근)' : '근이 없다');
          answer = rootCount;
          explanation = '판별식 $D = b^2 - 4ac = ' + (b) + '^2 - 4 \\cdot ' + a + ' \\cdot ' + (c >= 0 ? c : '(' + c + ')') + ' = ' + disc;
          if (disc > 0) {
            explanation += ' > 0$ 이므로 서로 다른 두 근을 가집니다.';
          } else if (disc === 0) {
            explanation += ' = 0$ 이므로 중근을 가집니다.';
          } else {
            explanation += ' < 0$ 이므로 근이 없습니다.';
          }

          if (type === 'multiple-choice') {
            choices = ['서로 다른 두 근', '중근 (한 근)', '근이 없다', '세 근'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'leading-coeff': {
          // 최고차 계수가 1이 아닌 경우: a(x-r1)(x-r2) = 0
          var a = utils.randChoice([2, 3]);
          var r1 = utils.randIntNonZero(-5, 5);
          var r2 = utils.randIntNonZero(-5, 5);
          var _safe = 0;
          while (r2 === r1 && _safe++ < 20) { r2 = utils.randIntNonZero(-5, 5); }
          if (r1 > r2) { var tmp = r1; r1 = r2; r2 = tmp; }

          var bCoeff = -a * (r1 + r2);
          var cCoeff = a * r1 * r2;

          questionLatex = eqToLatex(a, bCoeff, cCoeff);
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 구하시오.';

          answer = '$x=' + r1 + '$ 또는 $x=' + r2 + '$';
          explanation = '$' + questionLatex.replace('=0', '') + '$ 을 $' + a + '$ 으로 나누면 $' + eqToLatex(1, -(r1 + r2), r1 * r2).replace('=0', '') + ' = 0$ 이고, 인수분해하면 $(x' + (r1 > 0 ? '-' + r1 : '+' + (-r1)) + ')(x' + (r2 > 0 ? '-' + r2 : '+' + (-r2)) + ') = 0$ 이므로 $x=' + r1 + '$ 또는 $x=' + r2 + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + r1 + '$ 또는 $x=' + r2 + '$',
              '$x=' + (-r1) + '$ 또는 $x=' + (-r2) + '$',
              '$x=' + (a * r1) + '$ 또는 $x=' + (a * r2) + '$',
              '$x=' + r1 + '$ 또는 $x=' + (-r2) + '$'
            ];
            answer = choices[0];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'quadratic-formula': {
          // 근의 공식 사용: 무리수 근
          // ax²+bx+c=0에서 근이 (-b±√D)/(2a) 형태로 깔끔하게 나오도록
          var a = 1;
          var b = utils.randChoice([-6, -4, -2, 2, 4, 6]);
          // D = b²-4c가 제곱수가 아닌 양수가 되도록
          var sqPart = utils.randChoice([2, 3, 5, 7]);
          // D = b²-4c, 4c = b²-sqPart => c = (b²-sqPart)/4
          // b가 짝수이므로 b²은 4의 배수. sqPart가 4의 배수가 아니면 c가 정수가 안됨
          // D를 b²-4c 로 놓고 D=k²*sqPart가 되도록
          var k = utils.randChoice([1, 2]);
          var D = k * k * sqPart;
          var c = (b * b - D) / (4 * a);

          // c가 정수가 아니면 재조정
          if (c !== Math.floor(c)) {
            // k=1로 고정하여 D=sqPart
            k = 1;
            D = sqPart;
            b = 2 * utils.randIntNonZero(-4, 4);
            c = (b * b - D) / 4;
            if (c !== Math.floor(c)) {
              // 안전한 기본값: x²-2x-1=0 (D=8=2²·2, 근: 1±√2)
              b = -2; c = -1; sqPart = 2; k = 1; D = 2;
            }
          }

          questionLatex = eqToLatex(a, b, c);
          questionText = '이차방정식 $' + questionLatex + '$ 의 해를 근의 공식을 이용하여 구하시오.';

          var halfB = -b / 2;
          var kStr = k === 1 ? '' : String(k);
          var ansLatex;
          if (halfB === 0) {
            ansLatex = 'x = \\pm ' + kStr + '\\sqrt{' + sqPart + '}';
          } else {
            ansLatex = 'x = ' + halfB + ' \\pm ' + kStr + '\\sqrt{' + sqPart + '}';
          }

          answer = '$' + ansLatex + '$';
          explanation = '근의 공식 $x = \\dfrac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ 에서 $a=' + a + '$, $b=' + b + '$, $c=' + c + '$ 을 대입하면 $x = \\dfrac{' + (-b) + ' \\pm \\sqrt{' + D + '}}{2} = ' + ansLatex + '$ 입니다.';

          if (type === 'multiple-choice') {
            var wrong1 = '$x = ' + (-halfB) + ' \\pm ' + kStr + '\\sqrt{' + sqPart + '}$';
            var wrong2 = '$x = ' + halfB + ' \\pm ' + (k + 1 === 2 ? '2' : String(k + 1)) + '\\sqrt{' + sqPart + '}$';
            var wrong3 = '$x = ' + halfB + ' \\pm \\sqrt{' + (sqPart + 2) + '}$';
            choices = [answer, wrong1, wrong2, wrong3];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'word-problem': {
          // 응용 문제: 연속하는 두 자연수의 곱
          var n = utils.randInt(3, 12);
          var product = n * (n + 1);

          questionText = '연속하는 두 자연수의 곱이 $' + product + '$ 일 때, 두 자연수를 구하시오.';
          questionLatex = 'n(n+1)=' + product;
          answer = '$' + n + '$, $' + (n + 1) + '$';
          explanation = '$n(n+1) = ' + product + '$ 에서 $n^2 + n - ' + product + ' = 0$ 을 풀면 $(n-' + n + ')(n+' + (n + 1) + ')=0$ 이므로 $n=' + n + '$ (자연수 조건). 따라서 두 수는 $' + n + '$과 $' + (n + 1) + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + n + '$, $' + (n + 1) + '$',
              '$' + (n - 1) + '$, $' + n + '$',
              '$' + (n + 1) + '$, $' + (n + 2) + '$',
              '$' + (n - 1) + '$, $' + (n + 1) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }
      }

      if (type === 'short-answer') {
        choices = null;
        answerIndex = null;
      }

      // 객관식 보기 중복 제거
      if (type === 'multiple-choice' && choices) {
        var dedup = utils.ensureUniqueChoices(answer, choices, function(i) {
          var v = utils.randIntNonZero(-10, 10);
          return '$x=' + v + '$ 또는 $x=' + (v + utils.randInt(1, 5)) + '$';
        });
        choices = dedup.choices;
        answerIndex = dedup.answerIndex;
      }

      return {
        type: type,
        questionText: questionText,
        questionLatex: questionLatex || null,
        svg: null,
        choices: choices || null,
        answer: answer,
        answerIndex: answerIndex != null ? answerIndex : null,
        explanation: explanation
      };
    }
  };
})();
