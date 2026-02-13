// 중1 - 기본 도형 문제 생성기
(function() {
  var utils = MathQuiz.utils;
  var svgHelper = MathQuiz.svg;

  // 각도 표시 아크를 그리는 헬퍼 (꼭짓점, 두 변 방향, 호 반지름)
  function angleArc(vx, vy, startDeg, endDeg, radius) {
    radius = radius || 20;
    return svgHelper.arc(vx, vy, radius, startDeg, endDeg, { stroke: '#4A90D9', strokeWidth: 1.5 });
  }

  // 각도 라벨 위치 계산
  function angleLabelPos(vx, vy, startDeg, endDeg, radius) {
    var midDeg = (startDeg + endDeg) / 2;
    var rad = (midDeg * Math.PI) / 180;
    var labelR = radius + 14;
    return { x: vx + labelR * Math.cos(rad), y: vy - labelR * Math.sin(rad) };
  }

  // 보각/여각 문제용 직선 위의 각도 SVG
  function drawSupplementaryAngles(angle1, angle2, labelA, labelB) {
    var width = 320;
    var height = 180;
    var cx = 160;
    var cy = 140;

    var s = svgHelper.open(width, height);

    // 밑변 (수평선)
    s += svgHelper.line(30, cy, 290, cy, { stroke: '#333', strokeWidth: 2 });

    // 꼭짓점에서 위로 뻗는 선
    var angleDeg = angle1; // 왼쪽 각도
    var rad = (angleDeg * Math.PI) / 180;
    var lineLen = 110;
    var ex = cx + lineLen * Math.cos(rad);
    var ey = cy - lineLen * Math.sin(rad);
    s += svgHelper.line(cx, cy, ex, ey, { stroke: '#333', strokeWidth: 2 });

    // 각도 호: angle1 (왼쪽)
    s += angleArc(cx, cy, 0, angleDeg, 30);
    var pos1 = angleLabelPos(cx, cy, 0, angleDeg, 30);
    s += svgHelper.text(pos1.x, pos1.y + 4, labelA, { fontSize: 13, fill: '#4A90D9' });

    // 각도 호: angle2 (오른쪽)
    s += angleArc(cx, cy, angleDeg, 180, 25);
    var pos2 = angleLabelPos(cx, cy, angleDeg, 180, 25);
    s += svgHelper.text(pos2.x, pos2.y + 4, labelB, { fontSize: 13, fill: '#D94A4A' });

    // 꼭짓점 라벨
    s += svgHelper.text(cx, cy + 18, 'O', { fontSize: 12 });

    s += svgHelper.close();
    return s;
  }

  // 맞꼭지각 SVG
  function drawVerticalAngles(angle1, angle2) {
    var width = 320;
    var height = 260;
    var cx = 160;
    var cy = 130;

    var s = svgHelper.open(width, height);

    // 두 직선 교차
    var len = 120;
    var angleDeg = angle1;
    var rad = (angleDeg * Math.PI) / 180;

    // 직선 1 (수평)
    s += svgHelper.line(cx - len, cy, cx + len, cy, { stroke: '#333', strokeWidth: 2 });

    // 직선 2 (기울어짐)
    var dx = len * Math.cos(rad);
    var dy = len * Math.sin(rad);
    s += svgHelper.line(cx - dx, cy + dy, cx + dx, cy - dy, { stroke: '#333', strokeWidth: 2 });

    // 각도 표시: angle1 (위쪽)
    s += angleArc(cx, cy, 0, angleDeg, 30);
    var pos1 = angleLabelPos(cx, cy, 0, angleDeg, 30);
    s += svgHelper.text(pos1.x, pos1.y + 4, angle1 + '\u00B0', { fontSize: 12, fill: '#4A90D9' });

    // 맞꼭지각 표시 (반대쪽)
    s += angleArc(cx, cy, 180, 180 + angleDeg, 25);
    var pos2 = angleLabelPos(cx, cy, 180, 180 + angleDeg, 25);
    s += svgHelper.text(pos2.x, pos2.y + 4, 'x', { fontSize: 13, fill: '#D94A4A' });

    // 인접각 표시
    s += angleArc(cx, cy, angleDeg, 180, 35);
    var pos3 = angleLabelPos(cx, cy, angleDeg, 180, 35);
    s += svgHelper.text(pos3.x, pos3.y + 4, (180 - angleDeg) + '\u00B0', { fontSize: 11, fill: '#888' });

    // 교점 라벨
    s += svgHelper.text(cx - 10, cy + 20, 'O', { fontSize: 12 });

    s += svgHelper.close();
    return s;
  }

  // 두 점 사이의 수학 좌표계 각도 (SVG y축 반전 보정)
  function mathAngle(fromX, fromY, toX, toY) {
    return Math.atan2(-(toY - fromY), toX - fromX) * 180 / Math.PI;
  }

  // 각도를 0~360 범위로 정규화
  function normAngle(deg) {
    return ((deg % 360) + 360) % 360;
  }

  // 삼각형 내각의 합 SVG
  function drawTriangleAngles(a1, a2, a3, unknownIndex) {
    var width = 320;
    var height = 260;

    // 삼각형 꼭짓점
    var ax = 160, ay = 30;
    var bx = 50, by = 230;
    var cx = 270, cy = 230;

    var s = svgHelper.open(width, height);
    s += svgHelper.polygon([[ax, ay], [bx, by], [cx, cy]], { fill: '#f0f4ff' });

    var angles = [a1, a2, a3];
    var labels = ['A', 'B', 'C'];
    var vertices = [[ax, ay], [bx, by], [cx, cy]];

    var angleLabels = angles.map(function(a, i) {
      if (i === unknownIndex) return 'x';
      return a + '\u00B0';
    });

    // 각 꼭짓점에 이름 라벨 (삼각형 바깥에)
    s += svgHelper.text(ax, ay - 14, labels[0], { fontSize: 14 });
    s += svgHelper.text(bx - 18, by + 8, labels[1], { fontSize: 14 });
    s += svgHelper.text(cx + 14, cy + 8, labels[2], { fontSize: 14 });

    // 각 꼭짓점에 호 + 각도 라벨
    for (var i = 0; i < 3; i++) {
      var v = vertices[i];
      var prev = vertices[(i + 2) % 3];
      var next = vertices[(i + 1) % 3];

      var angToPrev = normAngle(mathAngle(v[0], v[1], prev[0], prev[1]));
      var angToNext = normAngle(mathAngle(v[0], v[1], next[0], next[1]));

      // 호가 삼각형 내부를 향하도록 작은 각도 방향 선택
      var startA, endA;
      var diff = normAngle(angToPrev - angToNext);
      if (diff <= 180) {
        startA = angToNext;
        endA = angToPrev;
      } else {
        startA = angToPrev;
        endA = angToNext;
      }

      var color = (i === unknownIndex) ? '#D94A4A' : '#4A90D9';
      var arcR = 24;
      s += angleArc(v[0], v[1], startA, endA, arcR);
      var pos = angleLabelPos(v[0], v[1], startA, endA, arcR);
      s += svgHelper.text(pos.x, pos.y + 4, angleLabels[i], { fontSize: 12, fill: color });
    }

    s += svgHelper.close();
    return s;
  }

  // 직각삼각형 SVG
  function drawRightTriangle(acute1, acute2) {
    var width = 320;
    var height = 280;

    // A: 직각(왼쪽 아래), B: 예각(오른쪽 아래), C: x(왼쪽 위)
    var ax = 60, ay = 240;
    var bx = 270, by = 240;
    var cx = 60, cy = 40;

    var s = svgHelper.open(width, height);
    s += svgHelper.polygon([[ax, ay], [bx, by], [cx, cy]], { fill: '#f0f4ff' });

    // 직각 표시 (ㄱ 마크만으로 충분, "90°" 텍스트 불필요)
    s += svgHelper.rightAngle(ax, ay, bx, by, cx, cy, 16);

    // 꼭짓점 라벨 (삼각형 바깥에 배치)
    s += svgHelper.text(ax - 6, ay + 22, 'A', { fontSize: 14 });
    s += svgHelper.text(bx + 12, by + 22, 'B', { fontSize: 14 });
    s += svgHelper.text(cx - 6, cy - 14, 'C', { fontSize: 14 });

    // B 각도 호 + 라벨
    var bToA = normAngle(mathAngle(bx, by, ax, ay));    // 180°
    var bToC = normAngle(mathAngle(bx, by, cx, cy));    // ~137°
    s += angleArc(bx, by, bToC, bToA, 30);
    var posB = angleLabelPos(bx, by, bToC, bToA, 30);
    s += svgHelper.text(posB.x, posB.y + 4, acute1 + '\u00B0', { fontSize: 12, fill: '#4A90D9' });

    // C 각도 호 + 라벨 (x)
    var cToA = normAngle(mathAngle(cx, cy, ax, ay));     // 270°
    var cToB = normAngle(mathAngle(cx, cy, bx, by));     // ~318°
    s += angleArc(cx, cy, cToA, cToB, 28);
    var posC = angleLabelPos(cx, cy, cToA, cToB, 28);
    s += svgHelper.text(posC.x, posC.y + 4, 'x', { fontSize: 14, fill: '#D94A4A' });

    s += svgHelper.close();
    return s;
  }

  MathQuiz.generators['grade1-basic-geometry'] = {
    meta: {
      grade: 1,
      topic: '기본 도형',
      topicId: 'basic-geometry',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var problemTypes;
      if (difficulty === 1) {
        problemTypes = ['supplementary', 'complementary', 'triangle-sum'];
      } else if (difficulty === 2) {
        problemTypes = ['supplementary', 'complementary', 'vertical-angles', 'triangle-sum', 'right-triangle'];
      } else {
        problemTypes = ['vertical-angles', 'triangle-sum-complex', 'exterior-angle', 'multi-angle'];
      }
      var problemType = utils.randChoice(problemTypes);

      switch (problemType) {
        case 'supplementary': return this._supplementary(difficulty, type);
        case 'complementary': return this._complementary(difficulty, type);
        case 'vertical-angles': return this._verticalAngles(difficulty, type);
        case 'triangle-sum': return this._triangleSum(difficulty, type);
        case 'right-triangle': return this._rightTriangle(difficulty, type);
        case 'triangle-sum-complex': return this._triangleSumComplex(difficulty, type);
        case 'exterior-angle': return this._exteriorAngle(difficulty, type);
        case 'multi-angle': return this._multiAngle(difficulty, type);
        default: return this._supplementary(difficulty, type);
      }
    },

    // 보각 (두 각의 합 = 180도)
    _supplementary: function(difficulty, type) {
      var angle1 = utils.randInt(20, 160);
      // 5의 배수로 조정 (쉬운 난이도)
      if (difficulty === 1) {
        angle1 = Math.round(angle1 / 10) * 10;
        if (angle1 <= 0) angle1 = 30;
        if (angle1 >= 180) angle1 = 150;
      }
      var angle2 = 180 - angle1;

      var svgStr = drawSupplementaryAngles(angle1, angle2, angle1 + '\u00B0', 'x');

      return this._buildAngleResult(type,
        '다음 그림에서 한 직선 위에 두 각이 있을 때, $\\angle x$의 크기를 구하시오.',
        null, svgStr, angle2, difficulty,
        '한 직선 위의 두 각의 합은 $180°$이므로 $x = 180° - ' + angle1 + '° = ' + angle2 + '°$입니다.');
    },

    // 여각 (두 각의 합 = 90도)
    _complementary: function(difficulty, type) {
      var angle1 = utils.randInt(10, 80);
      if (difficulty === 1) {
        angle1 = Math.round(angle1 / 10) * 10;
        if (angle1 <= 0) angle1 = 20;
        if (angle1 >= 90) angle1 = 70;
      }
      var angle2 = 90 - angle1;

      // 여각 SVG (직각 내부)
      var width = 280;
      var height = 200;
      var cx = 50, cy = 160;
      var s = svgHelper.open(width, height);

      // 수평선
      s += svgHelper.line(cx, cy, 260, cy, { stroke: '#333', strokeWidth: 2 });
      // 수직선
      s += svgHelper.line(cx, cy, cx, 30, { stroke: '#333', strokeWidth: 2 });
      // 직각 표시
      s += svgHelper.rightAngle(cx, cy, 260, cy, cx, 30, 12);

      // 사이 선
      var rad = (angle1 * Math.PI) / 180;
      var lineLen = 130;
      var ex = cx + lineLen * Math.cos(rad);
      var ey = cy - lineLen * Math.sin(rad);
      s += svgHelper.line(cx, cy, ex, ey, { stroke: '#333', strokeWidth: 2 });

      // 각도 호
      s += angleArc(cx, cy, 0, angle1, 35);
      var pos1 = angleLabelPos(cx, cy, 0, angle1, 35);
      s += svgHelper.text(pos1.x, pos1.y + 4, angle1 + '\u00B0', { fontSize: 12, fill: '#4A90D9' });

      s += angleArc(cx, cy, angle1, 90, 28);
      var pos2 = angleLabelPos(cx, cy, angle1, 90, 28);
      s += svgHelper.text(pos2.x, pos2.y + 4, 'x', { fontSize: 13, fill: '#D94A4A' });

      s += svgHelper.close();

      return this._buildAngleResult(type,
        '다음 그림에서 두 각이 여각(합이 $90°$)일 때, $\\angle x$의 크기를 구하시오.',
        null, s, angle2, difficulty,
        '여각의 합은 $90°$이므로 $x = 90° - ' + angle1 + '° = ' + angle2 + '°$입니다.');
    },

    // 맞꼭지각
    _verticalAngles: function(difficulty, type) {
      var angle = utils.randInt(20, 160);
      if (difficulty <= 2) {
        angle = Math.round(angle / 5) * 5;
        if (angle <= 10) angle = 30;
        if (angle >= 170) angle = 150;
      }

      var svgStr = drawVerticalAngles(angle, angle);

      return this._buildAngleResult(type,
        '다음 그림에서 두 직선이 한 점에서 만날 때, $\\angle x$의 크기를 구하시오.',
        null, svgStr, angle, difficulty,
        '맞꼭지각은 크기가 같으므로 $x = ' + angle + '°$입니다.');
    },

    // 삼각형 내각의 합
    _triangleSum: function(difficulty, type) {
      // 역생성: 세 각의 합이 180이 되도록
      var unknownIndex = utils.randInt(0, 2);
      var a1, a2, a3;

      if (difficulty === 1) {
        // 10의 배수로 깔끔한 각도
        a1 = utils.randChoice([30, 40, 50, 60, 70, 80]);
        a2 = utils.randChoice([30, 40, 50, 60, 70, 80]);
        while (a1 + a2 >= 170 || a1 + a2 <= 20) {
          a2 = utils.randChoice([30, 40, 50, 60, 70, 80]);
        }
      } else {
        a1 = utils.randInt(20, 120);
        a2 = utils.randInt(20, 140 - a1);
      }
      a3 = 180 - a1 - a2;

      var angles = [a1, a2, a3];
      var correctAnswer = angles[unknownIndex];

      var knownAngles = angles.filter(function(_, i) { return i !== unknownIndex; });

      var svgStr = drawTriangleAngles(a1, a2, a3, unknownIndex);

      return this._buildAngleResult(type,
        '다음 삼각형에서 $\\angle x$의 크기를 구하시오.',
        null, svgStr, correctAnswer, difficulty,
        '삼각형의 세 내각의 합은 $180°$이므로 $x = 180° - ' + knownAngles[0] + '° - ' + knownAngles[1] + '° = ' + correctAnswer + '°$입니다.');
    },

    // 직각삼각형
    _rightTriangle: function(difficulty, type) {
      var acute1 = utils.randInt(10, 80);
      if (difficulty <= 2) {
        acute1 = Math.round(acute1 / 5) * 5;
        if (acute1 <= 0) acute1 = 20;
        if (acute1 >= 90) acute1 = 70;
      }
      var acute2 = 90 - acute1;

      var svgStr = drawRightTriangle(acute1, acute2);

      return this._buildAngleResult(type,
        '다음 직각삼각형에서 $\\angle x$의 크기를 구하시오.',
        null, svgStr, acute2, difficulty,
        '직각삼각형의 두 예각의 합은 $90°$이므로 $x = 90° - ' + acute1 + '° = ' + acute2 + '°$입니다.');
    },

    // 복합 삼각형 각도 (식으로 표현된 각)
    _triangleSumComplex: function(difficulty, type) {
      // 각도가 식으로 주어짐: 2x, 3x+10, x-5 등
      // 역생성: x 값을 먼저 정하고 각도를 구성
      var x = utils.randInt(10, 30);

      // 패턴: ax, bx+c, 180 - ax - bx - c
      var a = utils.randInt(1, 3);
      var b = utils.randInt(1, 3);
      var c = utils.randIntNonZero(-10, 10);

      var angle1 = a * x;
      var angle2 = b * x + c;
      var angle3 = 180 - angle1 - angle2;

      // 모든 각이 양수인지 확인
      if (angle1 <= 0 || angle2 <= 0 || angle3 <= 0 || angle1 >= 180 || angle2 >= 180 || angle3 >= 180) {
        // 안전한 값으로 폴백
        x = 20;
        a = 2; b = 1; c = 10;
        angle1 = 40; angle2 = 30; angle3 = 110;
      }

      var expr1 = utils.coeffStr(a, 'x', true);
      var expr2 = utils.coeffStr(b, 'x', true) + utils.constStr(c, false);

      var questionText = '삼각형의 세 내각의 크기가 $' + expr1 + '°$, $' + expr2 + '°$, $' + angle3 + '°$일 때, $x$의 값을 구하시오.';

      // 방정식: a*x + b*x + c + angle3 = 180
      var totalCoeff = a + b;
      var totalConst = c + angle3;
      var rhs = 180 - totalConst;

      var explanation = '삼각형 내각의 합: $' + expr1 + ' + ' + expr2 + ' + ' + angle3 + ' = 180$, $' + utils.coeffStr(totalCoeff, 'x', true) + ' = ' + rhs + '$, $x = ' + x + '$';

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(x, 3, function() {
          return x + utils.randChoice([-5, -3, -2, -1, 1, 2, 3, 5]);
        });
        var choices = [String(x)].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(x + choices.length + 2));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(x));

        return {
          type: type,
          questionText: questionText,
          questionLatex: null,
          svg: null,
          choices: choices.map(function(c) { return '$x = ' + c + '$'; }),
          answer: String(x),
          answerIndex: correctIndex,
          explanation: explanation
        };
      } else {
        return {
          type: type,
          questionText: questionText,
          questionLatex: null,
          svg: null,
          choices: null,
          answer: String(x),
          answerIndex: null,
          explanation: explanation
        };
      }
    },

    // 외각 (삼각형의 한 외각 = 이웃하지 않는 두 내각의 합)
    _exteriorAngle: function(difficulty, type) {
      var a1 = utils.randInt(25, 80);
      var a2 = utils.randInt(25, 80);
      if (difficulty <= 2) {
        a1 = Math.round(a1 / 5) * 5;
        a2 = Math.round(a2 / 5) * 5;
      }
      var exterior = a1 + a2;
      var a3 = 180 - exterior; // 나머지 내각

      // 외각 SVG
      var width = 350;
      var height = 250;
      var ax = 60, ay = 40;
      var bx = 40, by = 210;
      var cx = 240, cy = 210;

      var s = svgHelper.open(width, height);

      // 삼각형
      s += svgHelper.polygon([[ax, ay], [bx, by], [cx, cy]], { fill: '#f0f4ff' });

      // C에서 연장선 (외각 표시)
      s += svgHelper.line(cx, cy, 330, cy, { stroke: '#333', strokeWidth: 2, dash: '5,5' });

      // 라벨
      s += svgHelper.text(ax - 5, ay - 10, 'A', { fontSize: 13 });
      s += svgHelper.text(bx - 18, by + 5, 'B', { fontSize: 13 });
      s += svgHelper.text(cx, cy + 20, 'C', { fontSize: 13 });

      // A 내각 호 + 라벨
      var aToB = normAngle(mathAngle(ax, ay, bx, by));
      var aToC = normAngle(mathAngle(ax, ay, cx, cy));
      var diffA = normAngle(aToB - aToC);
      var aStart = diffA <= 180 ? aToC : aToB;
      var aEnd = diffA <= 180 ? aToB : aToC;
      s += angleArc(ax, ay, aStart, aEnd, 24);
      var posA = angleLabelPos(ax, ay, aStart, aEnd, 24);
      s += svgHelper.text(posA.x, posA.y + 4, a1 + '\u00B0', { fontSize: 12, fill: '#4A90D9' });

      // B 내각 호 + 라벨
      var bToA = normAngle(mathAngle(bx, by, ax, ay));
      var bToC = normAngle(mathAngle(bx, by, cx, cy));
      var diffB = normAngle(bToA - bToC);
      var bStart = diffB <= 180 ? bToC : bToA;
      var bEnd = diffB <= 180 ? bToA : bToC;
      s += angleArc(bx, by, bStart, bEnd, 24);
      var posB = angleLabelPos(bx, by, bStart, bEnd, 24);
      s += svgHelper.text(posB.x, posB.y + 4, a2 + '\u00B0', { fontSize: 12, fill: '#4A90D9' });

      // 외각 호 + 라벨 (C에서 연장선 방향)
      var cToExt = 0; // 연장선은 오른쪽 수평 (0°)
      var cToA = normAngle(mathAngle(cx, cy, ax, ay));
      s += angleArc(cx, cy, cToExt, cToA, 26);
      var posExt = angleLabelPos(cx, cy, cToExt, cToA, 26);
      s += svgHelper.text(posExt.x, posExt.y + 4, 'x', { fontSize: 14, fill: '#D94A4A' });

      s += svgHelper.close();

      return this._buildAngleResult(type,
        '다음 그림에서 삼각형의 외각 $\\angle x$의 크기를 구하시오.',
        null, s, exterior, difficulty,
        '삼각형의 한 외각은 이웃하지 않는 두 내각의 합과 같으므로 $x = ' + a1 + '° + ' + a2 + '° = ' + exterior + '°$입니다.');
    },

    // 여러 각도를 이용한 복합 문제
    _multiAngle: function(difficulty, type) {
      // 한 점에서 만나는 여러 직선의 각도
      // 전체 합 = 360도
      var x = utils.randInt(20, 80);
      if (x % 5 !== 0) x = Math.round(x / 5) * 5;

      var a1 = utils.randInt(40, 100);
      if (a1 % 5 !== 0) a1 = Math.round(a1 / 5) * 5;
      var a2 = utils.randInt(40, 100);
      if (a2 % 5 !== 0) a2 = Math.round(a2 / 5) * 5;

      // 네 번째 각도는 360 - x - a1 - a2
      var a3 = 360 - x - a1 - a2;
      if (a3 <= 0 || a3 >= 180) {
        // 조정
        a1 = 80; a2 = 100; x = 60;
        a3 = 360 - x - a1 - a2; // = 120
      }

      // SVG: 한 점에서 나가는 4개의 반직선
      var width = 300;
      var height = 300;
      var cx = 150, cy = 150;
      var len = 110;

      var s = svgHelper.open(width, height);

      // 4개의 반직선 (누적 각도)
      var cumAngles = [0, x, x + a1, x + a1 + a2]; // 마지막까지 가면 360
      var endPoints = [];
      for (var i = 0; i < 4; i++) {
        var rad = (cumAngles[i] * Math.PI) / 180;
        var ex = cx + len * Math.cos(rad);
        var ey = cy - len * Math.sin(rad);
        endPoints.push([ex, ey]);
        s += svgHelper.line(cx, cy, ex, ey, { stroke: '#333', strokeWidth: 2 });
      }

      // 각도 라벨
      var labelAngles = [x, a1, a2, a3];
      var labelTexts = ['x', a1 + '\u00B0', a2 + '\u00B0', a3 + '\u00B0'];
      var labelColors = ['#D94A4A', '#4A90D9', '#4A90D9', '#4A90D9'];

      for (var j = 0; j < 4; j++) {
        var startA = cumAngles[j] || 0;
        var endA = (j < 3) ? cumAngles[j + 1] : 360;
        var midA = (startA + endA) / 2;
        var labelRad = (midA * Math.PI) / 180;
        var lr = 50;
        var lx = cx + lr * Math.cos(labelRad);
        var ly = cy - lr * Math.sin(labelRad);
        s += svgHelper.text(lx, ly + 4, labelTexts[j], { fontSize: 12, fill: labelColors[j] });
      }

      s += svgHelper.text(cx - 5, cy + 20, 'O', { fontSize: 12 });
      s += svgHelper.close();

      return this._buildAngleResult(type,
        '다음 그림에서 한 점 $O$ 주위의 각도의 합이 $360°$일 때, $\\angle x$의 크기를 구하시오.',
        null, s, x, difficulty,
        '한 점 주위의 각도의 합은 $360°$이므로 $x = 360° - ' + a1 + '° - ' + a2 + '° - ' + a3 + '° = ' + x + '°$입니다.');
    },

    // 각도 문제 결과 빌더 헬퍼
    _buildAngleResult: function(type, questionText, latex, svgStr, answer, difficulty, explanation) {
      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(answer, 3, function() {
          var offsets;
          if (difficulty === 1) {
            offsets = [-20, -10, 10, 20];
          } else {
            offsets = [-15, -10, -5, 5, 10, 15];
          }
          var candidate = answer + utils.randChoice(offsets);
          if (candidate <= 0) candidate = answer + 10;
          if (candidate >= 360) candidate = answer - 10;
          return candidate;
        });

        var choices = [String(answer)].concat(distractors.map(String));
        choices = utils.unique(choices).slice(0, 4);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          choices.push(String(answer + (choices.length * 5)));
        }
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(answer));

        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: svgStr,
          choices: choices.map(function(c) { return '$' + c + '°$'; }),
          answer: String(answer),
          answerIndex: correctIndex,
          explanation: explanation
        };
      } else {
        return {
          type: type,
          questionText: questionText,
          questionLatex: latex,
          svg: svgStr,
          choices: null,
          answer: String(answer),
          answerIndex: null,
          explanation: explanation
        };
      }
    }
  };
})();
