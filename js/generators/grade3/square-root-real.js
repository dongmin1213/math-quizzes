// 중3 - 제곱근과 실수
(function() {
  var utils = MathQuiz.utils;
  var svg = MathQuiz.svg;

  MathQuiz.generators['grade3-square-root-real'] = {
    meta: {
      grade: 3,
      topic: '제곱근과 실수',
      topicId: 'square-root-real',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      // 난이도별 하위 유형 선택
      var subTypes;
      if (difficulty === 1) {
        subTypes = ['perfect-square', 'square-root-value', 'compare-roots'];
      } else if (difficulty === 2) {
        subTypes = ['simplify-root', 'root-arithmetic', 'rationalize'];
      } else {
        subTypes = ['root-operations', 'double-radical', 'mixed-expression'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;
      var svgDiagram = null;

      switch (subType) {

        // ===== 난이도 1 =====
        case 'perfect-square': {
          // 완전제곱수의 제곱근 구하기
          var n = utils.randInt(2, 15);
          var sq = n * n;
          var sign = utils.randChoice(['+', '-']);
          if (sign === '+') {
            questionText = '$\\sqrt{' + sq + '}$ 의 값을 구하시오.';
            questionLatex = '\\sqrt{' + sq + '}';
            answer = String(n);
            explanation = '$\\sqrt{' + sq + '} = ' + n + '$ 입니다. $' + n + '^2 = ' + sq + '$ 이므로 $\\sqrt{' + sq + '} = ' + n + '$ 입니다.';
          } else {
            questionText = '$-\\sqrt{' + sq + '}$ 의 값을 구하시오.';
            questionLatex = '-\\sqrt{' + sq + '}';
            answer = String(-n);
            explanation = '$-\\sqrt{' + sq + '} = -' + n + '$ 입니다. $\\sqrt{' + sq + '} = ' + n + '$ 이므로 앞에 음의 부호를 붙이면 $-' + n + '$ 입니다.';
          }

          if (type === 'multiple-choice') {
            var correct = parseInt(answer);
            var distractors = utils.generateDistractors(correct, 3, function() {
              var offsets = [-n - 1, -1, 1, n + 1, sq, -sq];
              var off = utils.randChoice(offsets);
              return correct + off;
            });
            choices = [answer].concat(distractors.map(String));
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'square-root-value': {
          // a의 제곱근 구하기 (양의 제곱근, 음의 제곱근, 제곱근)
          var base = utils.randInt(2, 12);
          var squared = base * base;
          var askType = utils.randChoice(['positive', 'negative', 'both']);

          if (askType === 'positive') {
            questionText = '$' + squared + '$ 의 양의 제곱근을 구하시오.';
            answer = String(base);
            explanation = '$' + squared + '$ 의 양의 제곱근은 $' + base + '$ 입니다. $' + base + '^2 = ' + squared + '$ 이기 때문입니다.';
          } else if (askType === 'negative') {
            questionText = '$' + squared + '$ 의 음의 제곱근을 구하시오.';
            answer = String(-base);
            explanation = '$' + squared + '$ 의 음의 제곱근은 $-' + base + '$ 입니다. $(-' + base + ')^2 = ' + squared + '$ 이기 때문입니다.';
          } else {
            questionText = '$' + squared + '$ 의 제곱근을 모두 구하시오.';
            answer = '\\pm ' + base;
            explanation = '$' + squared + '$ 의 제곱근은 $\\pm ' + base + '$ 입니다. $(\\pm ' + base + ')^2 = ' + squared + '$ 이기 때문입니다.';
          }
          questionLatex = null;

          if (type === 'multiple-choice') {
            if (askType === 'both') {
              choices = ['$\\pm ' + base + '$', '$' + base + '$', '$-' + base + '$', '$\\pm ' + (base + 1) + '$'];
            } else {
              var corr = parseInt(answer);
              choices = [answer, String(-corr), String(corr + utils.randChoice([-2, -1, 1, 2])), String(squared)];
              choices = choices.map(function(c) { return '$' + c + '$'; });
            }
            choices = utils.shuffle(choices);
            var ansStr = askType === 'both' ? '$\\pm ' + base + '$' : '$' + answer + '$';
            answerIndex = choices.indexOf(ansStr);
            answer = ansStr;
          }
          break;
        }

        case 'compare-roots': {
          // 제곱근의 대소 비교
          var primes = [2, 3, 5, 7, 11, 13];
          var a = utils.randChoice(primes);
          var b;
          var _safe = 0;
          do { b = utils.randChoice(primes); } while (b === a && _safe++ < 20);
          if (a > b) { var tmp = a; a = b; b = tmp; }

          questionText = '$\\sqrt{' + a + '}$ 와 $\\sqrt{' + b + '}$ 의 대소 관계를 나타내시오.';
          questionLatex = '\\sqrt{' + a + '} \\;\\square\\; \\sqrt{' + b + '}';
          answer = '$\\sqrt{' + a + '} < \\sqrt{' + b + '}$';
          explanation = '$' + a + ' < ' + b + '$ 이므로 $\\sqrt{' + a + '} < \\sqrt{' + b + '}$ 입니다. 양수에서 제곱근 함수는 증가함수이기 때문입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$\\sqrt{' + a + '} < \\sqrt{' + b + '}$',
              '$\\sqrt{' + a + '} > \\sqrt{' + b + '}$',
              '$\\sqrt{' + a + '} = \\sqrt{' + b + '}$',
              '$\\sqrt{' + a + '} \\geq \\sqrt{' + b + '}$'
            ];
            answerIndex = 0;
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'simplify-root': {
          // 근호 간단히 하기: √(a²b) = a√b
          var outer = utils.randInt(2, 7);
          var innerChoices = [2, 3, 5, 6, 7].filter(function(x) { return x !== outer; });
          var inner = utils.randChoice(innerChoices);
          var radicand = outer * outer * inner;

          questionText = '$\\sqrt{' + radicand + '}$ 을 간단히 하시오.';
          questionLatex = '\\sqrt{' + radicand + '}';
          answer = '$' + outer + '\\sqrt{' + inner + '}$';
          explanation = '$\\sqrt{' + radicand + '} = \\sqrt{' + outer + '^2 \\times ' + inner + '} = ' + outer + '\\sqrt{' + inner + '}$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + outer + '\\sqrt{' + inner + '}$',
              '$' + inner + '\\sqrt{' + outer + '}$',
              '$' + (outer + 1) + '\\sqrt{' + inner + '}$',
              '$' + outer + '\\sqrt{' + (inner + 1) + '}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'root-arithmetic': {
          // 같은 근호끼리 덧셈/뺄셈: a√n ± b√n
          var rad = utils.randChoice([2, 3, 5, 6, 7]);
          var coeff1 = utils.randInt(1, 6);
          var coeff2 = utils.randInt(1, 6);
          var op = utils.randChoice(['+', '-']);
          var resultCoeff = op === '+' ? coeff1 + coeff2 : coeff1 - coeff2;

          // 음수 계수 방지
          if (resultCoeff <= 0) {
            coeff2 = utils.randInt(1, coeff1 - 1 > 0 ? coeff1 - 1 : 1);
            resultCoeff = coeff1 - coeff2;
            if (resultCoeff <= 0) { op = '+'; resultCoeff = coeff1 + coeff2; }
          }

          var c1Str = coeff1 === 1 ? '' : String(coeff1);
          var c2Str = coeff2 === 1 ? '' : String(coeff2);
          var rStr = resultCoeff === 1 ? '' : String(resultCoeff);

          questionText = '$' + c1Str + '\\sqrt{' + rad + '} ' + op + ' ' + c2Str + '\\sqrt{' + rad + '}$ 을 계산하시오.';
          questionLatex = c1Str + '\\sqrt{' + rad + '} ' + op + ' ' + c2Str + '\\sqrt{' + rad + '}';
          answer = '$' + rStr + '\\sqrt{' + rad + '}$';
          explanation = '같은 근호끼리 계수를 ' + (op === '+' ? '더' : '빼') + '면 $' + coeff1 + ' ' + op + ' ' + coeff2 + ' = ' + resultCoeff + '$ 이므로 $' + rStr + '\\sqrt{' + rad + '}$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + rStr + '\\sqrt{' + rad + '}$',
              '$' + (resultCoeff + 1 === 1 ? '' : String(resultCoeff + 1)) + '\\sqrt{' + rad + '}$',
              '$' + (resultCoeff > 1 ? (resultCoeff - 1 === 1 ? '' : String(resultCoeff - 1)) : '2') + '\\sqrt{' + rad + '}$',
              '$' + rStr + '\\sqrt{' + (rad * 2) + '}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'rationalize': {
          // 분모의 유리화: a/√b = a√b/b
          var num = utils.randInt(1, 6);
          var den = utils.randChoice([2, 3, 5, 6, 7]);
          var g = utils.gcd(num, den);
          var simpNum = num / g;
          var simpDen = den / g;

          questionText = '$\\dfrac{' + num + '}{\\sqrt{' + den + '}}$ 의 분모를 유리화하시오.';
          questionLatex = '\\dfrac{' + num + '}{\\sqrt{' + den + '}}';

          var ansLatex;
          if (simpDen === 1) {
            ansLatex = simpNum + '\\sqrt{' + den + '}';
          } else {
            ansLatex = '\\dfrac{' + simpNum + '\\sqrt{' + den + '}}{' + simpDen + '}';
          }
          answer = '$' + ansLatex + '$';
          explanation = '$\\dfrac{' + num + '}{\\sqrt{' + den + '}} = \\dfrac{' + num + ' \\times \\sqrt{' + den + '}}{\\sqrt{' + den + '} \\times \\sqrt{' + den + '}} = \\dfrac{' + num + '\\sqrt{' + den + '}}{' + den + '}';
          if (g > 1) {
            explanation += ' = ' + ansLatex;
          }
          explanation += '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              answer,
              '$\\dfrac{' + num + '\\sqrt{' + den + '}}{' + (den + 1) + '}$',
              '$\\dfrac{' + (num + 1) + '\\sqrt{' + den + '}}{' + den + '}$',
              '$\\dfrac{\\sqrt{' + den + '}}{' + den + '}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'root-operations': {
          // 복합 연산: a√b × c√d 또는 (a√b)²
          var opType = utils.randChoice(['multiply', 'square']);

          if (opType === 'multiply') {
            var a1 = utils.randInt(2, 5);
            var r1 = utils.randChoice([2, 3, 5]);
            var a2 = utils.randInt(2, 5);
            var r2 = r1; // 같은 근호
            var product = a1 * a2 * r1;

            questionText = '$' + a1 + '\\sqrt{' + r1 + '} \\times ' + a2 + '\\sqrt{' + r2 + '}$ 을 계산하시오.';
            questionLatex = a1 + '\\sqrt{' + r1 + '} \\times ' + a2 + '\\sqrt{' + r2 + '}';
            answer = '$' + product + '$';
            explanation = '$' + a1 + '\\sqrt{' + r1 + '} \\times ' + a2 + '\\sqrt{' + r2 + '} = ' + (a1 * a2) + ' \\times (\\sqrt{' + r1 + '})^2 = ' + (a1 * a2) + ' \\times ' + r1 + ' = ' + product + '$ 입니다.';

            if (type === 'multiple-choice') {
              choices = [String(product), String(a1 * a2), String(product + r1), String(product - a1)];
              choices = choices.map(function(c) { return '$' + c + '$'; });
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          } else {
            var a = utils.randInt(2, 6);
            var r = utils.randChoice([2, 3, 5, 7]);
            var result = a * a * r;

            questionText = '$(\\,' + a + '\\sqrt{' + r + '}\\,)^2$ 을 계산하시오.';
            questionLatex = '(' + a + '\\sqrt{' + r + '})^2';
            answer = '$' + result + '$';
            explanation = '$(' + a + '\\sqrt{' + r + '})^2 = ' + a + '^2 \\times (\\sqrt{' + r + '})^2 = ' + (a * a) + ' \\times ' + r + ' = ' + result + '$ 입니다.';

            if (type === 'multiple-choice') {
              choices = [String(result), String(a * a), String(a * r), String(2 * a * r)];
              choices = choices.map(function(c) { return '$' + c + '$'; });
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          }
          break;
        }

        case 'double-radical': {
          // 이중근호: √(a ± 2√b) 정리
          // √(a+2√b) = √c + √d where c+d=a, cd=b
          var c = utils.randInt(1, 5);
          var d = utils.randInt(c + 1, 8);
          var aVal = c + d;
          var bVal = c * d;

          questionText = '$\\sqrt{' + aVal + '+2\\sqrt{' + bVal + '}}$ 을 간단히 하시오.';
          questionLatex = '\\sqrt{' + aVal + '+2\\sqrt{' + bVal + '}}';
          answer = '$\\sqrt{' + c + '}+\\sqrt{' + d + '}$';
          explanation = '$' + aVal + '+2\\sqrt{' + bVal + '} = (\\sqrt{' + c + '})^2 + 2\\sqrt{' + c + '}\\cdot\\sqrt{' + d + '} + (\\sqrt{' + d + '})^2 = (\\sqrt{' + c + '}+\\sqrt{' + d + '})^2$ 이므로 답은 $\\sqrt{' + c + '}+\\sqrt{' + d + '}$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$\\sqrt{' + c + '}+\\sqrt{' + d + '}$',
              '$\\sqrt{' + d + '}-\\sqrt{' + c + '}$',
              '$\\sqrt{' + aVal + '}+\\sqrt{' + bVal + '}$',
              '$\\sqrt{' + (c + 1) + '}+\\sqrt{' + (d - 1) + '}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'mixed-expression': {
          // 복합식: (a+√b)(a-√b) = a²-b
          var a = utils.randInt(2, 7);
          var b = utils.randChoice([2, 3, 5, 7]);
          var result = a * a - b;

          questionText = '$(' + a + '+\\sqrt{' + b + '})(' + a + '-\\sqrt{' + b + '})$ 을 계산하시오.';
          questionLatex = '(' + a + '+\\sqrt{' + b + '})(' + a + '-\\sqrt{' + b + '})';
          answer = '$' + result + '$';
          explanation = '합차 공식에 의해 $(' + a + '+\\sqrt{' + b + '})(' + a + '-\\sqrt{' + b + '}) = ' + a + '^2 - (\\sqrt{' + b + '})^2 = ' + (a * a) + ' - ' + b + ' = ' + result + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [String(result), String(a * a + b), String(a * a), String(2 * a)];
            choices = choices.map(function(c) { return '$' + c + '$'; });
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }
      }

      // short-answer 보정
      if (type === 'short-answer') {
        choices = null;
        answerIndex = null;
      }

      // 객관식 보기 중복 제거
      if (type === 'multiple-choice' && choices) {
        var dedup = utils.ensureUniqueChoices(answer, choices, function(i) {
          return '$' + utils.randInt(1, 50) + '$';
        });
        choices = dedup.choices;
        answerIndex = dedup.answerIndex;
      }

      return {
        type: type,
        questionText: questionText,
        questionLatex: questionLatex || null,
        svg: svgDiagram,
        choices: choices || null,
        answer: answer,
        answerIndex: answerIndex != null ? answerIndex : null,
        explanation: explanation
      };
    }
  };
})();
