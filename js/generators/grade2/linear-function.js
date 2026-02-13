// 중2 - 일차함수 (Linear Functions)
(function() {
  var utils = MathQuiz.utils;
  var svg = MathQuiz.svg;

  // 기울기를 LaTeX로 표현
  function slopeToLatex(num, den) {
    if (den === 1) return String(num);
    if (den === -1) return String(-num);
    return utils.fractionToLatex(num, den);
  }

  // y = mx + b 형태의 LaTeX
  function linearEqLatex(m_num, m_den, b) {
    var f = utils.simplifyFraction(m_num, m_den);
    var slopeStr;
    if (f.den === 1) {
      slopeStr = utils.coeffStr(f.num, 'x', true);
    } else {
      var sign = f.num < 0 ? '-' : '';
      slopeStr = sign + '\\frac{' + Math.abs(f.num) + '}{' + f.den + '}x';
    }
    var bStr = utils.constStr(b, false);
    return 'y = ' + slopeStr + bStr;
  }

  // 난이도 1: 기울기와 y절편 구하기
  function generateSlopeIntercept() {
    var m = utils.randIntNonZero(-5, 5);
    var b = utils.randInt(-8, 8);
    var askSlope = utils.randChoice([true, false]);

    var eqLatex = linearEqLatex(m, 1, b);
    var questionText, answer, explanation;

    if (askSlope) {
      questionText = '일차함수 $' + eqLatex + '$의 기울기를 구하시오.';
      answer = String(m);
      explanation = '$y = mx + b$ 형태에서 $x$의 계수가 기울기이므로 기울기는 $' + m + '$입니다.';

      var distractors = utils.generateDistractors(m, 3, function() {
        return utils.randChoice([b, -m, m + utils.randIntNonZero(-2, 2)]);
      });
      var choices = ['$' + m + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);
    } else {
      questionText = '일차함수 $' + eqLatex + '$의 $y$절편을 구하시오.';
      answer = String(b);
      explanation = '$y = mx + b$ 형태에서 상수항이 $y$절편이므로 $y$절편은 $' + b + '$입니다.';

      var distractors = utils.generateDistractors(b, 3, function() {
        return utils.randChoice([m, -b, b + utils.randIntNonZero(-3, 3)]);
      });
      var choices = ['$' + b + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);
    }

    return {
      questionText: questionText,
      questionLatex: eqLatex,
      answer: answer,
      answerIndex: answerIndex,
      choices: reordered,
      explanation: explanation,
      svg: null
    };
  }

  // 난이도 2: 두 점을 지나는 직선의 방정식 구하기
  function generateFromTwoPoints() {
    // backward: 기울기와 y절편을 먼저 결정
    var m_num = utils.randIntNonZero(-4, 4);
    var m_den = utils.randChoice([1, 1, 2, 3]);
    var frac = utils.simplifyFraction(m_num, m_den);
    m_num = frac.num;
    m_den = frac.den;

    var b = utils.randInt(-6, 6);

    // 두 점 선택 (정수 좌표가 되도록)
    var x1 = 0;
    var y1 = b;
    var x2 = m_den * utils.randIntNonZero(1, 3);
    if (utils.randChoice([true, false])) x2 = -x2;
    var y2 = m_num * x2 / m_den + b;

    // y2가 정수인지 확인
    if (y2 !== Math.round(y2)) {
      x2 = m_den;
      y2 = m_num + b;
    }

    var questionText = '두 점 $(' + x1 + ',\\; ' + y1 + ')$, $(' + x2 + ',\\; ' + y2 + ')$을 지나는 일차함수의 식을 구하시오.';

    var eqLatex = linearEqLatex(m_num, m_den, b);
    var answer = '$' + eqLatex + '$';

    var explanation = '기울기 $m = \\frac{' + y2 + ' - ' + (y1 < 0 ? '(' + y1 + ')' : y1) + '}{' +
      x2 + ' - ' + (x1 < 0 ? '(' + x1 + ')' : x1) + '} = ' + slopeToLatex(m_num, m_den) + '$\n';
    explanation += '$y$절편이 $' + b + '$이므로\n';
    explanation += '$' + eqLatex + '$';

    // 오답 생성
    var wrongEqs = [];
    // 기울기 부호 실수
    wrongEqs.push('$' + linearEqLatex(-m_num, m_den, b) + '$');
    // y절편 부호 실수
    wrongEqs.push('$' + linearEqLatex(m_num, m_den, -b) + '$');
    // 기울기 역수 실수
    if (m_den !== 1) {
      wrongEqs.push('$' + linearEqLatex(m_den, m_num > 0 ? m_num : -m_num, b) + '$');
    } else {
      wrongEqs.push('$' + linearEqLatex(m_num + 1, 1, b) + '$');
    }

    var choices = [answer];
    for (var i = 0; i < wrongEqs.length; i++) {
      choices.push(wrongEqs[i]);
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$' + linearEqLatex(m_num + utils.randIntNonZero(-2, 2), m_den, b + utils.randIntNonZero(-2, 2)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: null,
      answer: answer,
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation,
      svg: null
    };
  }

  // 난이도 2/3: 그래프에서 직선의 방정식 읽기
  function generateGraphReading() {
    var m = utils.randIntNonZero(-3, 3);
    var b = utils.randInt(-3, 3);

    var xMin = -5, xMax = 5, yMin = -5, yMax = 5;
    var width = 280, height = 280;
    var grid = svg.coordinateGrid(xMin, xMax, yMin, yMax, width, height);

    // 직선 그리기: 두 점을 잡아 연결
    var plotX1 = xMin;
    var plotY1 = m * plotX1 + b;
    var plotX2 = xMax;
    var plotY2 = m * plotX2 + b;

    // y 범위 클리핑
    if (plotY1 < yMin) { plotX1 = (yMin - b) / m; plotY1 = yMin; }
    if (plotY1 > yMax) { plotX1 = (yMax - b) / m; plotY1 = yMax; }
    if (plotY2 < yMin) { plotX2 = (yMin - b) / m; plotY2 = yMin; }
    if (plotY2 > yMax) { plotX2 = (yMax - b) / m; plotY2 = yMax; }

    var p1 = grid.toPixel(plotX1, plotY1);
    var p2 = grid.toPixel(plotX2, plotY2);

    var svgStr = svg.open(width, height);
    svgStr += grid.svg;
    svgStr += svg.line(p1[0], p1[1], p2[0], p2[1], { stroke: '#E74C3C', strokeWidth: 2.5 });

    // 두 격자점 표시
    var dotX1 = 0, dotY1 = b;
    var dotX2 = 1, dotY2 = m + b;
    if (dotY2 > yMax || dotY2 < yMin) { dotX2 = -1; dotY2 = -m + b; }
    var dp1 = grid.toPixel(dotX1, dotY1);
    var dp2 = grid.toPixel(dotX2, dotY2);
    svgStr += svg.dot(dp1[0], dp1[1]);
    svgStr += svg.dot(dp2[0], dp2[1]);
    svgStr += svg.close();

    var eqLatex = linearEqLatex(m, 1, b);
    var questionText = '다음 그래프가 나타내는 일차함수의 식을 구하시오.';
    var answer = '$' + eqLatex + '$';

    var explanation = '그래프가 점 $(0,\\; ' + b + ')$, $(' + dotX2 + ',\\; ' + dotY2 + ')$을 지나므로\n';
    explanation += '기울기 $= \\frac{' + dotY2 + ' - ' + (b >= 0 ? b : '(' + b + ')') + '}{' + dotX2 + ' - 0} = ' + m + '$\n';
    explanation += '$y$절편이 $' + b + '$이므로 $' + eqLatex + '$';

    var wrongEqs = [
      '$' + linearEqLatex(-m, 1, b) + '$',
      '$' + linearEqLatex(m, 1, -b) + '$',
      '$' + linearEqLatex(-m, 1, -b) + '$'
    ];

    var choices = [answer];
    for (var i = 0; i < wrongEqs.length; i++) {
      choices.push(wrongEqs[i]);
    }
    choices = utils.unique(choices);
    var _safe = 0;
    while (choices.length < 4 && _safe++ < 20) {
      choices.push('$' + linearEqLatex(m + utils.randIntNonZero(-2, 2), 1, b + utils.randIntNonZero(-2, 2)) + '$');
      choices = utils.unique(choices);
    }
    choices = choices.slice(0, 4);
    var correctChoice = choices[0];
    choices = utils.shuffle(choices);
    var answerIndex = choices.indexOf(correctChoice);

    return {
      questionText: questionText,
      questionLatex: null,
      answer: answer,
      answerIndex: answerIndex,
      choices: choices,
      explanation: explanation,
      svg: svgStr
    };
  }

  // 난이도 3: x절편, y절편 관련 응용 문제
  function generateInterceptProblem() {
    // backward: 기울기와 y절편 결정, x절편이 정수가 되도록
    var m = utils.randIntNonZero(-4, 4);
    var b = m * utils.randIntNonZero(1, 5); // x절편 = -b/m 이 정수가 되도록

    var xIntercept = -b / m;
    var yIntercept = b;

    var eqLatex = linearEqLatex(m, 1, b);

    var subtype = utils.randChoice(['xIntercept', 'triangleArea']);

    if (subtype === 'xIntercept') {
      var questionText = '일차함수 $' + eqLatex + '$의 그래프의 $x$절편을 구하시오.';
      var answer = String(xIntercept);
      var explanation = '$x$절편은 $y = 0$일 때의 $x$ 값이므로\n';
      explanation += '$0 = ' + utils.coeffStr(m, 'x', true) + utils.constStr(b, false) + '$에서\n';
      explanation += '$x = ' + xIntercept + '$';

      var distractors = utils.generateDistractors(xIntercept, 3, function() {
        return utils.randChoice([yIntercept, -xIntercept, xIntercept + utils.randIntNonZero(-3, 3)]);
      });
      var choices = ['$' + xIntercept + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: eqLatex,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: null
      };
    } else {
      // 직선과 두 축으로 이루어진 삼각형의 넓이
      var area = Math.abs(xIntercept * yIntercept) / 2;

      var questionText = '일차함수 $' + eqLatex + '$의 그래프와 $x$축, $y$축으로 둘러싸인 삼각형의 넓이를 구하시오.';
      var answer;
      if (area === Math.floor(area)) {
        answer = String(area);
      } else {
        answer = utils.fractionToLatex(Math.abs(xIntercept * yIntercept), 2);
      }

      var explanation = '$x$절편: $' + xIntercept + '$, $y$절편: $' + yIntercept + '$\n';
      explanation += '삼각형의 밑변 $= |' + xIntercept + '| = ' + Math.abs(xIntercept) + '$, 높이 $= |' + yIntercept + '| = ' + Math.abs(yIntercept) + '$\n';
      explanation += '넓이 $= \\frac{1}{2} \\times ' + Math.abs(xIntercept) + ' \\times ' + Math.abs(yIntercept) + ' = ' + answer + '$';

      var areaNum = Math.abs(xIntercept * yIntercept);
      var distractors = utils.generateDistractors(areaNum, 3, function() {
        return utils.randChoice([
          areaNum, // 2로 나누기를 잊음 (정답은 areaNum/2)
          Math.abs(xIntercept) + Math.abs(yIntercept),
          Math.abs(areaNum / 2 + utils.randIntNonZero(-3, 3)) * 2
        ]);
      });

      var choices = ['$' + answer + '$'];
      for (var i = 0; i < distractors.length; i++) {
        var dv = distractors[i];
        if (dv % 2 === 0) {
          choices.push('$' + (dv / 2) + '$');
        } else {
          choices.push('$' + utils.fractionToLatex(dv, 2) + '$');
        }
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var extraVal = area + utils.randIntNonZero(-4, 4);
        if (extraVal > 0) choices.push('$' + extraVal + '$');
        choices = utils.unique(choices);
      }
      choices = choices.slice(0, 4);
      var correctChoice = choices[0];
      choices = utils.shuffle(choices);
      var answerIndex = choices.indexOf(correctChoice);

      return {
        questionText: questionText,
        questionLatex: eqLatex,
        answer: '$' + answer + '$',
        answerIndex: answerIndex,
        choices: choices,
        explanation: explanation,
        svg: null
      };
    }
  }

  MathQuiz.generators['grade2-linear-function'] = {
    meta: {
      grade: 2,
      topic: '일차함수',
      topicId: 'linear-function',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var result;
      if (difficulty <= 1) {
        result = generateSlopeIntercept();
      } else if (difficulty === 2) {
        result = utils.randChoice([generateFromTwoPoints, generateGraphReading])();
      } else {
        result = utils.randChoice([generateFromTwoPoints, generateInterceptProblem, generateInterceptProblem])();
      }

      return {
        type: type,
        questionText: result.questionText,
        questionLatex: result.questionLatex,
        svg: result.svg || null,
        choices: type === 'multiple-choice' ? result.choices : null,
        answer: result.answer,
        answerIndex: type === 'multiple-choice' ? result.answerIndex : null,
        explanation: result.explanation
      };
    }
  };
})();
