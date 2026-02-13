// 중3 - 삼각비
(function() {
  var utils = MathQuiz.utils;
  var svgHelper = MathQuiz.svg;

  // LaTeX 수식을 SVG 텍스트용 유니코드로 변환
  function svgSafeLabel(s) {
    return String(s).replace(/\\sqrt\{(\d+)\}/g, '\u221A$1');
  }

  // 특수각 삼각비 테이블
  var SPECIAL = {
    30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{\\sqrt{3}}{3}', sinVal: 0.5, cosVal: 0.866, tanVal: 0.577 },
    45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1', sinVal: 0.707, cosVal: 0.707, tanVal: 1 },
    60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}', sinVal: 0.866, cosVal: 0.5, tanVal: 1.732 }
  };

  // 직각삼각형 SVG 생성 (직각이 B에 위치)
  function makeRightTriangleSVG(labels) {
    // A(top-left), B(bottom-left, right angle), C(bottom-right)
    var ax = 50, ay = 30;
    var bx = 50, by = 180;
    var cx = 200, cy = 180;

    var s = svgHelper.open(250, 210);
    s += svgHelper.polygon([[ax, ay], [bx, by], [cx, cy]], { fill: '#f0f6ff' });
    s += svgHelper.rightAngle(bx, by, ax, ay, cx, cy, 14);

    // 꼭짓점 레이블
    if (labels.A) s += svgHelper.text(ax - 15, ay - 5, labels.A);
    if (labels.B) s += svgHelper.text(bx - 15, by + 16, labels.B);
    if (labels.C) s += svgHelper.text(cx + 10, cy + 16, labels.C);

    // 변 레이블 (LaTeX → 유니코드 변환)
    if (labels.AB) s += svgHelper.text(ax - 25, (ay + by) / 2, svgSafeLabel(labels.AB), { fontSize: 13 });
    if (labels.BC) s += svgHelper.text((bx + cx) / 2, by + 20, svgSafeLabel(labels.BC), { fontSize: 13 });
    if (labels.AC) s += svgHelper.text((ax + cx) / 2 + 12, (ay + cy) / 2 - 8, svgSafeLabel(labels.AC), { fontSize: 13 });

    // 각도 표시 (빗변과 겹치지 않도록 AB쪽으로 배치)
    if (labels.angleA) {
      s += svgHelper.arc(ax, ay, 20, 270, 315, { stroke: '#e74c3c' });
      s += svgHelper.text(ax + 12, ay + 34, labels.angleA, { fontSize: 11, fill: '#e74c3c', anchor: 'start' });
    }
    if (labels.angleC) {
      s += svgHelper.arc(cx, cy, 20, 135, 180, { stroke: '#e74c3c' });
      s += svgHelper.text(cx - 30, cy - 10, labels.angleC, { fontSize: 11, fill: '#e74c3c' });
    }

    s += svgHelper.close();
    return s;
  }

  MathQuiz.generators['grade3-trigonometric-ratio'] = {
    meta: {
      grade: 3,
      topic: '삼각비',
      topicId: 'trigonometric-ratio',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['special-angle-value', 'identify-ratio', 'basic-triangle'];
      } else if (difficulty === 2) {
        subTypes = ['find-side', 'find-angle-side', 'ratio-relation', 'special-angle-value', 'basic-triangle'];
      } else {
        subTypes = ['applied-height', 'combined-ratios', 'area-triangle', 'find-side', 'find-angle-side'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;
      var svgDiagram = null;

      switch (subType) {

        // ===== 난이도 1 =====
        case 'special-angle-value': {
          // 특수각의 삼각비 값 구하기
          var angle = utils.randChoice([30, 45, 60]);
          var func = utils.randChoice(['sin', 'cos', 'tan']);
          var data = SPECIAL[angle];

          questionText = '$\\' + func + '\\,' + angle + '^\\circ$ 의 값을 구하시오.';
          questionLatex = '\\' + func + '\\,' + angle + '^\\circ';
          answer = '$' + data[func] + '$';
          explanation = '$\\' + func + '\\,' + angle + '^\\circ = ' + data[func] + '$ 입니다.';

          if (type === 'multiple-choice') {
            // 다른 특수각/함수 값으로 오답 생성
            var allAngles = [30, 45, 60];
            var allFuncs = ['sin', 'cos', 'tan'];
            var distractorSet = [];
            for (var i = 0; i < allAngles.length; i++) {
              for (var j = 0; j < allFuncs.length; j++) {
                var val = '$' + SPECIAL[allAngles[i]][allFuncs[j]] + '$';
                if (val !== answer && distractorSet.indexOf(val) === -1) {
                  distractorSet.push(val);
                }
              }
            }
            distractorSet = utils.shuffle(distractorSet).slice(0, 3);
            choices = [answer].concat(distractorSet);
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'identify-ratio': {
          // 직각삼각형에서 삼각비 식별
          var angle = utils.randChoice([30, 60]);
          var func = utils.randChoice(['sin', 'cos', 'tan']);

          var labels = { A: 'A', B: 'B', C: 'C' };
          labels.angleA = angle + '°';

          // 직각이 B: AB=높이(인접), BC=밑변, AC=빗변
          // A각도 기준: sin=BC/AC(대변/빗변), cos=AB/AC(인접/빗변), tan=BC/AB(대변/인접)
          svgDiagram = makeRightTriangleSVG(labels);

          var ratioDesc;
          if (func === 'sin') ratioDesc = '\\frac{BC}{AC}';
          else if (func === 'cos') ratioDesc = '\\frac{AB}{AC}';
          else ratioDesc = '\\frac{BC}{AB}';

          questionText = '아래 직각삼각형에서 $\\angle B = 90^\\circ$ 일 때, $\\' + func + '\\,A$ 를 변의 비로 나타내시오.';
          questionLatex = '\\' + func + '\\,A';
          answer = '$' + ratioDesc + '$';
          explanation = '$\\angle B = 90^\\circ$ 인 직각삼각형 $ABC$ 에서 $\\angle A$ 에 대해\n';
          explanation += '$\\sin A = \\frac{\\text{대변}}{\\text{빗변}} = \\frac{BC}{AC}$, ';
          explanation += '$\\cos A = \\frac{\\text{인접변}}{\\text{빗변}} = \\frac{AB}{AC}$, ';
          explanation += '$\\tan A = \\frac{\\text{대변}}{\\text{인접변}} = \\frac{BC}{AB}$ 이므로 ';
          explanation += '$\\' + func + '\\,A = ' + ratioDesc + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$\\frac{BC}{AC}$',
              '$\\frac{AB}{AC}$',
              '$\\frac{BC}{AB}$',
              '$\\frac{AB}{BC}$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'basic-triangle': {
          // 변의 길이가 주어진 직각삼각형에서 삼각비 구하기
          // 피타고라스 삼조수 사용
          var triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]];
          var triple = utils.randChoice(triples);
          var a = triple[0]; // 대변 (BC)
          var b = triple[1]; // 인접변 (AB)
          var c = triple[2]; // 빗변 (AC)
          var func = utils.randChoice(['sin', 'cos', 'tan']);

          var labels = {
            A: 'A', B: 'B', C: 'C',
            AB: String(b), BC: String(a), AC: String(c)
          };
          svgDiagram = makeRightTriangleSVG(labels);

          var numVal, denVal;
          if (func === 'sin') { numVal = a; denVal = c; }
          else if (func === 'cos') { numVal = b; denVal = c; }
          else { numVal = a; denVal = b; }

          var frac = utils.simplifyFraction(numVal, denVal);
          var ansLatex = utils.fractionToLatex(numVal, denVal);

          questionText = '아래 직각삼각형 $ABC$ 에서 $\\angle B = 90^\\circ$ 일 때, $\\' + func + '\\,A$ 의 값을 구하시오.';
          questionLatex = '\\' + func + '\\,A';
          answer = '$' + ansLatex + '$';
          explanation = '$\\' + func + '\\,A = ';
          if (func === 'sin') explanation += '\\frac{BC}{AC} = \\frac{' + a + '}{' + c + '}';
          else if (func === 'cos') explanation += '\\frac{AB}{AC} = \\frac{' + b + '}{' + c + '}';
          else explanation += '\\frac{BC}{AB} = \\frac{' + a + '}{' + b + '}';
          if (frac.num !== numVal || frac.den !== denVal) {
            explanation += ' = ' + ansLatex;
          }
          explanation += '$ 입니다.';

          if (type === 'multiple-choice') {
            var wrong1 = utils.fractionToLatex(denVal, numVal);
            var wrong2 = utils.fractionToLatex(a, b);
            var wrong3 = utils.fractionToLatex(b, c);
            if (wrong2 === ansLatex) wrong2 = utils.fractionToLatex(b, a);
            if (wrong3 === ansLatex) wrong3 = utils.fractionToLatex(a + 1, c);
            choices = ['$' + ansLatex + '$', '$' + wrong1 + '$', '$' + wrong2 + '$', '$' + wrong3 + '$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'find-side': {
          // 한 변과 각도로 다른 변 구하기
          var angle = utils.randChoice([30, 45, 60]);
          var known = utils.randChoice(['hypotenuse', 'adjacent', 'opposite']);
          var find = utils.randChoice(['sin', 'cos', 'tan']);

          var hyp, adj, opp;
          if (angle === 30) {
            // 30-60-90: opp=a, adj=a√3, hyp=2a
            var a = utils.randChoice([2, 3, 4, 5, 6, 8, 10]);
            opp = a;
            adj = a + '\\sqrt{3}';
            hyp = 2 * a;
          } else if (angle === 45) {
            // 45-45-90: opp=adj=a, hyp=a√2
            var a = utils.randChoice([2, 3, 4, 5, 6, 7]);
            opp = a;
            adj = a;
            hyp = a + '\\sqrt{2}';
          } else {
            // 60-30-90: opp=a√3, adj=a, hyp=2a
            var a = utils.randChoice([2, 3, 4, 5, 6, 8]);
            opp = a + '\\sqrt{3}';
            adj = a;
            hyp = 2 * a;
          }

          // sin A = opp / hyp 관계에서 빗변이 주어지면 대변 구하기
          var givenSide, findSide, givenVal, findVal;
          if (known === 'hypotenuse') {
            givenSide = 'AC (빗변)';
            givenVal = String(hyp);
            findSide = 'BC (대변)';
            findVal = String(opp);
            questionText = '직각삼각형 $ABC$ 에서 $\\angle B=90^\\circ$, $\\angle A=' + angle + '^\\circ$, $AC=' + hyp + '$ 일 때, $BC$ 의 길이를 구하시오.';
            explanation = '$\\sin ' + angle + '^\\circ = \\frac{BC}{AC}$ 이므로 $BC = AC \\cdot \\sin ' + angle + '^\\circ = ' + hyp + ' \\times ' + SPECIAL[angle].sin + ' = ' + opp + '$ 입니다.';
          } else if (known === 'adjacent') {
            givenSide = 'AB (인접변)';
            givenVal = String(adj);
            findSide = 'BC (대변)';
            findVal = String(opp);
            questionText = '직각삼각형 $ABC$ 에서 $\\angle B=90^\\circ$, $\\angle A=' + angle + '^\\circ$, $AB=' + adj + '$ 일 때, $BC$ 의 길이를 구하시오.';
            explanation = '$\\tan ' + angle + '^\\circ = \\frac{BC}{AB}$ 이므로 $BC = AB \\cdot \\tan ' + angle + '^\\circ = ' + adj + ' \\times ' + SPECIAL[angle].tan + ' = ' + opp + '$ 입니다.';
          } else {
            givenSide = 'BC (대변)';
            givenVal = String(opp);
            findSide = 'AC (빗변)';
            findVal = String(hyp);
            questionText = '직각삼각형 $ABC$ 에서 $\\angle B=90^\\circ$, $\\angle A=' + angle + '^\\circ$, $BC=' + opp + '$ 일 때, $AC$ 의 길이를 구하시오.';
            explanation = '$\\sin ' + angle + '^\\circ = \\frac{BC}{AC}$ 이므로 $AC = \\frac{BC}{\\sin ' + angle + '^\\circ} = \\frac{' + opp + '}{' + SPECIAL[angle].sin + '} = ' + hyp + '$ 입니다.';
          }

          var labelsForSVG = { A: 'A', B: 'B', C: 'C', angleA: angle + '°' };
          if (known === 'hypotenuse') {
            labelsForSVG.AC = String(hyp);
            labelsForSVG.BC = '?';
          } else if (known === 'adjacent') {
            labelsForSVG.AB = String(adj);
            labelsForSVG.BC = '?';
          } else {
            labelsForSVG.BC = String(opp);
            labelsForSVG.AC = '?';
          }
          svgDiagram = makeRightTriangleSVG(labelsForSVG);

          questionLatex = null;
          answer = '$' + findVal + '$';

          if (type === 'multiple-choice') {
            // findVal에서 계수 조작으로 오답 생성
            var dists = ['$' + hyp + '$', '$' + opp + '$', '$' + adj + '$'];
            dists = dists.filter(function(d) { return d !== answer; });
            dists.push('$' + (typeof hyp === 'number' ? hyp + 2 : hyp.replace(/(\d+)/, function(m) { return parseInt(m) + 2; })) + '$');
            dists = dists.slice(0, 3);
            choices = [answer].concat(dists);
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-angle-side': {
          // 두 변이 주어지고 삼각비로 각도 추정
          var triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]];
          var triple = utils.randChoice(triples);
          var oppSide = triple[0];
          var adjSide = triple[1];
          var hypSide = triple[2];
          var func = utils.randChoice(['sin', 'cos', 'tan']);

          var labels = { A: 'A', B: 'B', C: 'C', AB: String(adjSide), BC: String(oppSide), AC: String(hypSide) };
          svgDiagram = makeRightTriangleSVG(labels);

          var ratioNum, ratioDen;
          if (func === 'sin') { ratioNum = oppSide; ratioDen = hypSide; }
          else if (func === 'cos') { ratioNum = adjSide; ratioDen = hypSide; }
          else { ratioNum = oppSide; ratioDen = adjSide; }

          var ansLatex = utils.fractionToLatex(ratioNum, ratioDen);

          questionText = '오른쪽 직각삼각형에서 $\\angle B=90^\\circ$ 일 때, $\\' + func + '\\,A$ 의 값을 구하시오.';
          questionLatex = '\\' + func + '\\,A';
          answer = '$' + ansLatex + '$';
          explanation = '$\\' + func + '\\,A = ';
          if (func === 'sin') explanation += '\\frac{BC}{AC} = \\frac{' + oppSide + '}{' + hypSide + '}';
          else if (func === 'cos') explanation += '\\frac{AB}{AC} = \\frac{' + adjSide + '}{' + hypSide + '}';
          else explanation += '\\frac{BC}{AB} = \\frac{' + oppSide + '}{' + adjSide + '}';
          explanation += ' = ' + ansLatex + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + ansLatex + '$',
              '$' + utils.fractionToLatex(ratioDen, ratioNum) + '$',
              '$' + utils.fractionToLatex(oppSide, adjSide) + '$',
              '$' + utils.fractionToLatex(adjSide, oppSide) + '$'
            ];
            // 중복 제거 후 부족분 보충
            var unique = [];
            var seen = {};
            for (var i = 0; i < choices.length; i++) {
              if (!seen[choices[i]]) { seen[choices[i]] = true; unique.push(choices[i]); }
            }
            while (unique.length < 4) {
              unique.push('$' + utils.fractionToLatex(oppSide + 1, hypSide) + '$');
            }
            choices = utils.shuffle(unique);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'ratio-relation': {
          var angle = utils.randChoice([30, 45, 60]);
          var variant = utils.randInt(1, 4);
          if (variant === 1) {
            // sin²θ + cos²θ = 1
            questionText = '$\\sin^2 ' + angle + '^\\circ + \\cos^2 ' + angle + '^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\sin^2 ' + angle + '^\\circ + \\cos^2 ' + angle + '^\\circ';
            answer = '$1$';
            explanation = '삼각비의 기본 성질에 의해 $\\sin^2\\theta + \\cos^2\\theta = 1$ 이므로 $\\sin^2 ' + angle + '^\\circ + \\cos^2 ' + angle + '^\\circ = 1$ 입니다.';
            if (type === 'multiple-choice') {
              choices = ['$1$', '$0$', '$\\frac{1}{2}$', '$2$'];
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          } else if (variant === 2) {
            // sinθ × cosθ 계산
            var data = SPECIAL[angle];
            var products = { 30: '\\frac{\\sqrt{3}}{4}', 45: '\\frac{1}{2}', 60: '\\frac{\\sqrt{3}}{4}' };
            questionText = '$\\sin ' + angle + '^\\circ \\times \\cos ' + angle + '^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\sin ' + angle + '^\\circ \\times \\cos ' + angle + '^\\circ';
            answer = '$' + products[angle] + '$';
            explanation = '$\\sin ' + angle + '^\\circ \\times \\cos ' + angle + '^\\circ = ' + data.sin + ' \\times ' + data.cos + ' = ' + products[angle] + '$ 입니다.';
            if (type === 'multiple-choice') {
              choices = ['$' + products[angle] + '$', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$\\frac{1}{4}$'];
              var seen = {};
              choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
              while (choices.length < 4) choices.push('$\\frac{3}{4}$');
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          } else if (variant === 3) {
            // sin30°cos60° + cos30°sin60° = sin90° = 1
            questionText = '$\\sin 30^\\circ \\cos 60^\\circ + \\cos 30^\\circ \\sin 60^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\sin 30^\\circ \\cos 60^\\circ + \\cos 30^\\circ \\sin 60^\\circ';
            answer = '$1$';
            explanation = '$\\sin 30^\\circ \\cos 60^\\circ + \\cos 30^\\circ \\sin 60^\\circ = \\frac{1}{2} \\times \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\times \\frac{\\sqrt{3}}{2} = \\frac{1}{4} + \\frac{3}{4} = 1$ 입니다.';
            if (type === 'multiple-choice') {
              choices = ['$1$', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$0$'];
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          } else {
            // tan²θ 값 계산
            var tanSq = { 30: '\\frac{1}{3}', 45: '1', 60: '3' };
            questionText = '$\\tan^2 ' + angle + '^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\tan^2 ' + angle + '^\\circ';
            answer = '$' + tanSq[angle] + '$';
            explanation = '$\\tan^2 ' + angle + '^\\circ = (' + SPECIAL[angle].tan + ')^2 = ' + tanSq[angle] + '$ 입니다.';
            if (type === 'multiple-choice') {
              choices = ['$' + tanSq[angle] + '$', '$\\frac{1}{3}$', '$1$', '$3$'];
              var seen2 = {};
              choices = choices.filter(function(c) { if (seen2[c]) return false; seen2[c] = true; return true; });
              while (choices.length < 4) choices.push('$\\frac{\\sqrt{3}}{3}$');
              choices = utils.shuffle(choices);
              answerIndex = choices.indexOf(answer);
            }
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'applied-height': {
          // 높이 구하기 응용: 나무/건물 높이
          var angle = utils.randChoice([30, 45, 60]);
          var dist = utils.randChoice([10, 20, 30, 40, 50]);
          var eyeHeight = utils.randChoice([1, 1.5, 2]);

          // tan(angle) = (height - eyeHeight) / dist
          var tanVal;
          if (angle === 30) tanVal = '\\frac{\\sqrt{3}}{3}';
          else if (angle === 45) tanVal = '1';
          else tanVal = '\\sqrt{3}';

          var heightAboveEye;
          if (angle === 30) heightAboveEye = dist + '\\cdot\\frac{\\sqrt{3}}{3} = \\frac{' + dist + '\\sqrt{3}}{3}';
          else if (angle === 45) heightAboveEye = String(dist);
          else heightAboveEye = dist + '\\sqrt{3}';

          var totalHeight;
          if (angle === 45) {
            totalHeight = String(dist + eyeHeight);
          } else if (angle === 30) {
            totalHeight = '\\frac{' + dist + '\\sqrt{3}}{3}+' + eyeHeight;
          } else {
            totalHeight = dist + '\\sqrt{3}+' + eyeHeight;
          }

          questionText = '지면에서 $' + eyeHeight + '$ m 높이의 눈으로 나무 꼭대기를 올려다본 각도가 $' + angle + '^\\circ$ 이고, 나무까지의 수평 거리가 $' + dist + '$ m일 때, 나무의 높이를 구하시오.';
          questionLatex = null;
          answer = '$' + totalHeight + '$ m';
          explanation = '$\\tan ' + angle + '^\\circ = \\frac{h}{' + dist + '}$ 에서 눈 높이 위의 나무 높이 $h = ' + dist + ' \\times \\tan ' + angle + '^\\circ = ' + heightAboveEye + '$ (m)이고, 눈 높이 $' + eyeHeight + '$ m를 더하면 전체 높이는 $' + totalHeight + '$ m 입니다.';

          if (type === 'multiple-choice') {
            var w1, w2, w3;
            if (angle === 45) {
              w1 = '$' + dist + '$ m';
              w2 = '$' + (dist + eyeHeight + 5) + '$ m';
              w3 = '$' + (2 * dist) + '$ m';
            } else {
              w1 = '$' + dist + '\\sqrt{3}$ m';
              w2 = '$\\frac{' + dist + '}{\\sqrt{3}}$ m';
              w3 = '$' + (dist + eyeHeight) + '$ m';
            }
            choices = [answer, w1, w2, w3];
            // 중복 방지
            var seen = {};
            seen[answer] = true;
            choices = choices.filter(function(c) {
              if (seen[c] && c !== answer) return false;
              seen[c] = true;
              return true;
            });
            var _safe = 0;
            while (choices.length < 4 && _safe++ < 20) {
              choices.push('$' + (dist * 2 + eyeHeight) + '$ m');
            }
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'combined-ratios': {
          // 삼각비 조합 계산: 예) sin30°cos60° + cos30°sin60°
          var a1 = 30, a2 = 60;
          var opType = utils.randChoice(['product-sum', 'product-diff', 'square-sum']);

          if (opType === 'product-sum') {
            // sin30cos60 + cos30sin60 = sin90 = 1
            questionText = '$\\sin ' + a1 + '^\\circ \\cos ' + a2 + '^\\circ + \\cos ' + a1 + '^\\circ \\sin ' + a2 + '^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\sin ' + a1 + '^\\circ \\cos ' + a2 + '^\\circ + \\cos ' + a1 + '^\\circ \\sin ' + a2 + '^\\circ';
            answer = '$1$';
            explanation = '$\\sin ' + a1 + '^\\circ \\cos ' + a2 + '^\\circ + \\cos ' + a1 + '^\\circ \\sin ' + a2 + '^\\circ = \\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = \\frac{1}{4} + \\frac{3}{4} = 1$ 입니다.';
          } else if (opType === 'product-diff') {
            // cos30cos60 + sin30sin60 = cos(30) = √3/2... actually = cos(60-30) = cos30 = √3/2
            // Let's do: sin60cos30 - cos60sin30 = sin(60-30) = sin30 = 1/2
            questionText = '$\\sin 60^\\circ \\cos 30^\\circ - \\cos 60^\\circ \\sin 30^\\circ$ 의 값을 구하시오.';
            questionLatex = '\\sin 60^\\circ \\cos 30^\\circ - \\cos 60^\\circ \\sin 30^\\circ';
            answer = '$\\frac{1}{2}$';
            explanation = '$\\sin 60^\\circ \\cos 30^\\circ - \\cos 60^\\circ \\sin 30^\\circ = \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} - \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$ 입니다.';
          } else {
            // (sin45)² + (cos45)² = 1
            // 다른 거: 2sin45cos45 = 2 * √2/2 * √2/2 = 1
            questionText = '$2\\sin 45^\\circ \\cos 45^\\circ$ 의 값을 구하시오.';
            questionLatex = '2\\sin 45^\\circ \\cos 45^\\circ';
            answer = '$1$';
            explanation = '$2\\sin 45^\\circ \\cos 45^\\circ = 2 \\times \\frac{\\sqrt{2}}{2} \\times \\frac{\\sqrt{2}}{2} = 2 \\times \\frac{2}{4} = 1$ 입니다.';
          }

          if (type === 'multiple-choice') {
            choices = ['$1$', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$0$'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'area-triangle': {
          // 삼각형 넓이 = (1/2)ab sinC
          var angle = utils.randChoice([30, 60]);
          var side1 = utils.randChoice([4, 6, 8, 10]);
          var side2 = utils.randChoice([3, 5, 6, 7]);

          var sinLatex = SPECIAL[angle].sin;
          var areaStr;
          if (angle === 30) {
            // area = (1/2)*a*b*(1/2) = ab/4
            var area = side1 * side2 / 4;
            areaStr = String(area);
          } else {
            // area = (1/2)*a*b*(√3/2) = ab√3/4
            var numPart = side1 * side2;
            var g = utils.gcd(numPart, 4);
            if (numPart / g === 1) {
              areaStr = '\\frac{\\sqrt{3}}{' + (4 / g) + '}';
            } else if (4 / g === 1) {
              areaStr = (numPart / g) + '\\sqrt{3}';
            } else {
              areaStr = '\\frac{' + (numPart / g) + '\\sqrt{3}}{' + (4 / g) + '}';
            }
          }

          questionText = '삼각형 $ABC$ 에서 $AB=' + side1 + '$, $AC=' + side2 + '$, $\\angle A=' + angle + '^\\circ$ 일 때, 삼각형의 넓이를 구하시오.';
          questionLatex = 'S = \\frac{1}{2} \\cdot ' + side1 + ' \\cdot ' + side2 + ' \\cdot \\sin ' + angle + '^\\circ';
          answer = '$' + areaStr + '$';
          explanation = '넓이 $S = \\frac{1}{2} \\times AB \\times AC \\times \\sin A = \\frac{1}{2} \\times ' + side1 + ' \\times ' + side2 + ' \\times ' + sinLatex + ' = ' + areaStr + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + areaStr + '$',
              '$' + (side1 * side2 / 2) + '$',
              '$' + (side1 * side2) + '$',
              '$' + (side1 + side2) + '$'
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
          var n = utils.randInt(1, 12);
          var d = utils.randInt(n + 1, 15);
          return '$' + utils.fractionToLatex(n, d) + '$';
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
