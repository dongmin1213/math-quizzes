// 중3 - 원의 성질
(function() {
  var utils = MathQuiz.utils;
  var svgHelper = MathQuiz.svg;

  // 원 다이어그램 생성 헬퍼
  function makeCircleSVG(opts) {
    opts = opts || {};
    var cx = opts.cx || 150;
    var cy = opts.cy || 150;
    var r = opts.r || 100;
    var width = opts.width || 300;
    var height = opts.height || 300;

    var s = svgHelper.open(width, height);
    s += svgHelper.circle(cx, cy, r, { fill: '#f0f6ff' });

    // 중심점
    if (opts.showCenter !== false) {
      s += svgHelper.dot(cx, cy, { r: 3, fill: '#333' });
      s += svgHelper.text(cx + 8, cy - 8, opts.centerLabel || 'O', { fontSize: 13 });
    }

    return { svg: s, cx: cx, cy: cy, r: r, width: width, height: height };
  }

  // 각도 -> 라디안 -> 원 위의 점
  function pointOnCircle(cx, cy, r, angleDeg) {
    var rad = angleDeg * Math.PI / 180;
    return {
      x: Math.round(cx + r * Math.cos(rad)),
      y: Math.round(cy - r * Math.sin(rad))
    };
  }

  // 각도 방향 계산 (수학 좌표: 0°=오른쪽, 90°=위)
  function mathAngle(x1, y1, x2, y2) {
    return Math.atan2(-(y2 - y1), x2 - x1) * 180 / Math.PI;
  }
  function normAngle(a) { return ((a % 360) + 360) % 360; }

  // 각도 호 + 라벨을 추가하는 헬퍼
  function addAngleArc(vx, vy, toX1, toY1, toX2, toY2, label, color) {
    color = color || '#4A90D9';
    var d1 = normAngle(mathAngle(vx, vy, toX1, toY1));
    var d2 = normAngle(mathAngle(vx, vy, toX2, toY2));
    // 짧은 쪽으로 호를 그림
    var diff = normAngle(d2 - d1);
    var startDeg, endDeg;
    if (diff <= 180) {
      startDeg = d1; endDeg = d2;
    } else {
      startDeg = d2; endDeg = d1;
    }
    var arcR = 18;
    var s = svgHelper.arc(vx, vy, arcR, startDeg, endDeg, { stroke: color, strokeWidth: 1.5 });
    // 라벨 위치: 호의 중간 방향으로 바깥에
    var span = normAngle(endDeg - startDeg);
    var midDeg = normAngle(startDeg + span / 2);
    var rad = midDeg * Math.PI / 180;
    var labelR = arcR + 12;
    var lx = vx + labelR * Math.cos(rad);
    var ly = vy - labelR * Math.sin(rad);
    s += svgHelper.text(lx, ly + 4, label, { fontSize: 11, fill: color });
    return s;
  }

  MathQuiz.generators['grade3-circle-properties'] = {
    meta: {
      grade: 3,
      topic: '원의 성질',
      topicId: 'circle-properties',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['central-angle', 'inscribed-angle', 'arc-central'];
      } else if (difficulty === 2) {
        subTypes = ['inscribed-central', 'tangent-length', 'tangent-angle'];
      } else {
        subTypes = ['inscribed-quadrilateral', 'tangent-secant', 'arc-length-area'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;
      var svgDiagram = null;

      switch (subType) {

        // ===== 난이도 1 =====
        case 'central-angle': {
          // 중심각과 호의 관계
          var centralAngle = utils.randChoice([40, 50, 60, 72, 80, 90, 100, 120]);
          var n = Math.floor(360 / centralAngle); // 전체에서 몇 등분

          var circle = makeCircleSVG({});
          var s = circle.svg;
          var p1 = pointOnCircle(circle.cx, circle.cy, circle.r, 0);
          var p2 = pointOnCircle(circle.cx, circle.cy, circle.r, centralAngle);

          s += svgHelper.line(circle.cx, circle.cy, p1.x, p1.y);
          s += svgHelper.line(circle.cx, circle.cy, p2.x, p2.y);
          s += svgHelper.text(p1.x + 12, p1.y + 4, 'A', { fontSize: 13 });
          s += svgHelper.text(p2.x + 8, p2.y - 8, 'B', { fontSize: 13 });
          s += addAngleArc(circle.cx, circle.cy, p1.x, p1.y, p2.x, p2.y, centralAngle + '°', '#e74c3c');
          s += svgHelper.close();
          svgDiagram = s;

          questionText = '원 $O$ 에서 중심각 $\\angle AOB = ' + centralAngle + '^\\circ$ 일 때, 호 $\\overset{\\frown}{AB}$ 에 대한 원주각의 크기를 구하시오.';
          questionLatex = '\\angle AOB = ' + centralAngle + '^\\circ';

          var inscribed = centralAngle / 2;
          answer = '$' + inscribed + '^\\circ$';
          explanation = '원주각은 중심각의 $\\frac{1}{2}$ 이므로 원주각 $= \\frac{' + centralAngle + '^\\circ}{2} = ' + inscribed + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + inscribed + '^\\circ$',
              '$' + centralAngle + '^\\circ$',
              '$' + (inscribed + 10) + '^\\circ$',
              '$' + (centralAngle - 10) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'inscribed-angle': {
          // 원주각 구하기: 같은 호에 대한 원주각은 같다
          var inscAngle = utils.randChoice([25, 30, 35, 40, 45, 50, 55]);

          var circle = makeCircleSVG({});
          var s = circle.svg;
          var pA = pointOnCircle(circle.cx, circle.cy, circle.r, 200);
          var pB = pointOnCircle(circle.cx, circle.cy, circle.r, 340);
          var pP = pointOnCircle(circle.cx, circle.cy, circle.r, 90);
          var pQ = pointOnCircle(circle.cx, circle.cy, circle.r, 120);

          s += svgHelper.line(pP.x, pP.y, pA.x, pA.y, { stroke: '#4A90D9' });
          s += svgHelper.line(pP.x, pP.y, pB.x, pB.y, { stroke: '#4A90D9' });
          s += svgHelper.line(pQ.x, pQ.y, pA.x, pA.y, { stroke: '#27ae60', dash: '5,3' });
          s += svgHelper.line(pQ.x, pQ.y, pB.x, pB.y, { stroke: '#27ae60', dash: '5,3' });
          s += svgHelper.text(pA.x - 15, pA.y + 5, 'A', { fontSize: 13 });
          s += svgHelper.text(pB.x + 8, pB.y + 5, 'B', { fontSize: 13 });
          s += svgHelper.text(pP.x - 5, pP.y - 10, 'P', { fontSize: 13 });
          s += svgHelper.text(pQ.x - 15, pQ.y - 5, 'Q', { fontSize: 13 });
          s += addAngleArc(pP.x, pP.y, pA.x, pA.y, pB.x, pB.y, inscAngle + '°', '#4A90D9');
          s += svgHelper.close();
          svgDiagram = s;

          questionText = '원 위의 네 점 $A$, $B$, $P$, $Q$ 에서 $\\angle APB = ' + inscAngle + '^\\circ$ 일 때, $\\angle AQB$ 의 크기를 구하시오.';
          questionLatex = '\\angle APB = ' + inscAngle + '^\\circ';
          answer = '$' + inscAngle + '^\\circ$';
          explanation = '같은 호 $\\overset{\\frown}{AB}$ 에 대한 원주각은 모두 같으므로 $\\angle AQB = \\angle APB = ' + inscAngle + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + inscAngle + '^\\circ$',
              '$' + (2 * inscAngle) + '^\\circ$',
              '$' + (inscAngle + 10) + '^\\circ$',
              '$' + (180 - inscAngle) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'arc-central': {
          // 호의 길이와 중심각 비례
          var r = utils.randChoice([3, 4, 5, 6]);
          var centralAngle = utils.randChoice([60, 90, 120, 180]);
          // 호의 길이 = 2πr × (θ/360)
          var fraction = utils.simplifyFraction(centralAngle, 360);
          var arcCoeff = utils.simplifyFraction(2 * r * fraction.num, fraction.den);

          var arcLatex;
          if (arcCoeff.den === 1) {
            arcLatex = arcCoeff.num + '\\pi';
          } else {
            arcLatex = '\\frac{' + arcCoeff.num + '\\pi}{' + arcCoeff.den + '}';
          }

          questionText = '반지름이 $' + r + '$ 인 원에서 중심각이 $' + centralAngle + '^\\circ$ 인 호의 길이를 구하시오.';
          questionLatex = null;
          answer = '$' + arcLatex + '$';
          explanation = '호의 길이 $l = 2\\pi r \\times \\frac{' + centralAngle + '}{360} = 2\\pi \\times ' + r + ' \\times \\frac{' + fraction.num + '}{' + fraction.den + '} = ' + arcLatex + '$ 입니다.';

          if (type === 'multiple-choice') {
            var wrong1Coeff = utils.simplifyFraction(2 * r * fraction.num + 2, fraction.den);
            var wrong1 = wrong1Coeff.den === 1 ? wrong1Coeff.num + '\\pi' : '\\frac{' + wrong1Coeff.num + '\\pi}{' + wrong1Coeff.den + '}';
            choices = [
              '$' + arcLatex + '$',
              '$' + wrong1 + '$',
              '$' + (2 * r) + '\\pi$',
              '$' + r + '\\pi$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'inscribed-central': {
          // 원주각 ↔ 중심각 관계 활용 (중심각 구하기)
          var inscAngle = utils.randChoice([20, 25, 30, 35, 40, 45, 50, 55, 60]);
          var centralAngle = 2 * inscAngle;

          var circle = makeCircleSVG({});
          var s = circle.svg;
          var pA = pointOnCircle(circle.cx, circle.cy, circle.r, 210);
          var pB = pointOnCircle(circle.cx, circle.cy, circle.r, 330);
          var pP = pointOnCircle(circle.cx, circle.cy, circle.r, 90);

          s += svgHelper.line(pP.x, pP.y, pA.x, pA.y, { stroke: '#4A90D9' });
          s += svgHelper.line(pP.x, pP.y, pB.x, pB.y, { stroke: '#4A90D9' });
          s += svgHelper.line(circle.cx, circle.cy, pA.x, pA.y, { stroke: '#e74c3c' });
          s += svgHelper.line(circle.cx, circle.cy, pB.x, pB.y, { stroke: '#e74c3c' });
          s += svgHelper.text(pA.x - 15, pA.y + 5, 'A', { fontSize: 13 });
          s += svgHelper.text(pB.x + 8, pB.y + 5, 'B', { fontSize: 13 });
          s += svgHelper.text(pP.x - 5, pP.y - 10, 'P', { fontSize: 13 });
          s += addAngleArc(pP.x, pP.y, pA.x, pA.y, pB.x, pB.y, inscAngle + '°', '#4A90D9');
          s += svgHelper.close();
          svgDiagram = s;

          questionText = '원 $O$ 에서 원주각 $\\angle APB = ' + inscAngle + '^\\circ$ 일 때, 중심각 $\\angle AOB$ 의 크기를 구하시오.';
          questionLatex = '\\angle APB = ' + inscAngle + '^\\circ';
          answer = '$' + centralAngle + '^\\circ$';
          explanation = '중심각은 원주각의 $2$ 배이므로 $\\angle AOB = 2 \\times ' + inscAngle + '^\\circ = ' + centralAngle + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + centralAngle + '^\\circ$',
              '$' + inscAngle + '^\\circ$',
              '$' + (centralAngle + 10) + '^\\circ$',
              '$' + (inscAngle / 2) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'tangent-length': {
          // 접선의 길이: 외부점에서 두 접선 길이 같음
          var r = utils.randChoice([3, 4, 5, 6]);
          var d = utils.randChoice([5, 7, 8, 10, 13]); // 중심까지의 거리 (d > r)
          while (d <= r) { d = utils.randInt(r + 2, r + 10); }

          // 접선 길이 = √(d²-r²)
          var tangentSq = d * d - r * r;
          // 완전제곱수인지 확인
          var tangent = Math.sqrt(tangentSq);
          var isInt = (tangent === Math.floor(tangent));

          if (!isInt) {
            // 정수가 되도록 재조정 (피타고라스 삼조수)
            var triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
            var t = utils.randChoice(triples);
            r = t[0];
            tangent = t[1];
            d = t[2];
            tangentSq = tangent * tangent;
            isInt = true;
          }

          questionText = '원 $O$ 의 반지름이 $' + r + '$ 이고, 원 밖의 점 $P$ 에서 원의 중심까지의 거리가 $' + d + '$ 일 때, 점 $P$ 에서 원에 그은 접선의 길이를 구하시오.';
          questionLatex = null;
          answer = '$' + tangent + '$';
          explanation = '외부점에서 접점까지의 거리, 반지름, 중심까지의 거리는 직각삼각형을 이룹니다. 접선의 길이 $= \\sqrt{' + d + '^2 - ' + r + '^2} = \\sqrt{' + (d * d) + ' - ' + (r * r) + '} = \\sqrt{' + tangentSq + '} = ' + tangent + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + tangent + '$',
              '$' + (tangent + 1) + '$',
              '$' + (d - r) + '$',
              '$\\sqrt{' + (tangentSq + r) + '}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'tangent-angle': {
          // 접선과 반지름은 수직: ∠OTP = 90°
          var angleOPT = utils.randChoice([20, 25, 30, 35, 40, 45, 50, 55, 60]);
          var angleOTP = 90;
          var anglePOT = 90 - angleOPT;

          questionText = '원 $O$ 의 접선 $PT$ (접점 $T$)에서 $\\angle OPT = ' + angleOPT + '^\\circ$ 일 때, $\\angle POT$ 의 크기를 구하시오.';
          questionLatex = '\\angle OPT = ' + angleOPT + '^\\circ';
          answer = '$' + anglePOT + '^\\circ$';
          explanation = '접선과 반지름은 접점에서 수직이므로 $\\angle OTP = 90^\\circ$ 입니다. 삼각형 $OPT$ 에서 $\\angle POT = 180^\\circ - 90^\\circ - ' + angleOPT + '^\\circ = ' + anglePOT + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + anglePOT + '^\\circ$',
              '$' + angleOPT + '^\\circ$',
              '$' + (180 - angleOPT) + '^\\circ$',
              '$' + (90 + angleOPT) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'inscribed-quadrilateral': {
          // 원에 내접하는 사각형: 대각의 합 = 180°
          var angleA = utils.randChoice([50, 60, 65, 70, 75, 80, 85, 95, 100, 110, 120]);
          var angleC = 180 - angleA;
          var angleB = utils.randChoice([60, 70, 75, 80, 85, 90, 100, 110]);
          var angleD = 180 - angleB;

          var circle = makeCircleSVG({});
          var s = circle.svg;
          var pA = pointOnCircle(circle.cx, circle.cy, circle.r, 120);
          var pB = pointOnCircle(circle.cx, circle.cy, circle.r, 30);
          var pC = pointOnCircle(circle.cx, circle.cy, circle.r, 310);
          var pD = pointOnCircle(circle.cx, circle.cy, circle.r, 210);

          s += svgHelper.polygon([[pA.x, pA.y], [pB.x, pB.y], [pC.x, pC.y], [pD.x, pD.y]], { fill: '#f0f6ff' });
          s += svgHelper.text(pA.x - 15, pA.y - 8, 'A', { fontSize: 13 });
          s += svgHelper.text(pB.x + 8, pB.y - 8, 'B', { fontSize: 13 });
          s += svgHelper.text(pC.x + 8, pC.y + 16, 'C', { fontSize: 13 });
          s += svgHelper.text(pD.x - 15, pD.y + 16, 'D', { fontSize: 13 });
          s += addAngleArc(pA.x, pA.y, pB.x, pB.y, pD.x, pD.y, angleA + '°', '#e74c3c');
          s += svgHelper.close();
          svgDiagram = s;

          questionText = '원에 내접하는 사각형 $ABCD$ 에서 $\\angle A = ' + angleA + '^\\circ$ 일 때, $\\angle C$ 의 크기를 구하시오.';
          questionLatex = '\\angle A = ' + angleA + '^\\circ';
          answer = '$' + angleC + '^\\circ$';
          explanation = '원에 내접하는 사각형에서 대각의 합은 $180^\\circ$ 이므로 $\\angle C = 180^\\circ - ' + angleA + '^\\circ = ' + angleC + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + angleC + '^\\circ$',
              '$' + angleA + '^\\circ$',
              '$' + (360 - angleA) + '^\\circ$',
              '$' + (90 - angleA / 2) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'tangent-secant': {
          // 접선-할선 각도: ∠PAB = (1/2)(호AB)
          // 접선과 현이 이루는 각 = (1/2) × 호의 크기
          var arcAngle = utils.randChoice([60, 80, 100, 120, 140]);
          var tangentChordAngle = arcAngle / 2;

          questionText = '원 위의 점 $T$ 에서의 접선과 현 $TA$ 가 이루는 각이 호 $\\overset{\\frown}{TA}$ (작은 호)에 대응합니다. 호의 중심각이 $' + arcAngle + '^\\circ$ 일 때, 접선과 현이 이루는 각의 크기를 구하시오.';
          questionLatex = null;
          answer = '$' + tangentChordAngle + '^\\circ$';
          explanation = '접선과 현이 이루는 각은 그 호에 대한 원주각과 같으므로 $\\frac{1}{2} \\times ' + arcAngle + '^\\circ = ' + tangentChordAngle + '^\\circ$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + tangentChordAngle + '^\\circ$',
              '$' + arcAngle + '^\\circ$',
              '$' + (180 - arcAngle) + '^\\circ$',
              '$' + (tangentChordAngle + 10) + '^\\circ$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'arc-length-area': {
          // 부채꼴의 호의 길이와 넓이 종합
          var r = utils.randChoice([4, 6, 8, 10, 12]);
          var angle = utils.randChoice([60, 90, 120, 150]);
          var askType = utils.randChoice(['arc', 'area']);

          var frac = utils.simplifyFraction(angle, 360);

          if (askType === 'arc') {
            // l = 2πr × (θ/360)
            var lCoeff = utils.simplifyFraction(2 * r * frac.num, frac.den);
            var arcLatex;
            if (lCoeff.den === 1) {
              arcLatex = lCoeff.num + '\\pi';
            } else {
              arcLatex = '\\frac{' + lCoeff.num + '\\pi}{' + lCoeff.den + '}';
            }

            questionText = '반지름이 $' + r + '$ 이고 중심각이 $' + angle + '^\\circ$ 인 부채꼴의 호의 길이를 구하시오.';
            answer = '$' + arcLatex + '$';
            explanation = '$l = 2\\pi r \\times \\frac{\\theta}{360} = 2\\pi \\times ' + r + ' \\times \\frac{' + frac.num + '}{' + frac.den + '} = ' + arcLatex + '$ 입니다.';
          } else {
            // S = πr² × (θ/360)
            var aCoeff = utils.simplifyFraction(r * r * frac.num, frac.den);
            var areaLatex;
            if (aCoeff.den === 1) {
              areaLatex = aCoeff.num + '\\pi';
            } else {
              areaLatex = '\\frac{' + aCoeff.num + '\\pi}{' + aCoeff.den + '}';
            }

            questionText = '반지름이 $' + r + '$ 이고 중심각이 $' + angle + '^\\circ$ 인 부채꼴의 넓이를 구하시오.';
            answer = '$' + areaLatex + '$';
            explanation = '$S = \\pi r^2 \\times \\frac{\\theta}{360} = \\pi \\times ' + r + '^2 \\times \\frac{' + frac.num + '}{' + frac.den + '} = ' + areaLatex + '$ 입니다.';
          }

          questionLatex = null;

          if (type === 'multiple-choice') {
            var ans = answer;
            var wrongR = utils.randChoice([r + 1, r - 1, r * 2]);
            var wrongFrac = utils.simplifyFraction(angle + 30, 360);
            choices = [ans];
            // 간단한 오답 3개 생성
            if (askType === 'arc') {
              choices.push('$' + r + '\\pi$');
              choices.push('$' + (2 * r) + '\\pi$');
              var wCoeff = utils.simplifyFraction(2 * wrongR * frac.num, frac.den);
              choices.push('$' + (wCoeff.den === 1 ? wCoeff.num + '\\pi' : '\\frac{' + wCoeff.num + '\\pi}{' + wCoeff.den + '}') + '$');
            } else {
              choices.push('$' + (r * r) + '\\pi$');
              var wCoeff2 = utils.simplifyFraction(r * r * wrongFrac.num, wrongFrac.den);
              choices.push('$' + (wCoeff2.den === 1 ? wCoeff2.num + '\\pi' : '\\frac{' + wCoeff2.num + '\\pi}{' + wCoeff2.den + '}') + '$');
              choices.push('$' + (2 * r) + '\\pi$');
            }
            // 중복 제거
            var seen = {};
            choices = choices.filter(function(c) {
              if (seen[c]) return false;
              seen[c] = true;
              return true;
            });
            var _safe = 0;
            while (choices.length < 4 && _safe++ < 20) {
              choices.push('$' + (r * r + r) + '\\pi$');
            }
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(ans);
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
          return '$' + utils.randInt(10, 170) + '^\\circ$';
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
