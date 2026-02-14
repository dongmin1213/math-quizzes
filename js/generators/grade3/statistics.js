// 중3 - 통계
(function() {
  var utils = MathQuiz.utils;

  // 데이터셋 생성 헬퍼 (backward: 평균과 분산을 먼저 결정)
  function generateDataset(size, targetMean, maxDeviation) {
    maxDeviation = maxDeviation || 5;
    var data = [];
    var sum = 0;

    // size-1 개의 값을 생성하고 마지막 값으로 평균 맞추기
    for (var i = 0; i < size - 1; i++) {
      var val = targetMean + utils.randInt(-maxDeviation, maxDeviation);
      data.push(val);
      sum += val;
    }
    var last = targetMean * size - sum;
    data.push(last);
    data.sort(function(a, b) { return a - b; });
    return data;
  }

  // 평균 계산
  function mean(data) {
    var s = 0;
    for (var i = 0; i < data.length; i++) s += data[i];
    return s / data.length;
  }

  // 중앙값 계산
  function median(data) {
    var sorted = data.slice().sort(function(a, b) { return a - b; });
    var n = sorted.length;
    if (n % 2 === 1) return sorted[Math.floor(n / 2)];
    return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }

  // 최빈값 계산
  function mode(data) {
    var freq = {};
    var maxFreq = 0;
    for (var i = 0; i < data.length; i++) {
      freq[data[i]] = (freq[data[i]] || 0) + 1;
      if (freq[data[i]] > maxFreq) maxFreq = freq[data[i]];
    }
    var modes = [];
    for (var key in freq) {
      if (freq[key] === maxFreq) modes.push(Number(key));
    }
    return modes;
  }

  // 분산 계산
  function variance(data) {
    var m = mean(data);
    var sumSqDev = 0;
    for (var i = 0; i < data.length; i++) {
      sumSqDev += (data[i] - m) * (data[i] - m);
    }
    return sumSqDev / data.length;
  }

  // 표준편차 계산
  function stddev(data) {
    return Math.sqrt(variance(data));
  }

  MathQuiz.generators['grade3-statistics'] = {
    meta: {
      grade: 3,
      topic: '통계',
      topicId: 'statistics',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var subTypes;
      if (difficulty === 1) {
        subTypes = ['find-mean', 'find-median', 'find-mode', 'find-range'];
      } else if (difficulty === 2) {
        subTypes = ['find-variance', 'mean-missing-value', 'compare-spread'];
      } else {
        subTypes = ['find-stddev', 'data-transform', 'interpret-stats'];
      }
      var subType = utils.randChoice(subTypes);

      var questionText, questionLatex, answer, explanation, choices, answerIndex;

      switch (subType) {

        // ===== 난이도 1 =====
        case 'find-mean': {
          // 평균 구하기
          var targetMean = utils.randInt(5, 20);
          var size = utils.randChoice([5, 6, 7]);
          var data = generateDataset(size, targetMean, 4);

          var dataStr = data.join(',\\; ');
          var sumVal = data.reduce(function(a, b) { return a + b; }, 0);

          questionText = '다음 자료의 평균을 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + targetMean + '$';
          explanation = '평균 $= \\frac{' + data.join('+') + '}{' + size + '} = \\frac{' + sumVal + '}{' + size + '} = ' + targetMean + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + targetMean + '$',
              '$' + (targetMean + 1) + '$',
              '$' + (targetMean - 1) + '$',
              '$' + (targetMean + 2) + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-median': {
          // 중앙값 구하기
          var size = utils.randChoice([5, 7]); // 홀수 개
          var targetMedian = utils.randInt(5, 20);
          // 중앙값이 targetMedian이 되도록 데이터 생성
          var data = [];
          var half = Math.floor(size / 2);
          for (var i = 0; i < half; i++) {
            data.push(targetMedian - utils.randInt(1, 5));
          }
          data.push(targetMedian);
          for (var i = 0; i < half; i++) {
            data.push(targetMedian + utils.randInt(1, 5));
          }
          data = utils.shuffle(data);
          var sorted = data.slice().sort(function(a, b) { return a - b; });

          var dataStr = data.join(',\\; ');
          questionText = '다음 자료의 중앙값을 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + targetMedian + '$';
          explanation = '자료를 크기순으로 나열하면 $' + sorted.join(',\\; ') + '$ 입니다. ' + size + '개의 자료에서 중앙값은 ' + (half + 1) + '번째 값인 $' + targetMedian + '$ 입니다.';

          if (type === 'multiple-choice') {
            var m = mean(data);
            var mRounded = Math.round(m * 10) / 10;
            choices = [
              '$' + targetMedian + '$',
              '$' + (targetMedian + 1) + '$',
              '$' + (targetMedian - 1) + '$',
              '$' + mRounded + '$'
            ];
            // 중복 방지
            var seen = {};
            choices = choices.filter(function(c) {
              if (seen[c]) return false;
              seen[c] = true;
              return true;
            });
            var _s1 = 0;
            while (choices.length < 4 && _s1++ < 20) {
              choices.push('$' + (targetMedian + 2) + '$');
            }
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-mode': {
          // 최빈값 구하기
          var modeVal = utils.randInt(3, 15);
          var modeFreq = utils.randChoice([3, 4]);
          var size = utils.randChoice([7, 8, 9]);
          var data = [];
          for (var i = 0; i < modeFreq; i++) data.push(modeVal);
          var _safe = 0;
          while (data.length < size && _safe++ < 200) {
            var v = utils.randInt(modeVal - 5, modeVal + 5);
            // 다른 값의 빈도가 modeFreq보다 작도록
            var cnt = 0;
            for (var j = 0; j < data.length; j++) { if (data[j] === v) cnt++; }
            if (v !== modeVal && cnt < modeFreq - 1) {
              data.push(v);
            }
          }
          data = utils.shuffle(data);
          var dataStr = data.join(',\\; ');

          questionText = '다음 자료의 최빈값을 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + modeVal + '$';

          // 빈도 계산해서 설명
          var freq = {};
          for (var i = 0; i < data.length; i++) freq[data[i]] = (freq[data[i]] || 0) + 1;
          var freqStr = [];
          var keys = Object.keys(freq).map(Number).sort(function(a, b) { return a - b; });
          for (var i = 0; i < keys.length; i++) {
            freqStr.push(keys[i] + ': ' + freq[keys[i]] + '회');
          }
          explanation = '각 값의 빈도: ' + freqStr.join(', ') + '. $' + modeVal + '$ 이(가) $' + modeFreq + '$ 회로 가장 많이 나타나므로 최빈값은 $' + modeVal + '$ 입니다.';

          if (type === 'multiple-choice') {
            var medVal = median(data);
            choices = [
              '$' + modeVal + '$',
              '$' + (modeVal + 1) + '$',
              '$' + (modeVal - 1) + '$',
              '$' + Math.round(mean(data)) + '$'
            ];
            var seen = {};
            choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
            var _s2 = 0; while (choices.length < 4 && _s2++ < 20) choices.push('$' + (modeVal + 2) + '$');
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'find-range': {
          // 범위(산포도) 구하기
          var minVal = utils.randInt(1, 10);
          var rangeVal = utils.randInt(5, 15);
          var maxVal = minVal + rangeVal;
          var size = utils.randChoice([5, 6, 7]);
          var data = [minVal, maxVal];
          for (var i = 2; i < size; i++) {
            data.push(utils.randInt(minVal, maxVal));
          }
          data = utils.shuffle(data);
          var dataStr = data.join(',\\; ');

          questionText = '다음 자료의 범위를 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + rangeVal + '$';
          explanation = '(최댓값) $-$ (최솟값) $= ' + maxVal + ' - ' + minVal + ' = ' + rangeVal + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + rangeVal + '$',
              '$' + (rangeVal + 1) + '$',
              '$' + (rangeVal - 1) + '$',
              '$' + maxVal + '$'
            ];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 2 =====
        case 'find-variance': {
          // 분산 구하기 (정수 분산이 되도록 역설계)
          // 편차의 제곱합이 n으로 나누어지도록
          var n = 5;
          var targetMean = utils.randInt(5, 15);
          // 편차 배열을 먼저 구성 (합이 0)
          var deviations;
          var targetVar = utils.randChoice([2, 4, 8]);
          // 간단한 편차 구성
          if (targetVar === 2) {
            deviations = [-2, -1, 0, 1, 2]; // 편차제곱합=10, 분산=2
          } else if (targetVar === 4) {
            deviations = [-3, -1, 0, 1, 3]; // 편차제곱합=20, 분산=4
          } else {
            deviations = [-4, -2, 0, 2, 4]; // 편차제곱합=40, 분산=8
          }

          var sqSum = 0;
          for (var i = 0; i < deviations.length; i++) sqSum += deviations[i] * deviations[i];
          targetVar = sqSum / n;

          var data = [];
          for (var i = 0; i < n; i++) data.push(targetMean + deviations[i]);
          data.sort(function(a, b) { return a - b; });

          var dataStr = data.join(',\\; ');
          var devStr = deviations.map(function(d) { return '(' + d + ')^2'; }).join('+');

          questionText = '다음 자료의 분산을 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + targetVar + '$';
          explanation = '평균 $\\bar{x} = ' + targetMean + '$ 이고, 각 편차의 제곱: $' + devStr + ' = ' + sqSum + '$\n분산 $= \\frac{' + sqSum + '}{' + n + '} = ' + targetVar + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + targetVar + '$',
              '$' + (targetVar + 2) + '$',
              '$' + Math.round(Math.sqrt(targetVar) * 10) / 10 + '$',
              '$' + (sqSum) + '$'
            ];
            var seen = {};
            choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
            var _s3 = 0; while (choices.length < 4 && _s3++ < 20) choices.push('$' + (targetVar - 1) + '$');
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'mean-missing-value': {
          // 평균이 주어졌을 때 빠진 값 구하기
          var n = utils.randChoice([5, 6]);
          var targetMean = utils.randInt(10, 25);
          var totalSum = targetMean * n;
          var data = generateDataset(n, targetMean, 4);

          // 하나의 값을 빼고 문제 생성
          var hideIdx = utils.randInt(0, n - 1);
          var hidden = data[hideIdx];
          var shown = [];
          var shownSum = 0;
          for (var i = 0; i < n; i++) {
            if (i !== hideIdx) {
              shown.push(data[i]);
              shownSum += data[i];
            }
          }

          var shownStr = shown.join(',\\; ');

          questionText = '$' + n + '$ 개의 자료 $' + shownStr + ',\\; x$ 의 평균이 $' + targetMean + '$ 일 때, $x$ 의 값을 구하시오.';
          questionLatex = null;
          answer = '$' + hidden + '$';
          explanation = '평균이 $' + targetMean + '$ 이고 자료가 $' + n + '$ 개이므로 합 $= ' + targetMean + ' \\times ' + n + ' = ' + totalSum + '$ 입니다. 알려진 값의 합 $= ' + shownSum + '$ 이므로 $x = ' + totalSum + ' - ' + shownSum + ' = ' + hidden + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + hidden + '$',
              '$' + (hidden + 2) + '$',
              '$' + (hidden - 2) + '$',
              '$' + targetMean + '$'
            ];
            var seen = {};
            choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
            var _s4 = 0; while (choices.length < 4 && _s4++ < 20) choices.push('$' + (hidden + 3) + '$');
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'compare-spread': {
          // 두 자료의 산포도 비교
          var n = 5;
          var m = utils.randInt(8, 15);
          var devA = [-1, -1, 0, 1, 1]; // 분산 = 4/5
          var devB = [-3, -1, 0, 1, 3]; // 분산 = 20/5 = 4

          var dataA = devA.map(function(d) { return m + d; });
          var dataB = devB.map(function(d) { return m + d; });

          var varA = 0, varB = 0;
          for (var i = 0; i < n; i++) {
            varA += devA[i] * devA[i];
            varB += devB[i] * devB[i];
          }
          varA = varA / n;
          varB = varB / n;

          var dataAStr = dataA.join(',\\; ');
          var dataBStr = dataB.join(',\\; ');

          questionText = '반 A의 성적: $' + dataAStr + '$\n반 B의 성적: $' + dataBStr + '$\n두 반의 평균은 같을 때, 성적이 더 고르게 분포된 반은?';
          questionLatex = null;

          answer = '반 A';
          explanation = '두 반의 평균은 모두 $' + m + '$ 입니다.\n반 A의 분산 $= ' + varA + '$, 반 B의 분산 $= ' + varB + '$\n분산이 작을수록 자료가 고르게 분포되어 있으므로 반 A가 더 고르게 분포되어 있습니다.';

          if (type === 'multiple-choice') {
            choices = ['반 A', '반 B', '두 반이 같다', '알 수 없다'];
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        // ===== 난이도 3 =====
        case 'find-stddev': {
          // 표준편차 구하기
          var n = 5;
          var targetMean = utils.randInt(8, 15);

          // 표준편차가 깔끔한 수가 되도록 (완전제곱수 분산)
          var targetVarRoot = utils.randChoice([1, 2, 3]);
          var targetVariance = targetVarRoot * targetVarRoot;

          // 분산이 targetVariance가 되는 편차 구성 (n=4)
          n = 4;
          var deviations;
          if (targetVariance === 1) {
            deviations = [-1, -1, 1, 1]; // 편차제곱합=4, 분산=1, 표준편차=1
          } else if (targetVariance === 4) {
            deviations = [-2, -2, 2, 2]; // 편차제곱합=16, 분산=4, 표준편차=2
          } else { // 9
            deviations = [-3, -3, 3, 3]; // 편차제곱합=36, 분산=9, 표준편차=3
          }

          var data = [];
          for (var i = 0; i < n; i++) data.push(targetMean + deviations[i]);
          data.sort(function(a, b) { return a - b; });

          var sqSum = 0;
          for (var i = 0; i < deviations.length; i++) sqSum += deviations[i] * deviations[i];
          var actualVar = sqSum / n;
          var actualStd = Math.sqrt(actualVar);

          var dataStr = data.join(',\\; ');
          var devStr = deviations.map(function(d) { return '(' + d + ')^2'; }).join('+');

          questionText = '다음 자료의 표준편차를 구하시오.\n$' + dataStr + '$';
          questionLatex = null;
          answer = '$' + actualStd + '$';
          explanation = '평균 $\\bar{x} = ' + targetMean + '$\n편차의 제곱합: $' + devStr + ' = ' + sqSum + '$\n분산 $= \\frac{' + sqSum + '}{' + n + '} = ' + actualVar + '$\n표준편차 $= \\sqrt{' + actualVar + '} = ' + actualStd + '$ 입니다.';

          if (type === 'multiple-choice') {
            choices = [
              '$' + actualStd + '$',
              '$' + actualVar + '$',
              '$' + (actualStd + 1) + '$',
              '$\\sqrt{' + (actualVar + 1) + '}$'
            ];
            var seen = {};
            choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
            var _s5 = 0; while (choices.length < 4 && _s5++ < 20) choices.push('$' + (actualStd + 2) + '$');
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(answer);
          }
          break;
        }

        case 'data-transform': {
          // 자료 변환: 각 자료에 a를 더하거나 b를 곱했을 때 평균/분산 변화
          var n = 5;
          var originalMean = utils.randInt(8, 15);
          var deviations = [-2, -1, 0, 1, 2]; // 분산 = 10/5 = 2
          var data = [];
          for (var i = 0; i < n; i++) data.push(originalMean + deviations[i]);
          var originalVar = 2;

          var transType = utils.randChoice(['add', 'multiply']);
          var askWhat = utils.randChoice(['mean', 'variance']);

          if (transType === 'add') {
            var k = utils.randIntNonZero(-5, 5);
            var newMean = originalMean + k;
            var newVar = originalVar; // 분산은 변하지 않음

            var dataStr = data.join(',\\; ');
            if (askWhat === 'mean') {
              questionText = '자료 $' + dataStr + '$ 의 각 값에 $' + (k > 0 ? k : '(' + k + ')') + '$ 을 더한 새로운 자료의 평균을 구하시오.';
              answer = '$' + newMean + '$';
              explanation = '원래 평균이 $' + originalMean + '$ 이고, 각 값에 $' + k + '$ 을 더하면 평균도 $' + k + '$ 만큼 변합니다. 새 평균 $= ' + originalMean + ' + (' + k + ') = ' + newMean + '$ 입니다.';
            } else {
              questionText = '자료 $' + dataStr + '$ 의 각 값에 $' + (k > 0 ? k : '(' + k + ')') + '$ 을 더한 새로운 자료의 분산을 구하시오.';
              answer = '$' + newVar + '$';
              explanation = '각 값에 상수를 더해도 분산은 변하지 않습니다. 원래 분산이 $' + originalVar + '$ 이므로 새 분산도 $' + originalVar + '$ 입니다.';
            }
          } else {
            var k = utils.randChoice([2, 3, -2]);
            var newMean = originalMean * k;
            var newVar = originalVar * k * k; // 분산은 k²배

            var dataStr = data.join(',\\; ');
            if (askWhat === 'mean') {
              questionText = '자료 $' + dataStr + '$ 의 각 값에 $' + k + '$ 을 곱한 새로운 자료의 평균을 구하시오.';
              answer = '$' + newMean + '$';
              explanation = '원래 평균이 $' + originalMean + '$ 이고, 각 값에 $' + k + '$ 을 곱하면 평균도 $' + k + '$ 배가 됩니다. 새 평균 $= ' + originalMean + ' \\times ' + (k >= 0 ? k : '(' + k + ')') + ' = ' + newMean + '$ 입니다.';
            } else {
              questionText = '자료 $' + dataStr + '$ 의 각 값에 $' + k + '$ 을 곱한 새로운 자료의 분산을 구하시오.';
              answer = '$' + newVar + '$';
              explanation = '각 값에 $' + k + '$ 을 곱하면 분산은 $' + k + '^2 = ' + (k * k) + '$ 배가 됩니다. 새 분산 $= ' + originalVar + ' \\times ' + (k * k) + ' = ' + newVar + '$ 입니다.';
            }
          }

          questionLatex = null;

          if (type === 'multiple-choice') {
            var ans = answer;
            var numAns = parseInt(ans.replace(/[^-\d]/g, ''));
            choices = [
              ans,
              '$' + (numAns + 2) + '$',
              '$' + (numAns - 2) + '$',
              '$' + Math.abs(numAns * 2) + '$'
            ];
            var seen = {};
            choices = choices.filter(function(c) { if (seen[c]) return false; seen[c] = true; return true; });
            var _s6 = 0; while (choices.length < 4 && _s6++ < 20) choices.push('$' + (numAns + 3) + '$');
            choices = utils.shuffle(choices);
            answerIndex = choices.indexOf(ans);
          }
          break;
        }

        case 'interpret-stats': {
          // 통계 해석 문제: 두 집단 비교
          var n = 5;
          var meanA = utils.randInt(70, 85);
          var meanB = meanA; // 같은 평균

          // A: 편차 작음, B: 편차 큼
          var devA = [-1, -1, 0, 1, 1];
          var devB = [-4, -2, 0, 2, 4];
          var varA = 0, varB = 0;
          for (var i = 0; i < n; i++) {
            varA += devA[i] * devA[i];
            varB += devB[i] * devB[i];
          }
          varA = varA / n;
          varB = varB / n;
          var stdA = Math.round(Math.sqrt(varA) * 100) / 100;
          var stdB = Math.round(Math.sqrt(varB) * 100) / 100;

          questionText = '두 학생 그룹의 시험 성적에 대한 통계:\n' +
            '그룹 A: 평균 $' + meanA + '$ 점, 표준편차 $' + stdA + '$\n' +
            '그룹 B: 평균 $' + meanB + '$ 점, 표준편차 $' + stdB + '$\n' +
            '다음 중 옳은 설명은?';
          questionLatex = null;

          answer = '그룹 A의 성적이 더 고르다';
          explanation = '두 그룹의 평균이 같으므로 표준편차로 산포도를 비교합니다. 그룹 A의 표준편차($' + stdA + '$)가 그룹 B의 표준편차($' + stdB + '$)보다 작으므로 그룹 A의 성적이 더 고르게 분포되어 있습니다.';

          if (type === 'multiple-choice') {
            choices = [
              '그룹 A의 성적이 더 고르다',
              '그룹 B의 성적이 더 고르다',
              '두 그룹의 산포도가 같다',
              '평균이 같으므로 비교할 수 없다'
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
          return '$' + utils.randInt(1, 30) + '$';
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
