// 중2 - 도형의 성질 (Properties of Shapes)
(function() {
  var utils = MathQuiz.utils;
  var svgHelper = MathQuiz.svg;

  // 난이도 1: 삼각형의 내각의 합, 이등변삼각형 성질
  function generateTriangleAngles() {
    var subtype = utils.randChoice(['sumAngles', 'isosceles', 'exterior']);

    if (subtype === 'sumAngles') {
      // 삼각형 내각의 합 = 180도, 한 각 구하기
      var a = utils.randInt(30, 80);
      var b = utils.randInt(30, 80);
      while (a + b >= 170) {
        b = utils.randInt(30, 80);
      }
      var c = 180 - a - b;

      var questionText = '삼각형의 세 내각의 크기가 $' + a + '^{\\circ}$, $' + b + '^{\\circ}$, $x^{\\circ}$일 때, $x$의 값을 구하시오.';
      var answer = String(c);
      var explanation = '삼각형의 내각의 합은 $180^{\\circ}$이므로\n';
      explanation += '$' + a + '^{\\circ} + ' + b + '^{\\circ} + x^{\\circ} = 180^{\\circ}$\n';
      explanation += '$x = 180 - ' + a + ' - ' + b + ' = ' + c + '$';

      // SVG 삼각형
      var svgStr = svgHelper.open(250, 200);
      svgStr += svgHelper.triangle(125, 20, 30, 180, 220, 180,
        { A: 'x\u00B0', B: a + '\u00B0', C: b + '\u00B0' });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(c, 3, function() {
        return utils.randChoice([180 - a, 180 - b, c + utils.randIntNonZero(-10, 10), 90 - a]);
      });
      var choices = ['$' + c + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    } else if (subtype === 'isosceles') {
      // 이등변삼각형: 꼭지각 주고 밑각 구하기 (또는 반대)
      var askBase = utils.randChoice([true, false]);
      var vertex, baseAngle;

      if (askBase) {
        vertex = utils.randChoice([40, 50, 60, 70, 80, 100, 120]);
        baseAngle = (180 - vertex) / 2;
        var questionText = '이등변삼각형에서 꼭지각의 크기가 $' + vertex + '^{\\circ}$일 때, 밑각의 크기를 구하시오.';
        var answer = String(baseAngle);
        var explanation = '이등변삼각형의 두 밑각은 같으므로\n';
        explanation += '밑각 $= \\frac{180^{\\circ} - ' + vertex + '^{\\circ}}{2} = ' + baseAngle + '^{\\circ}$';
      } else {
        baseAngle = utils.randChoice([30, 40, 50, 55, 65, 70, 75]);
        vertex = 180 - 2 * baseAngle;
        var questionText = '이등변삼각형에서 밑각의 크기가 $' + baseAngle + '^{\\circ}$일 때, 꼭지각의 크기를 구하시오.';
        var answer = String(vertex);
        var explanation = '이등변삼각형의 두 밑각은 같으므로\n';
        explanation += '꼭지각 $= 180^{\\circ} - 2 \\times ' + baseAngle + '^{\\circ} = ' + vertex + '^{\\circ}$';
      }

      var correctVal = askBase ? baseAngle : vertex;
      var labels;
      if (askBase) {
        labels = { A: vertex + '\u00B0', B: '?', C: '?' };
      } else {
        labels = { A: 'x\u00B0', B: baseAngle + '\u00B0', C: baseAngle + '\u00B0' };
      }
      var svgStr = svgHelper.open(250, 200);
      svgStr += svgHelper.triangle(125, 20, 30, 180, 220, 180, labels);
      // 이등변 표시 (AB = AC 등변 틱마크, 변에 수직인 짧은 선분)
      // AB 중점(77.5,100), 수직방향(0.859,0.510), 반길이4px
      svgStr += svgHelper.line(74, 98, 81, 102, { stroke: '#333', strokeWidth: 1.5 });
      // AC 중점(172.5,100), 수직방향(0.859,-0.510), 반길이4px
      svgStr += svgHelper.line(169, 102, 176, 98, { stroke: '#333', strokeWidth: 1.5 });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(correctVal, 3, function() {
        return utils.randChoice([180 - correctVal, correctVal + utils.randIntNonZero(-10, 10), 90 - correctVal / 2, correctVal * 2]);
      });
      distractors = distractors.filter(function(d) { return d > 0 && d < 180; });
      while (distractors.length < 3) {
        var extra = correctVal + utils.randIntNonZero(-20, 20);
        if (extra > 0 && extra < 180 && extra !== correctVal && distractors.indexOf(extra) === -1) {
          distractors.push(extra);
        }
      }

      var choices = ['$' + correctVal + '$'];
      for (var i = 0; i < 3; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    } else {
      // 삼각형의 외각 = 이웃하지 않는 두 내각의 합
      var a = utils.randInt(30, 80);
      var b = utils.randInt(30, 80);
      while (a + b >= 170) {
        b = utils.randInt(30, 80);
      }
      var exterior = a + b;

      var questionText = '삼각형에서 두 내각의 크기가 $' + a + '^{\\circ}$, $' + b + '^{\\circ}$일 때, 이 두 내각과 이웃하지 않는 외각의 크기를 구하시오.';
      var answer = String(exterior);
      var explanation = '삼각형의 한 외각의 크기는 이웃하지 않는 두 내각의 합과 같으므로\n';
      explanation += '$' + a + '^{\\circ} + ' + b + '^{\\circ} = ' + exterior + '^{\\circ}$';

      var svgStr = svgHelper.open(300, 200);
      svgStr += svgHelper.triangle(140, 20, 40, 170, 200, 170, { A: '', B: a + '\u00B0', C: b + '\u00B0' });
      // 외각 표시용 연장선
      svgStr += svgHelper.line(200, 170, 280, 170, { stroke: '#E74C3C', strokeWidth: 1.5, dash: '4,3' });
      // 외각 호 (BC연장선과 AC 사이 각도 표시)
      svgStr += svgHelper.arc(200, 170, 25, 0, 112, { stroke: '#E74C3C', strokeWidth: 1.5 });
      svgStr += svgHelper.text(230, 150, 'x\u00B0', { fontSize: 13, fill: '#E74C3C' });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(exterior, 3, function() {
        return utils.randChoice([180 - a, 180 - b, exterior + utils.randIntNonZero(-10, 10), 180 - exterior]);
      });
      distractors = distractors.filter(function(d) { return d > 0 && d < 360 && d !== exterior; });
      while (distractors.length < 3) {
        distractors.push(exterior + utils.randIntNonZero(-15, 15));
        distractors = distractors.filter(function(d) { return d > 0 && d < 360 && d !== exterior; });
        distractors = utils.unique(distractors);
      }

      var choices = ['$' + exterior + '$'];
      for (var i = 0; i < 3; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    }
  }

  // 난이도 2: 평행사변형의 성질
  function generateParallelogramProperties() {
    var subtype = utils.randChoice(['oppositeAngles', 'oppositeSides', 'diagonal']);

    if (subtype === 'oppositeAngles') {
      // 평행사변형: 이웃한 두 각의 합 = 180
      var angle1 = utils.randChoice([50, 55, 60, 65, 70, 75, 80, 100, 110, 115, 120, 130]);
      var angle2 = 180 - angle1;

      var questionText = '평행사변형 ABCD에서 $\\angle A = ' + angle1 + '^{\\circ}$일 때, $\\angle B$의 크기를 구하시오.';
      var answer = String(angle2);
      var explanation = '평행사변형에서 이웃한 두 각의 합은 $180^{\\circ}$이므로\n';
      explanation += '$\\angle B = 180^{\\circ} - ' + angle1 + '^{\\circ} = ' + angle2 + '^{\\circ}$';

      // SVG 평행사변형
      var svgStr = svgHelper.open(300, 180);
      svgStr += svgHelper.polygon([[50, 40], [230, 40], [260, 150], [80, 150]]);
      svgStr += svgHelper.text(40, 35, 'A', { fontSize: 14 });
      svgStr += svgHelper.text(238, 35, 'B', { fontSize: 14 });
      svgStr += svgHelper.text(268, 158, 'C', { fontSize: 14 });
      svgStr += svgHelper.text(68, 165, 'D', { fontSize: 14 });
      // 각도 호 표시
      svgStr += svgHelper.arc(50, 40, 18, 285, 360, { stroke: '#e74c3c', strokeWidth: 1.5 });
      svgStr += svgHelper.arc(230, 40, 18, 180, 285, { stroke: '#e74c3c', strokeWidth: 1.5 });
      svgStr += svgHelper.text(78, 60, angle1 + '\u00B0', { fontSize: 12, anchor: 'start' });
      svgStr += svgHelper.text(208, 60, 'x\u00B0', { fontSize: 12 });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(angle2, 3, function() {
        return utils.randChoice([angle1, 360 - angle1, angle2 + utils.randIntNonZero(-10, 10), 90]);
      });
      distractors = distractors.filter(function(d) { return d > 0 && d < 360 && d !== angle2; });
      while (distractors.length < 3) {
        distractors.push(angle2 + utils.randIntNonZero(-15, 15));
        distractors = distractors.filter(function(d) { return d > 0 && d < 360 && d !== angle2; });
        distractors = utils.unique(distractors);
      }

      var choices = ['$' + angle2 + '$'];
      for (var i = 0; i < 3; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    } else if (subtype === 'oppositeSides') {
      // 평행사변형: 대변의 길이가 같다
      var side1 = utils.randInt(4, 12);
      var side2 = utils.randInt(4, 12);
      while (side1 === side2) { side2 = utils.randInt(4, 12); }

      var questionText = '평행사변형 ABCD에서 $\\overline{AB} = ' + side1 + '$ cm, $\\overline{BC} = ' + side2 +
        '$ cm일 때, $\\overline{CD}$의 길이를 구하시오.';
      var answer = String(side1);
      var explanation = '평행사변형에서 대변의 길이는 같으므로\n';
      explanation += '$\\overline{CD} = \\overline{AB} = ' + side1 + '$ cm';

      var svgStr = svgHelper.open(320, 180);
      svgStr += svgHelper.polygon([[50, 40], [230, 40], [260, 150], [80, 150]]);
      svgStr += svgHelper.text(40, 35, 'A', { fontSize: 14 });
      svgStr += svgHelper.text(238, 35, 'B', { fontSize: 14 });
      svgStr += svgHelper.text(268, 158, 'C', { fontSize: 14 });
      svgStr += svgHelper.text(68, 165, 'D', { fontSize: 14 });
      // AB 길이 표시 (상단 호)
      svgStr += '<path d="M 60 34 Q 140 10 220 34" fill="none" stroke="#888" stroke-width="1.2"/>';
      svgStr += svgHelper.text(140, 18, side1 + 'cm', { fontSize: 12 });
      // BC 길이 표시 (우측 호)
      svgStr += '<path d="M 236 46 Q 288 95 264 144" fill="none" stroke="#888" stroke-width="1.2"/>';
      svgStr += svgHelper.text(285, 100, side2 + 'cm', { fontSize: 12, anchor: 'start' });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(side1, 3, function() {
        return utils.randChoice([side2, side1 + side2, Math.abs(side1 - side2), side1 + utils.randIntNonZero(-3, 3)]);
      });

      var choices = ['$' + side1 + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    } else {
      // 평행사변형: 대각선이 서로 다른 것을 이등분
      var halfDiag1 = utils.randInt(3, 10);
      var halfDiag2 = utils.randInt(3, 10);

      var questionText = '평행사변형 ABCD에서 두 대각선의 교점을 O라 할 때, $\\overline{AO} = ' + halfDiag1 +
        '$ cm이면 $\\overline{OC}$의 길이를 구하시오.';
      var answer = String(halfDiag1);
      var explanation = '평행사변형에서 두 대각선은 서로 다른 것을 이등분하므로\n';
      explanation += '$\\overline{OC} = \\overline{AO} = ' + halfDiag1 + '$ cm';

      var svgStr = svgHelper.open(280, 180);
      svgStr += svgHelper.polygon([[50, 40], [230, 40], [260, 150], [80, 150]]);
      // 대각선
      svgStr += svgHelper.line(50, 40, 260, 150, { stroke: '#999', strokeWidth: 1, dash: '4,3' });
      svgStr += svgHelper.line(230, 40, 80, 150, { stroke: '#999', strokeWidth: 1, dash: '4,3' });
      svgStr += svgHelper.text(155, 88, 'O', { fontSize: 13 });
      svgStr += svgHelper.text(40, 35, 'A', { fontSize: 14 });
      svgStr += svgHelper.text(238, 35, 'B', { fontSize: 14 });
      svgStr += svgHelper.text(268, 158, 'C', { fontSize: 14 });
      svgStr += svgHelper.text(68, 165, 'D', { fontSize: 14 });
      svgStr += svgHelper.close();

      var distractors = utils.generateDistractors(halfDiag1, 3, function() {
        return utils.randChoice([halfDiag1 * 2, halfDiag2, halfDiag1 + utils.randIntNonZero(-3, 3)]);
      });

      var choices = ['$' + halfDiag1 + '$'];
      for (var i = 0; i < distractors.length; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: svgStr
      };
    }
  }

  // 난이도 3: 다각형의 내각/외각의 합, 대각선 개수
  function generatePolygonProperties() {
    var subtype = utils.randChoice(['interiorSum', 'oneInterior', 'diagonalCount', 'exteriorSum']);

    if (subtype === 'interiorSum') {
      // n각형의 내각의 합 = (n-2)*180
      var n = utils.randInt(5, 10);
      var sum = (n - 2) * 180;

      var questionText = '$' + n + '$각형의 내각의 합을 구하시오.';
      var answer = String(sum);
      var explanation = '$n$각형의 내각의 합 $= (n - 2) \\times 180^{\\circ}$\n';
      explanation += '$= (' + n + ' - 2) \\times 180^{\\circ} = ' + (n - 2) + ' \\times 180^{\\circ} = ' + sum + '^{\\circ}$';

      var distractors = utils.generateDistractors(sum, 3, function() {
        return utils.randChoice([(n - 1) * 180, (n - 3) * 180, n * 180, sum + 180, sum - 180]);
      });
      distractors = distractors.filter(function(d) { return d > 0 && d !== sum; });
      while (distractors.length < 3) {
        distractors.push(sum + utils.randChoice([-360, -180, 180, 360]));
        distractors = distractors.filter(function(d) { return d > 0 && d !== sum; });
        distractors = utils.unique(distractors);
      }

      var choices = ['$' + sum + '^{\\circ}$'];
      for (var i = 0; i < 3; i++) {
        choices.push('$' + distractors[i] + '^{\\circ}$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: '$' + sum + '^{\\circ}$',
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: null
      };
    } else if (subtype === 'oneInterior') {
      // 정n각형의 한 내각의 크기
      var n = utils.randChoice([5, 6, 8, 9, 10, 12]);
      var oneAngle = (n - 2) * 180 / n;

      var questionText = '정$' + n + '$각형의 한 내각의 크기를 구하시오.';
      var answer;
      if (oneAngle === Math.floor(oneAngle)) {
        answer = String(oneAngle);
      } else {
        answer = utils.fractionToLatex((n - 2) * 180, n);
      }

      var explanation = '정$' + n + '$각형의 한 내각 $= \\frac{(' + n + ' - 2) \\times 180^{\\circ}}{' + n + '} = \\frac{' +
        ((n - 2) * 180) + '^{\\circ}}{' + n + '} = ' + answer + '^{\\circ}$';

      var distractors = utils.generateDistractors(oneAngle, 3, function() {
        var otherN = utils.randChoice([5, 6, 8, 9, 10, 12]);
        return (otherN - 2) * 180 / otherN;
      });

      var choices = ['$' + answer + '^{\\circ}$'];
      for (var i = 0; i < distractors.length; i++) {
        var dv = distractors[i];
        if (dv === Math.floor(dv)) {
          choices.push('$' + dv + '^{\\circ}$');
        } else {
          choices.push('$' + dv.toFixed(0) + '^{\\circ}$');
        }
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        choices.push('$' + (oneAngle + utils.randIntNonZero(-15, 15)) + '^{\\circ}$');
        choices = utils.unique(choices);
      }
      choices = choices.slice(0, 4);
      var correctChoice = choices[0];
      choices = utils.shuffle(choices);
      var answerIndex = choices.indexOf(correctChoice);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: '$' + answer + '^{\\circ}$',
        answerIndex: answerIndex,
        choices: choices,
        explanation: explanation,
        svg: null
      };
    } else if (subtype === 'diagonalCount') {
      // n각형의 대각선 개수 = n(n-3)/2
      var n = utils.randInt(5, 12);
      var count = n * (n - 3) / 2;

      var questionText = '$' + n + '$각형의 대각선의 총 개수를 구하시오.';
      var answer = String(count);
      var explanation = '$n$각형의 대각선의 수 $= \\frac{n(n-3)}{2}$\n';
      explanation += '$= \\frac{' + n + ' \\times ' + (n - 3) + '}{2} = \\frac{' + (n * (n - 3)) + '}{2} = ' + count + '$개';

      var distractors = utils.generateDistractors(count, 3, function() {
        return utils.randChoice([
          n * (n - 2) / 2,
          n * (n - 1) / 2,
          count + utils.randIntNonZero(-3, 3),
          n * (n - 3)
        ]);
      });
      distractors = distractors.filter(function(d) { return d > 0 && d === Math.floor(d) && d !== count; });
      while (distractors.length < 3) {
        var nd = count + utils.randIntNonZero(-5, 5);
        if (nd > 0 && nd !== count && distractors.indexOf(nd) === -1) {
          distractors.push(nd);
        }
      }

      var choices = ['$' + count + '$'];
      for (var i = 0; i < 3; i++) {
        choices.push('$' + distractors[i] + '$');
      }
      var shuffled = utils.shuffle([0, 1, 2, 3]);
      var reordered = shuffled.map(function(idx) { return choices[idx]; });
      var answerIndex = shuffled.indexOf(0);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: answer,
        answerIndex: answerIndex,
        choices: reordered,
        explanation: explanation,
        svg: null
      };
    } else {
      // 다각형의 외각의 합은 항상 360도
      var n = utils.randInt(5, 10);
      var answer = 360;

      var questionText = '$' + n + '$각형의 외각의 합을 구하시오.';
      var explanation = '모든 볼록 다각형의 외각의 합은 항상 $360^{\\circ}$입니다.';

      var choices = ['$360^{\\circ}$'];
      var wrongChoices = [
        '$' + ((n - 2) * 180) + '^{\\circ}$',
        '$' + (n * 180) + '^{\\circ}$',
        '$180^{\\circ}$'
      ];
      choices = choices.concat(wrongChoices);
      var correctChoice = choices[0];
      choices = utils.shuffle(choices);
      var answerIndex = choices.indexOf(correctChoice);

      return {
        questionText: questionText,
        questionLatex: null,
        answer: '$360^{\\circ}$',
        answerIndex: answerIndex,
        choices: choices,
        explanation: explanation,
        svg: null
      };
    }
  }

  MathQuiz.generators['grade2-shape-properties'] = {
    meta: {
      grade: 2,
      topic: '도형의 성질',
      topicId: 'shape-properties',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var result;
      if (difficulty <= 1) {
        result = generateTriangleAngles();
      } else if (difficulty === 2) {
        result = utils.randChoice([generateTriangleAngles, generateParallelogramProperties])();
      } else {
        result = utils.randChoice([generateParallelogramProperties, generatePolygonProperties])();
      }

      return {
        type: type,
        questionText: result.questionText,
        questionLatex: result.questionLatex || null,
        svg: result.svg || null,
        choices: type === 'multiple-choice' ? result.choices : null,
        answer: result.answer,
        answerIndex: type === 'multiple-choice' ? result.answerIndex : null,
        explanation: result.explanation
      };
    }
  };
})();
