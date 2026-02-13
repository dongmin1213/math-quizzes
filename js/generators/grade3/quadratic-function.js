// 중3 - 이차함수
(function() {
  var utils = MathQuiz.utils;
  var svg = MathQuiz.svg;

  MathQuiz.generators['grade3-quadratic-function'] = {
    meta: {
      grade: 3,
      topic: '이차함수',
      topicId: 'quadratic-function',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['basic-y-ax2', 'direction', 'y-ax2-vertex'];
      } else if (difficulty === 2) {
        subTypes = ['vertex-form', 'axis-of-symmetry', 'find-vertex'];
      } else {
        subTypes = ['standard-to-vertex', 'find-equation', 'max-min'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;
      var svgDiagram = null;

      // 이차함수 표준형 LaTeX 생성 헬퍼
      function vertexFormLatex(a, p, q) {
        var s = 'y=';
        if (a === -1) s += '-';
        else if (a !== 1) s += a;
        if (p === 0) {
          s += 'x^2';
        } else {
          s += '(x' + (p > 0 ? '-' + p : '+' + (-p)) + ')^2';
        }
        if (q > 0) s += '+' + q;
        else if (q < 0) s += q;
        return s;
      }

      function generalFormLatex(a, b, c) {
        var s = 'y=';
        s += utils.coeffStr(a, 'x^2', true);
        s += utils.coeffStr(b, 'x', false);
        s += utils.constStr(c, false);
        return s;
      }

      switch (subType) {

        // ===== 난이도 1 =====
        case 'basic-y-ax2': {
          // y=ax² 그래프에서 a의 부호와 점 지나는지 확인
          var a = utils.randIntNonZero(-4, 4);
          var x0 = utils.randIntNonZero(-3, 3);
          var y0 = a * x0 * x0;

          questionText = '이차함수 $y=' + (a === 1 ? '' : (a === -1 ? '-' : a)) + 'x^2$ 의 그래프가 점 $(' + x0 + ',\\;' + y0 + ')$ 을 지나는지 확인하시오.';
          questionLatex = 'y=' + (a === 1 ? '' : (a === -1 ? '-' : a)) + 'x^2';

          answer = '지난다';
          explanation = '$x=' + x0 + '$ 을 대입하면 $y=' + a + ' \\times (' + x0 + ')^2 = ' + a + ' \\times ' + (x0 * x0) + ' = ' + y0 + '$ 이므로 점 $(' + x0 + ',\\;' + y0 + ')$ 을 지납니다.';

          // 더 나은 문제 형태: a값 구하기
          questionText = '이차함수 $y=ax^2$ 의 그래프가 점 $(' + x0 + ',\\;' + y0 + ')$ 을 지날 때, $a$의 값을 구하시오.';
          answer = '$a=' + a + '$';
          explanation = '$y=ax^2$ 에 $x=' + x0 + '$, $y=' + y0 + '$ 을 대입하면 $' + y0 + '=a \\times ' + (x0 * x0) + '$ 이므로 $a=' + a + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = ['$a=' + a + '$', '$a=' + (-a) + '$', '$a=' + (a + 1) + '$', '$a=' + (a - 1) + '$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'direction': {
          // 그래프의 방향 (위/아래로 볼록)
          var a = utils.randIntNonZero(-5, 5);
          var aStr = a === 1 ? '' : (a === -1 ? '-' : String(a));

          questionText = '이차함수 $y=' + aStr + 'x^2$ 의 그래프는 어느 방향으로 열려 있는가?';
          questionLatex = 'y=' + aStr + 'x^2';

          var dir = a > 0 ? '위' : '아래';
          answer = dir + '로 열려 있다 (볼록)';
          explanation = '$a=' + a + (a > 0 ? ' > 0$' : ' < 0$') + ' 이므로 그래프는 ' + dir + '로 열려 있습니다. ' + (a > 0 ? '아래로 볼록한 포물선입니다.' : '위로 볼록한 포물선입니다.');

          if (type === 'multiple-choice') {
            choices = [
              '위로 열려 있다 (볼록)',
              '아래로 열려 있다 (볼록)',
              '왼쪽으로 열려 있다',
              '오른쪽으로 열려 있다'
            ];
            answer = a > 0 ? choices[0] : choices[1];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'y-ax2-vertex': {
          // y=ax²의 꼭짓점과 축 구하기
          var a = utils.randIntNonZero(-4, 4);
          var aStr = a === 1 ? '' : (a === -1 ? '-' : String(a));

          questionText = '이차함수 $y=' + aStr + 'x^2$ 의 꼭짓점의 좌표를 구하시오.';
          questionLatex = 'y=' + aStr + 'x^2';
          answer = '$(0,\\;0)$';
          explanation = '$y=' + aStr + 'x^2$ 은 $y=a(x-0)^2+0$ 형태이므로 꼭짓점은 $(0,\\;0)$ 입니다.';

          if (type === 'multiple-choice') {
            choices = ['$(0,\\;0)$', '$(0,\\;' + a + ')$', '$(' + a + ',\\;0)$', '$(1,\\;' + a + ')$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'vertex-form': {
          // y=a(x-p)²+q 에서 꼭짓점 구하기
          var a = utils.randIntNonZero(-3, 3);
          var p = utils.randIntNonZero(-5, 5);
          var q = utils.randIntNonZero(-5, 5);

          var funcLatex = vertexFormLatex(a, p, q);
          questionText = '이차함수 $' + funcLatex + '$ 의 꼭짓점의 좌표를 구하시오.';
          questionLatex = funcLatex;
          answer = '$(' + p + ',\\;' + q + ')$';
          explanation = '$' + funcLatex + '$ 에서 $a(x-p)^2+q$ 형태의 꼭짓점은 $(p,\\;q)$ 이므로 꼭짓점은 $(' + p + ',\\;' + q + ')$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$(' + p + ',\\;' + q + ')$',
              '$(' + (-p) + ',\\;' + q + ')$',
              '$(' + p + ',\\;' + (-q) + ')$',
              '$(' + (-p) + ',\\;' + (-q) + ')$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'axis-of-symmetry': {
          // 대칭축 구하기
          var a = utils.randIntNonZero(-3, 3);
          var p = utils.randIntNonZero(-6, 6);
          var q = utils.randInt(-4, 4);

          var funcLatex = vertexFormLatex(a, p, q);
          questionText = '이차함수 $' + funcLatex + '$ 의 대칭축의 방정식을 구하시오.';
          questionLatex = funcLatex;
          answer = '$x=' + p + '$';
          explanation = '꼭짓점이 $(' + p + ',\\;' + q + ')$ 이므로 대칭축은 $x=' + p + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$x=' + p + '$',
              '$x=' + (-p) + '$',
              '$y=' + q + '$',
              '$x=' + (p + 1) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-vertex': {
          // y=a(x-p)²+q에서 여러 정보 조합
          var a = utils.randChoice([-2, -1, 1, 2]);
          var p = utils.randIntNonZero(-4, 4);
          var q = utils.randIntNonZero(-5, 5);

          var funcLatex = vertexFormLatex(a, p, q);
          var askType = utils.randChoice(['range', 'increase-decrease']);

          if (askType === 'range') {
            questionText = '이차함수 $' + funcLatex + '$ 의 치역을 구하시오.';
            questionLatex = funcLatex;
            if (a > 0) {
              answer = '$y \\geq ' + q + '$';
              explanation = '$a=' + a + ' > 0$ 이므로 아래로 볼록이고, 꼭짓점 $(' + p + ',\\;' + q + ')$ 에서 최솟값 $' + q + '$ 을 가집니다. 따라서 치역은 $y \\geq ' + q + '$ 입니다.';
            } else {
              answer = '$y \\leq ' + q + '$';
              explanation = '$a=' + a + ' < 0$ 이므로 위로 볼록이고, 꼭짓점 $(' + p + ',\\;' + q + ')$ 에서 최댓값 $' + q + '$ 을 가집니다. 따라서 치역은 $y \\leq ' + q + '$ 입니다.';
            }

            if (type === 'multiple-choice') {
              choices = [
                '$y \\geq ' + q + '$',
                '$y \\leq ' + q + '$',
                '$y \\geq ' + (-q) + '$',
                '$y \\leq ' + (-q) + '$'
              ];
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          } else {
            // 증가/감소 구간
            questionText = '이차함수 $' + funcLatex + '$ 에서 $y$의 값이 $x$의 값이 증가할 때 함께 감소하는 $x$의 범위를 구하시오.';
            questionLatex = funcLatex;
            if (a > 0) {
              answer = '$x < ' + p + '$';
              explanation = '$a > 0$ 이므로 대칭축 $x=' + p + '$ 의 왼쪽 ($x < ' + p + '$)에서 감소합니다.';
            } else {
              answer = '$x > ' + p + '$';
              explanation = '$a < 0$ 이므로 대칭축 $x=' + p + '$ 의 오른쪽 ($x > ' + p + '$)에서 감소합니다.';
            }

            if (type === 'multiple-choice') {
              choices = [
                '$x < ' + p + '$',
                '$x > ' + p + '$',
                '$x < ' + (-p) + '$',
                '$x > ' + (-p) + '$'
              ];
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'standard-to-vertex': {
          // y=ax²+bx+c → y=a(x-p)²+q 변환
          var a = utils.randChoice([-2, -1, 1, 2]);
          var p = utils.randIntNonZero(-4, 4);
          var q = utils.randInt(-5, 5);

          // y = a(x-p)² + q 를 전개
          var bCoeff = -2 * a * p;
          var cCoeff = a * p * p + q;

          var genLatex = generalFormLatex(a, bCoeff, cCoeff);
          var vtxLatex = vertexFormLatex(a, p, q);

          questionText = '이차함수 $' + genLatex + '$ 을 $y=a(x-p)^2+q$ 꼴로 변환하시오.';
          questionLatex = genLatex;
          answer = '$' + vtxLatex + '$';
          explanation = '$' + genLatex + '$ 에서 완전제곱식으로 변환하면\n' +
            '$= ' + (a === 1 ? '' : (a === -1 ? '-' : a)) + '(x^2' + utils.coeffStr(-2 * p, 'x', false) + '+' + (p * p) + ')' + utils.constStr(q, false) + '$\n' +
            '$= ' + vtxLatex + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + vtxLatex + '$',
              '$' + vertexFormLatex(a, -p, q) + '$',
              '$' + vertexFormLatex(a, p, -q) + '$',
              '$' + vertexFormLatex(-a, p, q) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-equation': {
          // 조건으로 이차함수 구하기: 꼭짓점 + 한 점
          var a = utils.randChoice([-3, -2, -1, 1, 2, 3]);
          var p = utils.randInt(-3, 3);
          var q = utils.randInt(-4, 4);
          var x0 = p + utils.randChoice([-2, -1, 1, 2]);
          var y0 = a * (x0 - p) * (x0 - p) + q;

          var vtxLatex = vertexFormLatex(a, p, q);

          questionText = '꼭짓점이 $(' + p + ',\\;' + q + ')$ 이고, 점 $(' + x0 + ',\\;' + y0 + ')$ 을 지나는 이차함수의 식을 구하시오.';
          questionLatex = null;
          answer = '$' + vtxLatex + '$';
          explanation = '꼭짓점이 $(' + p + ',\\;' + q + ')$ 이므로 $y=a(x' + (p > 0 ? '-' + p : '+' + (-p)) + ')^2+' + (q >= 0 ? q : '(' + q + ')') + '$ 로 놓고, 점 $(' + x0 + ',\\;' + y0 + ')$ 을 대입하면 $' + y0 + '=a(' + (x0 - p) + ')^2+' + (q >= 0 ? q : '(' + q + ')') + '$ 에서 $a=' + a + '$ 입니다. 따라서 $' + vtxLatex + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + vtxLatex + '$',
              '$' + vertexFormLatex(-a, p, q) + '$',
              '$' + vertexFormLatex(a, -p, q) + '$',
              '$' + vertexFormLatex(a + 1, p, q) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'max-min': {
          // 최댓값 또는 최솟값 구하기 (표준형에서)
          var a = utils.randChoice([-2, -1, 1, 2]);
          var p = utils.randIntNonZero(-4, 4);
          var q = utils.randInt(-6, 6);

          var bCoeff = -2 * a * p;
          var cCoeff = a * p * p + q;
          var genLatex = generalFormLatex(a, bCoeff, cCoeff);

          var extremeType = a > 0 ? '최솟값' : '최댓값';

          questionText = '이차함수 $' + genLatex + '$ 의 ' + extremeType + '을 구하시오.';
          questionLatex = genLatex;
          answer = '$' + q + '$';
          explanation = '$' + genLatex + '$ 을 꼭짓점 형태로 바꾸면 $' + vertexFormLatex(a, p, q) + '$ 입니다. ' +
            (a > 0 ? '$a > 0$ 이므로 $x=' + p + '$ 에서 최솟값 $' + q + '$ 을 가집니다.' :
              '$a < 0$ 이므로 $x=' + p + '$ 에서 최댓값 $' + q + '$ 을 가집니다.');

          if (type === 'multiple-choice') {
            choices = [
              '$' + q + '$',
              '$' + (-q) + '$',
              '$' + p + '$',
              '$' + (q + a) + '$'
            ];
            choices = choices.map(function(c) { return c; });
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
          return '$' + utils.randIntNonZero(-15, 15) + '$';
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
