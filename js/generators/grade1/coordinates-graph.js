// 중1 - 좌표와 그래프 문제 생성기
(function() {
  var utils = MathQuiz.utils;
  var svg = MathQuiz.svg;

  // 좌표 그리드 SVG를 생성하고 점을 표시하는 헬퍼
  function drawPointOnGrid(px, py, label, gridRange) {
    var range = gridRange || 5;
    var width = 300;
    var height = 300;
    var grid = svg.coordinateGrid(-range, range, -range, range, width, height);

    var s = svg.open(width, height);
    s += grid.svg;

    // 점 표시
    var pixel = grid.toPixel(px, py);
    s += svg.dot(pixel[0], pixel[1]);
    if (label) {
      s += svg.text(pixel[0] + 10, pixel[1] - 10, label, { fontSize: 13, fill: '#4A90D9' });
    }

    s += svg.close();
    return s;
  }

  // 두 점을 그리드 위에 표시
  function drawTwoPointsOnGrid(p1x, p1y, p2x, p2y, label1, label2, gridRange) {
    var range = gridRange || 5;
    var width = 300;
    var height = 300;
    var grid = svg.coordinateGrid(-range, range, -range, range, width, height);

    var s = svg.open(width, height);
    s += grid.svg;

    var pixel1 = grid.toPixel(p1x, p1y);
    var pixel2 = grid.toPixel(p2x, p2y);

    s += svg.dot(pixel1[0], pixel1[1]);
    s += svg.text(pixel1[0] + 10, pixel1[1] - 10, label1, { fontSize: 13, fill: '#4A90D9' });

    s += svg.dot(pixel2[0], pixel2[1]);
    s += svg.text(pixel2[0] + 10, pixel2[1] - 10, label2, { fontSize: 13, fill: '#D94A4A' });

    s += svg.close();
    return s;
  }

  // 사분면 이름
  function quadrantName(q) {
    var names = { 1: '제1사분면', 2: '제2사분면', 3: '제3사분면', 4: '제4사분면' };
    return names[q] || '';
  }

  // 좌표로부터 사분면 구하기
  function getQuadrant(x, y) {
    if (x > 0 && y > 0) return 1;
    if (x < 0 && y > 0) return 2;
    if (x < 0 && y < 0) return 3;
    if (x > 0 && y < 0) return 4;
    return 0; // 축 위
  }

  MathQuiz.generators['grade1-coordinates-graph'] = {
    meta: {
      grade: 1,
      topic: '좌표와 그래프',
      topicId: 'coordinates-graph',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var problemTypes;
      if (difficulty === 1) {
        problemTypes = ['identify-quadrant', 'read-coords', 'plot-point'];
      } else if (difficulty === 2) {
        problemTypes = ['identify-quadrant', 'read-coords', 'distance-axis', 'symmetric-point'];
      } else {
        problemTypes = ['distance-two-points', 'symmetric-point', 'midpoint', 'quadrant-conditions'];
      }
      var problemType = utils.randChoice(problemTypes);

      switch (problemType) {
        case 'identify-quadrant': return this._identifyQuadrant(difficulty, type);
        case 'read-coords': return this._readCoords(difficulty, type);
        case 'plot-point': return this._plotPoint(difficulty, type);
        case 'distance-axis': return this._distanceFromAxis(difficulty, type);
        case 'symmetric-point': return this._symmetricPoint(difficulty, type);
        case 'distance-two-points': return this._distanceTwoPoints(difficulty, type);
        case 'midpoint': return this._midpoint(difficulty, type);
        case 'quadrant-conditions': return this._quadrantConditions(difficulty, type);
        default: return this._identifyQuadrant(difficulty, type);
      }
    },

    // 점의 사분면 판별
    _identifyQuadrant: function(difficulty, type) {
      var range = difficulty === 1 ? 4 : 7;
      var x = utils.randIntNonZero(-range, range);
      var y = utils.randIntNonZero(-range, range);
      var quadrant = getQuadrant(x, y);
      var correctAnswer = quadrantName(quadrant);

      var svgStr = drawPointOnGrid(x, y, 'A(' + x + ', ' + y + ')', Math.max(Math.abs(x), Math.abs(y)) + 1);

      if (type === 'multiple-choice') {
        var choices = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
        var correctIndex = quadrant - 1;

        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$은 어느 사분면 위의 점인지 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices,
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '$x$ 좌표가 $' + x + '$' + (x > 0 ? '(양수)' : '(음수)') + '이고, $y$ 좌표가 $' + y + '$' + (y > 0 ? '(양수)' : '(음수)') + '이므로 ' + correctAnswer + '에 있습니다.'
        };
      } else {
        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$은 어느 사분면 위의 점인지 구하시오. (예: 제1사분면)',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: String(quadrant),
          answerIndex: null,
          explanation: '$x$ 좌표가 $' + x + '$' + (x > 0 ? '(양수)' : '(음수)') + '이고, $y$ 좌표가 $' + y + '$' + (y > 0 ? '(양수)' : '(음수)') + '이므로 ' + correctAnswer + '에 있습니다.'
        };
      }
    },

    // 좌표 읽기 (그래프에서 점 위치 파악)
    _readCoords: function(difficulty, type) {
      var range = difficulty === 1 ? 4 : 6;
      var x = utils.randIntNonZero(-range, range);
      var y = utils.randIntNonZero(-range, range);

      var svgStr = drawPointOnGrid(x, y, 'P', Math.max(Math.abs(x), Math.abs(y)) + 1);

      var correctAnswer = '(' + x + ', ' + y + ')';

      if (type === 'multiple-choice') {
        var choices = [correctAnswer];

        // 오답: x, y 바꿈
        choices.push('(' + y + ', ' + x + ')');
        // 오답: 부호 하나 바꿈
        choices.push('(' + (-x) + ', ' + y + ')');
        // 오답: 둘 다 부호 바꿈
        choices.push('(' + x + ', ' + (-y) + ')');

        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push('(' + (x + choices.length) + ', ' + y + ')');
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(correctAnswer);

        return {
          type: type,
          questionText: '좌표평면 위의 점 $P$의 좌표를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '점 $P$는 $x$축 방향으로 $' + x + '$, $y$축 방향으로 $' + y + '$만큼 이동한 위치에 있으므로 좌표는 $' + correctAnswer + '$입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '좌표평면 위의 점 $P$의 좌표를 구하시오. (예: (3, -2))',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: x + ', ' + y,
          answerIndex: null,
          explanation: '점 $P$는 $x$축 방향으로 $' + x + '$, $y$축 방향으로 $' + y + '$만큼 이동한 위치에 있으므로 좌표는 $' + correctAnswer + '$입니다.'
        };
      }
    },

    // 점 찍기 문제 (사분면 판별 변형)
    _plotPoint: function(difficulty, type) {
      var range = 4;
      var x = utils.randIntNonZero(-range, range);
      var y = utils.randIntNonZero(-range, range);
      var quadrant = getQuadrant(x, y);
      var correctAnswer = quadrantName(quadrant);

      // SVG 없이 텍스트로
      if (type === 'multiple-choice') {
        var choices = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
        var correctIndex = quadrant - 1;

        return {
          type: type,
          questionText: '좌표평면에서 점 $(' + x + ',\\, ' + y + ')$이 속하는 사분면을 고르시오.',
          questionLatex: null,
          svg: null,
          choices: choices,
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '$x = ' + x + '$' + (x > 0 ? ' > 0' : ' < 0') + ', $y = ' + y + '$' + (y > 0 ? ' > 0' : ' < 0') + '이므로 ' + correctAnswer + '입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '좌표평면에서 점 $(' + x + ',\\, ' + y + ')$이 속하는 사분면의 번호를 쓰시오.',
          questionLatex: null,
          svg: null,
          choices: null,
          answer: String(quadrant),
          answerIndex: null,
          explanation: '$x = ' + x + '$' + (x > 0 ? ' > 0' : ' < 0') + ', $y = ' + y + '$' + (y > 0 ? ' > 0' : ' < 0') + '이므로 ' + correctAnswer + '입니다.'
        };
      }
    },

    // 축으로부터의 거리
    _distanceFromAxis: function(difficulty, type) {
      var range = difficulty === 2 ? 6 : 9;
      var x = utils.randIntNonZero(-range, range);
      var y = utils.randIntNonZero(-range, range);

      var axis = utils.randChoice(['x', 'y']);
      var correctAnswer = axis === 'x' ? Math.abs(y) : Math.abs(x);

      var svgStr = drawPointOnGrid(x, y, 'A(' + x + ', ' + y + ')', Math.max(Math.abs(x), Math.abs(y)) + 1);

      var axisName = axis === 'x' ? '$x$축' : '$y$축';

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(correctAnswer, 3, function() {
          var candidates = [Math.abs(x), Math.abs(y), Math.abs(x) + Math.abs(y), Math.abs(Math.abs(x) - Math.abs(y))];
          return utils.randChoice(candidates.filter(function(c) { return c !== correctAnswer && c > 0; }).concat([correctAnswer + 1, correctAnswer + 2]));
        });

        var choices = [String(correctAnswer)].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(correctAnswer + choices.length + 1));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(correctAnswer));

        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$에서 ' + axisName + '까지의 거리를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: String(correctAnswer),
          answerIndex: correctIndex,
          explanation: axis === 'x'
            ? '점에서 $x$축까지의 거리는 $y$ 좌표의 절댓값이므로 $|' + y + '| = ' + correctAnswer + '$입니다.'
            : '점에서 $y$축까지의 거리는 $x$ 좌표의 절댓값이므로 $|' + x + '| = ' + correctAnswer + '$입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$에서 ' + axisName + '까지의 거리를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: String(correctAnswer),
          answerIndex: null,
          explanation: axis === 'x'
            ? '점에서 $x$축까지의 거리는 $y$ 좌표의 절댓값이므로 $|' + y + '| = ' + correctAnswer + '$입니다.'
            : '점에서 $y$축까지의 거리는 $x$ 좌표의 절댓값이므로 $|' + x + '| = ' + correctAnswer + '$입니다.'
        };
      }
    },

    // 대칭점
    _symmetricPoint: function(difficulty, type) {
      var range = difficulty <= 2 ? 5 : 8;
      var x = utils.randIntNonZero(-range, range);
      var y = utils.randIntNonZero(-range, range);

      var symmetryType = utils.randChoice(['x-axis', 'y-axis', 'origin']);
      var sx, sy, symmetryName;

      if (symmetryType === 'x-axis') {
        sx = x; sy = -y;
        symmetryName = '$x$축';
      } else if (symmetryType === 'y-axis') {
        sx = -x; sy = y;
        symmetryName = '$y$축';
      } else {
        sx = -x; sy = -y;
        symmetryName = '원점';
      }

      var correctAnswer = '(' + sx + ', ' + sy + ')';

      var gridRange = Math.max(Math.abs(x), Math.abs(y), Math.abs(sx), Math.abs(sy)) + 1;
      var svgStr = drawPointOnGrid(x, y, 'A', gridRange);

      if (type === 'multiple-choice') {
        var choices = [correctAnswer];
        // x축 대칭
        choices.push('(' + x + ', ' + (-y) + ')');
        // y축 대칭
        choices.push('(' + (-x) + ', ' + y + ')');
        // 원점 대칭
        choices.push('(' + (-x) + ', ' + (-y) + ')');

        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push('(' + (sx + choices.length) + ', ' + sy + ')');
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(correctAnswer);

        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$을 ' + symmetryName + '에 대하여 대칭이동한 점의 좌표를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: symmetryName + '에 대한 대칭이동: ' +
            (symmetryType === 'x-axis' ? '$x$ 좌표는 그대로, $y$ 좌표의 부호를 바꾸면' :
              symmetryType === 'y-axis' ? '$x$ 좌표의 부호를 바꾸고, $y$ 좌표는 그대로이면' :
                '$x$ 좌표와 $y$ 좌표의 부호를 모두 바꾸면') +
            ' $' + correctAnswer + '$입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '점 $A(' + x + ',\\, ' + y + ')$을 ' + symmetryName + '에 대하여 대칭이동한 점의 좌표를 구하시오. (예: (3, -2))',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: sx + ', ' + sy,
          answerIndex: null,
          explanation: symmetryName + '에 대한 대칭이동: $' + correctAnswer + '$'
        };
      }
    },

    // 두 점 사이의 거리 (축에 평행한 경우)
    _distanceTwoPoints: function(difficulty, type) {
      var range = 8;
      // 축에 평행한 두 점 (같은 x 또는 같은 y)
      var parallel = utils.randChoice(['horizontal', 'vertical']);
      var x1, y1, x2, y2;

      if (parallel === 'horizontal') {
        y1 = utils.randIntNonZero(-range, range);
        y2 = y1;
        x1 = utils.randIntNonZero(-range, range);
        x2 = utils.randIntNonZero(-range, range);
        while (x2 === x1) x2 = utils.randIntNonZero(-range, range);
      } else {
        x1 = utils.randIntNonZero(-range, range);
        x2 = x1;
        y1 = utils.randIntNonZero(-range, range);
        y2 = utils.randIntNonZero(-range, range);
        while (y2 === y1) y2 = utils.randIntNonZero(-range, range);
      }

      var correctAnswer = parallel === 'horizontal'
        ? Math.abs(x2 - x1)
        : Math.abs(y2 - y1);

      var gridRange = Math.max(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2)) + 1;
      var svgStr = drawTwoPointsOnGrid(x1, y1, x2, y2, 'A', 'B', gridRange);

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(correctAnswer, 3, function() {
          return utils.randChoice([
            correctAnswer + 1, correctAnswer - 1, correctAnswer + 2,
            Math.abs(x2 + x1), Math.abs(y2 + y1)
          ].filter(function(d) { return d > 0 && d !== correctAnswer; }));
        });

        var choices = [String(correctAnswer)].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(correctAnswer + choices.length + 1));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(correctAnswer));

        return {
          type: type,
          questionText: '두 점 $A(' + x1 + ',\\, ' + y1 + ')$, $B(' + x2 + ',\\, ' + y2 + ')$ 사이의 거리를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: String(correctAnswer),
          answerIndex: correctIndex,
          explanation: parallel === 'horizontal'
            ? '두 점의 $y$ 좌표가 같으므로 거리는 $|' + x2 + ' - (' + x1 + ')| = ' + correctAnswer + '$입니다.'
            : '두 점의 $x$ 좌표가 같으므로 거리는 $|' + y2 + ' - (' + y1 + ')| = ' + correctAnswer + '$입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '두 점 $A(' + x1 + ',\\, ' + y1 + ')$, $B(' + x2 + ',\\, ' + y2 + ')$ 사이의 거리를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: String(correctAnswer),
          answerIndex: null,
          explanation: parallel === 'horizontal'
            ? '두 점의 $y$ 좌표가 같으므로 거리는 $|' + x2 + ' - (' + x1 + ')| = ' + correctAnswer + '$입니다.'
            : '두 점의 $x$ 좌표가 같으므로 거리는 $|' + y2 + ' - (' + y1 + ')| = ' + correctAnswer + '$입니다.'
        };
      }
    },

    // 중점 구하기
    _midpoint: function(difficulty, type) {
      // 역생성: 중점이 정수 좌표가 되도록
      var mx = utils.randIntNonZero(-5, 5);
      var my = utils.randIntNonZero(-5, 5);

      var dx = utils.randInt(1, 4);
      var dy = utils.randInt(1, 4);

      var x1 = mx - dx;
      var y1 = my - dy;
      var x2 = mx + dx;
      var y2 = my + dy;

      var correctAnswer = '(' + mx + ', ' + my + ')';

      var gridRange = Math.max(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2)) + 1;
      var svgStr = drawTwoPointsOnGrid(x1, y1, x2, y2, 'A', 'B', gridRange);

      if (type === 'multiple-choice') {
        var choices = [correctAnswer];
        // 오답: 좌표를 더하기만 함
        choices.push('(' + (x1 + x2) + ', ' + (y1 + y2) + ')');
        // 오답: 뺄셈
        choices.push('(' + (mx + 1) + ', ' + (my - 1) + ')');
        // 오답: 부호 실수
        choices.push('(' + (-mx) + ', ' + my + ')');

        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push('(' + (mx + choices.length) + ', ' + my + ')');
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(correctAnswer);

        return {
          type: type,
          questionText: '두 점 $A(' + x1 + ',\\, ' + y1 + ')$, $B(' + x2 + ',\\, ' + y2 + ')$의 중점의 좌표를 구하시오.',
          questionLatex: null,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '중점 공식: $\\left(\\frac{' + x1 + '+' + x2 + '}{2},\\, \\frac{' + y1 + '+' + y2 + '}{2}\\right) = ' + correctAnswer + '$'
        };
      } else {
        return {
          type: type,
          questionText: '두 점 $A(' + x1 + ',\\, ' + y1 + ')$, $B(' + x2 + ',\\, ' + y2 + ')$의 중점의 좌표를 구하시오. (예: (3, -2))',
          questionLatex: null,
          svg: svgStr,
          choices: null,
          answer: mx + ', ' + my,
          answerIndex: null,
          explanation: '중점 공식: $\\left(\\frac{' + x1 + '+' + x2 + '}{2},\\, \\frac{' + y1 + '+' + y2 + '}{2}\\right) = ' + correctAnswer + '$'
        };
      }
    },

    // 사분면 조건 문제 (a, b 부호 조건에서 사분면 판별)
    _quadrantConditions: function(difficulty, type) {
      // "a > 0, b < 0일 때, 점 (a, -b)는 어느 사분면?"
      var aSign = utils.randChoice([1, -1]);
      var bSign = utils.randChoice([1, -1]);

      // 변환 유형 선택
      var transforms = [
        { expr: '(a, b)', xSign: aSign, ySign: bSign },
        { expr: '(-a, b)', xSign: -aSign, ySign: bSign },
        { expr: '(a, -b)', xSign: aSign, ySign: -bSign },
        { expr: '(-a, -b)', xSign: -aSign, ySign: -bSign },
        { expr: '(b, a)', xSign: bSign, ySign: aSign },
        { expr: '(-b, a)', xSign: -bSign, ySign: aSign }
      ];
      var transform = utils.randChoice(transforms);

      var quadrant = getQuadrant(transform.xSign, transform.ySign);
      // 축 위가 되는 경우를 피함
      if (quadrant === 0) {
        transform = transforms[0];
        quadrant = getQuadrant(transform.xSign, transform.ySign);
      }

      var correctAnswer = quadrantName(quadrant);

      var aCondition = aSign > 0 ? 'a > 0' : 'a < 0';
      var bCondition = bSign > 0 ? 'b > 0' : 'b < 0';

      if (type === 'multiple-choice') {
        var choices = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
        var correctIndex = quadrant - 1;

        return {
          type: type,
          questionText: '$' + aCondition + '$, $' + bCondition + '$일 때, 점 $' + transform.expr + '$은 어느 사분면 위의 점인지 구하시오.',
          questionLatex: null,
          svg: null,
          choices: choices,
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '$' + aCondition + '$이므로 ' + (aSign > 0 ? '$a$는 양수' : '$a$는 음수') + ', $' + bCondition + '$이므로 ' + (bSign > 0 ? '$b$는 양수' : '$b$는 음수') + '입니다. 따라서 점 $' + transform.expr + '$의 $x$ 좌표는 ' + (transform.xSign > 0 ? '양수' : '음수') + ', $y$ 좌표는 ' + (transform.ySign > 0 ? '양수' : '음수') + '이므로 ' + correctAnswer + '입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '$' + aCondition + '$, $' + bCondition + '$일 때, 점 $' + transform.expr + '$은 제 몇 사분면 위의 점인지 구하시오.',
          questionLatex: null,
          svg: null,
          choices: null,
          answer: String(quadrant),
          answerIndex: null,
          explanation: '$' + aCondition + '$이므로 ' + (aSign > 0 ? '$a$는 양수' : '$a$는 음수') + ', $' + bCondition + '$이므로 ' + (bSign > 0 ? '$b$는 양수' : '$b$는 음수') + '입니다. 따라서 ' + correctAnswer + '입니다.'
        };
      }
    }
  };
})();
