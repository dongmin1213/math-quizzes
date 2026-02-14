// 중3 - 인수분해
(function() {
  var utils = MathQuiz.utils;

  MathQuiz.generators['grade3-factoring'] = {
    meta: {
      grade: 3,
      topic: '인수분해',
      topicId: 'factoring',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['common-factor', 'perfect-square-simple', 'two-term-common'];
      } else if (difficulty === 2) {
        subTypes = ['difference-of-squares', 'perfect-square-trinomial', 'simple-trinomial'];
      } else {
        subTypes = ['general-trinomial', 'general-trinomial-hard', 'grouped'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;

      switch (subType) {

        // ===== 난이도 1 =====
        case 'common-factor': {
          // 공통인수: ax + ay = a(x+y), ax² + bx = x(ax+b)
          var cf = utils.randInt(2, 7);
          var t1 = utils.randIntNonZero(-6, 6);
          var t2 = utils.randIntNonZero(-6, 6);
          var _safe = 0;
          while (t1 === t2 && _safe++ < 20) { t2 = utils.randIntNonZero(-6, 6); }

          // cf*x(t1*x + t2) => cf*t1*x² + cf*t2*x
          var a = cf * t1;
          var b = cf * t2;

          var expanded = utils.coeffStr(a, 'x^2', true) + utils.coeffStr(b, 'x', false);
          var innerExpr = utils.coeffStr(t1, 'x', true) + utils.constStr(t2, false);
          var factored = cf + 'x(' + innerExpr + ')';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '공통인수 $' + cf + 'x$를 묶어내면 $' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            var wrong1 = cf + '(' + utils.coeffStr(t1, 'x^2', true) + utils.constStr(t2, false) + ')';
            var wrong2 = 'x(' + utils.coeffStr(a, 'x', true) + utils.constStr(b, false) + ')';
            var wrong3 = cf + 'x(' + utils.coeffStr(t1, 'x', true) + utils.constStr(t2 + 1, false) + ')';
            choices = ['$' + factored + '$', '$' + wrong1 + '$', '$' + wrong2 + '$', '$' + wrong3 + '$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'perfect-square-simple': {
          // 완전제곱식 (쉬움): (x+a)² = x²+2ax+a²
          var a = utils.randIntNonZero(-7, 7);
          var c2 = 2 * a;
          var c0 = a * a;

          var expanded = 'x^2' + utils.coeffStr(c2, 'x', false) + utils.constStr(c0, false);
          var sign = a > 0 ? '+' : '-';
          var absA = Math.abs(a);
          var factored = '(x' + sign + absA + ')^2';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '$' + expanded + ' = (x' + sign + absA + ')^2$ 입니다. $x^2 + 2 \\cdot x \\cdot ' + (a > 0 ? absA : '(-' + absA + ')') + ' + ' + absA + '^2$ 형태이므로 완전제곱식입니다.';

          if (type === 'multiple-choice') {
            var oppSign = a > 0 ? '-' : '+';
            choices = [
              '$' + factored + '$',
              '$(x' + oppSign + absA + ')^2$',
              '$(x' + sign + (absA + 1) + ')^2$',
              '$(x' + sign + absA + ')(x' + oppSign + absA + ')$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'two-term-common': {
          // 두 항의 공통인수 (계수 있는): a²x + ab = a(ax + b)
          var cf = utils.randInt(2, 6);
          var v1 = utils.randIntNonZero(-5, 5);
          var v2 = utils.randIntNonZero(-5, 5);
          var _safe = 0;
          while (v1 === v2 && _safe++ < 20) { v2 = utils.randIntNonZero(-5, 5); }

          // cf(v1x + v2) = cf*v1*x + cf*v2
          var termA = cf * v1;
          var termB = cf * v2;

          var expandedLatex = utils.coeffStr(termA, 'x', true) + utils.constStr(termB, false);
          var innerLatex = utils.coeffStr(v1, 'x', true) + utils.constStr(v2, false);
          var factoredLatex = cf + '(' + innerLatex + ')';

          questionText = '$' + expandedLatex + '$ 을 인수분해하시오.';
          questionLatex = expandedLatex;
          answer = '$' + factoredLatex + '$';
          explanation = '공통인수 $' + cf + '$으로 묶으면 $' + factoredLatex + '$';

          if (type === 'multiple-choice') {
            choices = [
              '$' + factoredLatex + '$',
              '$' + v1 + '(' + utils.coeffStr(cf, 'x', true) + utils.constStr(v2, false) + ')$',
              '$' + cf + '(' + utils.coeffStr(v1, 'x', true) + utils.constStr(-v2, false) + ')$',
              '$' + (cf + 1) + '(' + utils.coeffStr(v1, 'x', true) + utils.constStr(v2, false) + ')$'
            ];
            choices = utils.unique(choices);
            var _safe = 0;
            while (choices.length < 4 && _safe++ < 20) {
              choices.push('$' + (cf - 1) + '(' + utils.coeffStr(v1 + _safe, 'x', true) + utils.constStr(v2, false) + ')$');
              choices = utils.unique(choices);
            }
            choices = choices.slice(0, 4);
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'simple-trinomial': {
          // 간단한 이차식: x² + bx + c = (x+p)(x+q) (p+q=b, pq=c)
          var p = utils.randIntNonZero(-6, 6);
          var q = utils.randIntNonZero(-6, 6);
          var _safe = 0;
          while ((p === q || p + q === 0) && _safe++ < 20) { q = utils.randIntNonZero(-6, 6); }

          var bCoeff = p + q;
          var cConst = p * q;

          var expandedLatex = 'x^2' + utils.coeffStr(bCoeff, 'x', false) + utils.constStr(cConst, false);
          var pSign = p > 0 ? '+' : '';
          var qSign = q > 0 ? '+' : '';
          var factoredLatex = '(x' + pSign + p + ')(x' + qSign + q + ')';

          questionText = '$' + expandedLatex + '$ 을 인수분해하시오.';
          questionLatex = expandedLatex;
          answer = '$' + factoredLatex + '$';
          explanation = '합이 $' + bCoeff + '$이고 곱이 $' + cConst + '$인 두 수: $' + p + '$, $' + q + '$\n따라서 $' + expandedLatex + ' = ' + factoredLatex + '$';

          if (type === 'multiple-choice') {
            choices = [
              '$' + factoredLatex + '$',
              '$(x' + pSign + p + ')(x' + (q > 0 ? '-' : '+') + Math.abs(q) + ')$',
              '$(x' + (p > 0 ? '-' : '+') + Math.abs(p) + ')(x' + qSign + q + ')$',
              '$(x' + pSign + q + ')(x' + qSign + p + ')$'
            ];
            choices = utils.unique(choices);
            var _safe2 = 0;
            while (choices.length < 4 && _safe2++ < 20) {
              choices.push('$(x+' + (p + _safe2) + ')(x+' + (q - _safe2) + ')$');
              choices = utils.unique(choices);
            }
            choices = choices.slice(0, 4);
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'difference-of-squares': {
          // 합차 공식: a²x² - b² = (ax+b)(ax-b)
          var a = utils.randChoice([1, 2, 3]);
          var b = utils.randInt(1, 9);
          var a2 = a * a;
          var b2 = b * b;

          var expanded, factored;
          if (a === 1) {
            expanded = 'x^2-' + b2;
            factored = '(x+' + b + ')(x-' + b + ')';
          } else {
            expanded = a2 + 'x^2-' + b2;
            factored = '(' + a + 'x+' + b + ')(' + a + 'x-' + b + ')';
          }

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '$' + expanded + '$ 은 $(' + (a === 1 ? 'x' : a + 'x') + ')^2 - ' + b + '^2$ 의 형태이므로 합차 공식을 적용하면 $' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            var aStr = a === 1 ? 'x' : a + 'x';
            choices = [
              '$' + factored + '$',
              '$(' + aStr + '+' + b + ')^2$',
              '$(' + aStr + '-' + b + ')^2$',
              '$(' + aStr + '+' + b2 + ')(' + aStr + '-1)$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'perfect-square-trinomial': {
          // 완전제곱식 (중간): (ax+b)² 또는 (ax-b)²
          var a = utils.randChoice([2, 3]);
          var b = utils.randInt(1, 5);
          var sign = utils.randChoice([1, -1]);
          b = b * sign;

          var c2coeff = a * a;
          var c1coeff = 2 * a * b;
          var c0coeff = b * b;

          var expanded = utils.coeffStr(c2coeff, 'x^2', true) + utils.coeffStr(c1coeff, 'x', false) + '+' + c0coeff;
          var signStr = b > 0 ? '+' : '-';
          var absB = Math.abs(b);
          var factored = '(' + a + 'x' + signStr + absB + ')^2';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '$' + expanded + ' = (' + a + 'x)^2 + 2 \\cdot ' + a + 'x \\cdot ' + (b > 0 ? absB : '(-' + absB + ')') + ' + ' + absB + '^2 = ' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            var oppSignStr = b > 0 ? '-' : '+';
            choices = [
              '$' + factored + '$',
              '$(' + a + 'x' + oppSignStr + absB + ')^2$',
              '$(' + a + 'x' + signStr + (absB + 1) + ')^2$',
              '$(' + a + 'x' + signStr + absB + ')(' + a + 'x' + oppSignStr + absB + ')$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'general-trinomial': {
          // x² + bx + c = (x+p)(x+q), p+q=b, pq=c
          var p = utils.randIntNonZero(-8, 8);
          var q = utils.randIntNonZero(-8, 8);
          var _safe = 0;
          while (p === q && p > 0 && _safe++ < 20) { q = utils.randIntNonZero(-8, 8); }

          var bCoeff = p + q;
          var cCoeff = p * q;

          var expanded = 'x^2' + utils.coeffStr(bCoeff, 'x', false) + utils.constStr(cCoeff, false);

          var pSign = p > 0 ? '+' : '-';
          var qSign = q > 0 ? '+' : '-';
          var factored = '(x' + pSign + Math.abs(p) + ')(x' + qSign + Math.abs(q) + ')';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '두 수의 합이 $' + bCoeff + '$이고 곱이 $' + cCoeff + '$인 두 수는 $' + p + '$과 $' + q + '$ 입니다. 따라서 $' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            var w1p = p + 1, w1q = q - 1;
            var w1 = '(x' + (w1p >= 0 ? '+' : '-') + Math.abs(w1p) + ')(x' + (w1q >= 0 ? '+' : '-') + Math.abs(w1q) + ')';
            var w2 = '(x' + pSign + Math.abs(p) + ')(x' + (q >= 0 ? '-' : '+') + Math.abs(q) + ')';
            var w3 = '(x' + (p >= 0 ? '-' : '+') + Math.abs(p) + ')(x' + qSign + Math.abs(q) + ')';
            choices = ['$' + factored + '$', '$' + w1 + '$', '$' + w2 + '$', '$' + w3 + '$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'general-trinomial-hard': {
          // ax² + bx + c (a≠1): (mx+n)(px+q)
          var m = utils.randChoice([2, 3]);
          var pVal = 1;
          var n = utils.randIntNonZero(-5, 5);
          var qVal = utils.randIntNonZero(-5, 5);
          var _safe = 0;
          while (n === qVal && _safe++ < 20) { qVal = utils.randIntNonZero(-5, 5); }

          // (mx+n)(px+q) = mpx² + (mq+np)x + nq
          var aCoeff = m * pVal;
          var bCoeff = m * qVal + n * pVal;
          var cCoeff = n * qVal;

          var expanded = utils.coeffStr(aCoeff, 'x^2', true) + utils.coeffStr(bCoeff, 'x', false) + utils.constStr(cCoeff, false);

          var nSign = n > 0 ? '+' : '-';
          var qSign = qVal > 0 ? '+' : '-';
          var factored = '(' + m + 'x' + nSign + Math.abs(n) + ')(x' + qSign + Math.abs(qVal) + ')';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '$' + expanded + '$ 에서 $' + aCoeff + ' = ' + m + ' \\times ' + pVal + '$, $' + cCoeff + ' = ' + n + ' \\times ' + (qVal > 0 ? qVal : '(' + qVal + ')') + '$ 이고, 교차곱의 합이 $' + bCoeff + '$ 이므로 $' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            var w1 = '(' + m + 'x' + (n > 0 ? '-' : '+') + Math.abs(n) + ')(x' + qSign + Math.abs(qVal) + ')';
            var w2 = '(' + m + 'x' + nSign + Math.abs(n) + ')(x' + (qVal > 0 ? '-' : '+') + Math.abs(qVal) + ')';
            var w3 = '(' + m + 'x' + nSign + Math.abs(qVal) + ')(x' + qSign + Math.abs(n) + ')';
            choices = ['$' + factored + '$', '$' + w1 + '$', '$' + w2 + '$', '$' + w3 + '$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'grouped': {
          // 치환 또는 묶기: x²+y² 형태 -> (x+a)²-b² 패턴
          // (x+a)(x+b)(x+c)(x+d) 형태 대신 간단한 그룹화
          // ax+ay+bx+by = (a+b)(x+y)
          var a = utils.randInt(2, 6);
          var b = utils.randInt(2, 6);
          var _safe = 0;
          while (a === b && _safe++ < 20) { b = utils.randInt(2, 6); }
          // ax + ay + bx + by = (x+y)(a+b)
          var expanded = a + 'x+' + a + 'y+' + b + 'x+' + b + 'y';
          var factored = '(x+y)(' + a + '+' + b + ')';
          var simplified = '(x+y) \\cdot ' + (a + b);
          // Actually prefer standard factored form
          factored = (a + b) + '(x+y)';

          questionText = '$' + expanded + '$ 을 인수분해하시오.';
          questionLatex = expanded;
          answer = '$' + factored + '$';
          explanation = '$' + expanded + '$ 에서 앞 두 항에서 $' + a + '$를, 뒤 두 항에서 $' + b + '$를 묶으면 $' + a + '(x+y)+' + b + '(x+y) = (x+y)(' + a + '+' + b + ') = ' + factored + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + factored + '$',
              '$' + a + '(x+y)+' + b + '$',
              '$(' + a + '+' + b + ')(x-y)$',
              '$' + (a * b) + '(x+y)$'
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
          return '$(' + utils.randIntNonZero(-9, 9) + 'x+' + utils.randIntNonZero(-9, 9) + ')$';
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
