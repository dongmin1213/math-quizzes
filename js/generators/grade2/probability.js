// 중2 - 확률 (Probability)
(function() {
  var utils = MathQuiz.utils;

  // 난이도 1: 단일 사건 확률 (주사위, 동전, 구슬)
  function generateSingleEvent() {
    var subtype = utils.randChoice(['dice', 'marble', 'card']);

    if (subtype === 'dice') {
      // 주사위 문제
      var diceProblems = [
        {
          condition: '짝수의 눈',
          favorable: [2, 4, 6],
          total: 6
        },
        {
          condition: '홀수의 눈',
          favorable: [1, 3, 5],
          total: 6
        },
        {
          condition: '3 이하의 눈',
          favorable: [1, 2, 3],
          total: 6
        },
        {
          condition: '4 이상의 눈',
          favorable: [4, 5, 6],
          total: 6
        },
        {
          condition: '소수의 눈',
          favorable: [2, 3, 5],
          total: 6
        },
        {
          condition: '6의 약수의 눈',
          favorable: [1, 2, 3, 6],
          total: 6
        },
        {
          condition: '3의 배수의 눈',
          favorable: [3, 6],
          total: 6
        }
      ];

      var prob = utils.randChoice(diceProblems);
      var num = prob.favorable.length;
      var den = prob.total;
      var simplified = utils.simplifyFraction(num, den);

      var questionText = '한 개의 주사위를 던질 때, ' + prob.condition + '이 나올 확률을 구하시오.';
      var answerLatex = utils.fractionToLatex(num, den);
      var answer = '$' + answerLatex + '$';

      var explanation = '주사위의 모든 경우의 수: $' + den + '$\n';
      explanation += prob.condition + '이 나오는 경우: $' + prob.favorable.join(', ') + '$ ($' + num + '$가지)\n';
      explanation += '확률 $= ' + answerLatex + '$';

      // 오답 생성
      var wrongFracs = [];
      wrongFracs.push(utils.fractionToLatex(den - num, den)); // 여사건
      wrongFracs.push(utils.fractionToLatex(num + 1, den));   // 하나 더
      wrongFracs.push(utils.fractionToLatex(Math.max(num - 1, 1), den)); // 하나 덜

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, 5);
        choices.push('$' + utils.fractionToLatex(rn, 6) + '$');
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
        explanation: explanation
      };
    } else if (subtype === 'marble') {
      // 구슬 뽑기
      var colors = ['빨간', '파란', '노란', '초록', '흰'];
      var numColors = utils.randInt(2, 3);
      var selectedColors = utils.shuffle(colors).slice(0, numColors);
      var counts = [];
      var total = 0;
      for (var i = 0; i < numColors; i++) {
        var c = utils.randInt(2, 8);
        counts.push(c);
        total += c;
      }

      var targetIdx = utils.randInt(0, numColors - 1);
      var targetColor = selectedColors[targetIdx];
      var favorable = counts[targetIdx];

      var simplified = utils.simplifyFraction(favorable, total);
      var answerLatex = utils.fractionToLatex(favorable, total);

      var bagDesc = '';
      for (var i = 0; i < numColors; i++) {
        if (i > 0) bagDesc += ', ';
        bagDesc += selectedColors[i] + ' 구슬 $' + counts[i] + '$개';
      }

      var questionText = '주머니에 ' + bagDesc + '가 들어 있다. 구슬을 한 개 꺼낼 때, ' +
        targetColor + ' 구슬이 나올 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '전체 구슬 수: $' + total + '$개\n';
      explanation += targetColor + ' 구슬 수: $' + favorable + '$개\n';
      explanation += '확률 $= ' + answerLatex + '$';

      var wrongFracs = [];
      for (var i = 0; i < numColors; i++) {
        if (i !== targetIdx) {
          wrongFracs.push(utils.fractionToLatex(counts[i], total));
        }
      }
      wrongFracs.push(utils.fractionToLatex(total - favorable, total));

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, total - 1);
        choices.push('$' + utils.fractionToLatex(rn, total) + '$');
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
        explanation: explanation
      };
    } else {
      // 카드 뽑기 (1~N 카드)
      var maxCard = utils.randChoice([9, 10, 12, 15, 20]);
      var conditionType = utils.randChoice(['even', 'odd', 'multiple', 'lessthan']);

      var favorable, condText;
      if (conditionType === 'even') {
        favorable = Math.floor(maxCard / 2);
        condText = '짝수가 적힌 카드';
      } else if (conditionType === 'odd') {
        favorable = Math.ceil(maxCard / 2);
        condText = '홀수가 적힌 카드';
      } else if (conditionType === 'multiple') {
        var mult = utils.randChoice([3, 4, 5]);
        favorable = Math.floor(maxCard / mult);
        condText = '$' + mult + '$의 배수가 적힌 카드';
      } else {
        var threshold = utils.randInt(3, Math.floor(maxCard / 2));
        favorable = threshold - 1;
        condText = '$' + threshold + '$ 미만의 수가 적힌 카드';
      }

      if (favorable <= 0) favorable = 1;

      var answerLatex = utils.fractionToLatex(favorable, maxCard);
      var questionText = '$1$부터 $' + maxCard + '$까지의 자연수가 하나씩 적힌 카드 $' + maxCard +
        '$장에서 한 장을 뽑을 때, ' + condText + '를 뽑을 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '전체 카드 수: $' + maxCard + '$장\n';
      explanation += condText + '의 수: $' + favorable + '$장\n';
      explanation += '확률 $= ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(maxCard - favorable, maxCard),
        utils.fractionToLatex(favorable + 1, maxCard),
        utils.fractionToLatex(Math.max(favorable - 1, 1), maxCard)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, maxCard - 1);
        choices.push('$' + utils.fractionToLatex(rn, maxCard) + '$');
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
        explanation: explanation
      };
    }
  }

  // 난이도 2: 두 사건의 결합 확률 (동전 2개, 주사위 2개 등)
  function generateTwoEvents() {
    var subtype = utils.randChoice(['twoDice', 'twoCoins', 'diceAndCoin']);

    if (subtype === 'twoDice') {
      // 주사위 2개의 합
      var targetSum = utils.randInt(4, 10);

      // 경우의 수 계산
      var favorableCount = 0;
      var cases = [];
      for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 6; j++) {
          if (i + j === targetSum) {
            favorableCount++;
            cases.push('(' + i + ', ' + j + ')');
          }
        }
      }
      var total = 36;
      var answerLatex = utils.fractionToLatex(favorableCount, total);

      var questionText = '두 개의 주사위를 동시에 던질 때, 나오는 눈의 합이 $' + targetSum + '$이 될 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '모든 경우의 수: $6 \\times 6 = 36$\n';
      explanation += '합이 $' + targetSum + '$인 경우: ' + cases.join(', ') + ' ($' + favorableCount + '$가지)\n';
      explanation += '확률 $= ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(favorableCount + 1, total),
        utils.fractionToLatex(Math.max(favorableCount - 1, 1), total),
        utils.fractionToLatex(favorableCount, 12) // 분모 실수
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, 10);
        choices.push('$' + utils.fractionToLatex(rn, 36) + '$');
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
        explanation: explanation
      };
    } else if (subtype === 'twoCoins') {
      // 동전 2개 또는 3개
      var numCoins = utils.randChoice([2, 3]);
      var total = Math.pow(2, numCoins);
      var targetHeads = utils.randInt(0, numCoins);

      // nCr 계산
      function comb(n, r) {
        if (r === 0 || r === n) return 1;
        var res = 1;
        for (var i = 0; i < r; i++) {
          res = res * (n - i) / (i + 1);
        }
        return res;
      }

      var favorableCount = comb(numCoins, targetHeads);
      var answerLatex = utils.fractionToLatex(favorableCount, total);

      var questionText = '동전 $' + numCoins + '$개를 동시에 던질 때, 앞면이 $' + targetHeads + '$개 나올 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '모든 경우의 수: $2^{' + numCoins + '} = ' + total + '$\n';
      explanation += '앞면이 $' + targetHeads + '$개 나오는 경우의 수: ${}_{' + numCoins + '}C_{' + targetHeads + '} = ' + favorableCount + '$\n';
      explanation += '확률 $= ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(total - favorableCount, total),
        utils.fractionToLatex(targetHeads, total),
        utils.fractionToLatex(Math.min(favorableCount + 1, total), total)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, total - 1);
        choices.push('$' + utils.fractionToLatex(rn, total) + '$');
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
        explanation: explanation
      };
    } else {
      // 주사위 + 동전
      var total = 12; // 6 * 2
      var condition = utils.randChoice(['evenAndHead', 'oddAndTail', 'primeAndHead']);
      var favorableCount, condText, condDetail;

      if (condition === 'evenAndHead') {
        favorableCount = 3; // {2,4,6} * {앞면}
        condText = '주사위는 짝수, 동전은 앞면';
        condDetail = '짝수: $2, 4, 6$ ($3$가지), 앞면: $1$가지 $\\Rightarrow 3 \\times 1 = 3$가지';
      } else if (condition === 'oddAndTail') {
        favorableCount = 3; // {1,3,5} * {뒷면}
        condText = '주사위는 홀수, 동전은 뒷면';
        condDetail = '홀수: $1, 3, 5$ ($3$가지), 뒷면: $1$가지 $\\Rightarrow 3 \\times 1 = 3$가지';
      } else {
        favorableCount = 3; // {2,3,5} * {앞면}
        condText = '주사위는 소수, 동전은 앞면';
        condDetail = '소수: $2, 3, 5$ ($3$가지), 앞면: $1$가지 $\\Rightarrow 3 \\times 1 = 3$가지';
      }

      var answerLatex = utils.fractionToLatex(favorableCount, total);

      var questionText = '주사위 한 개와 동전 한 개를 동시에 던질 때, ' + condText + '이 나올 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '모든 경우의 수: $6 \\times 2 = 12$\n';
      explanation += condDetail + '\n';
      explanation += '확률 $= ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(favorableCount, 6),
        utils.fractionToLatex(total - favorableCount, total),
        utils.fractionToLatex(favorableCount + 1, total)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, 11);
        choices.push('$' + utils.fractionToLatex(rn, 12) + '$');
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
        explanation: explanation
      };
    }
  }

  // 난이도 3: 여사건, 적어도 하나 확률
  function generateComplementProbability() {
    var subtype = utils.randChoice(['complement', 'atLeastOne', 'notEvent']);

    if (subtype === 'complement') {
      // 여사건 활용: P(A) = 1 - P(A의 여사건)
      var n = utils.randInt(3, 6);
      var total = Math.pow(2, n);

      // n개의 동전에서 적어도 1개 앞면
      // P(적어도 1개 앞면) = 1 - P(모두 뒷면) = 1 - 1/2^n
      var favNum = total - 1;
      var answerLatex = utils.fractionToLatex(favNum, total);

      var questionText = '동전 $' + n + '$개를 동시에 던질 때, 적어도 한 개가 앞면이 나올 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '(여사건 활용) 모두 뒷면이 나올 확률 $= \\frac{1}{' + total + '}$\n';
      explanation += '적어도 한 개가 앞면일 확률 $= 1 - \\frac{1}{' + total + '} = ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(1, total),
        utils.fractionToLatex(n, total),
        utils.fractionToLatex(1, 2)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, total - 1);
        choices.push('$' + utils.fractionToLatex(rn, total) + '$');
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
        explanation: explanation
      };
    } else if (subtype === 'atLeastOne') {
      // 주사위 2개에서 적어도 하나 6
      var total = 36;
      // 둘 다 6이 아닌 경우: 5*5 = 25
      var notBoth = 25;
      var favorable = total - notBoth; // 11
      var answerLatex = utils.fractionToLatex(favorable, total);

      var questionText = '두 개의 주사위를 동시에 던질 때, 적어도 하나의 주사위에서 $6$이 나올 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '(여사건 활용) 두 주사위 모두 $6$이 아닌 경우의 수: $5 \\times 5 = 25$\n';
      explanation += '적어도 하나가 $6$인 확률 $= 1 - \\frac{25}{36} = \\frac{11}{36}$';

      var wrongFracs = [
        utils.fractionToLatex(25, 36),
        utils.fractionToLatex(1, 6),
        utils.fractionToLatex(2, 6),
        utils.fractionToLatex(12, 36)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
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
        explanation: explanation
      };
    } else {
      // ~하지 않을 확률
      var colors = ['빨간', '파란', '노란'];
      var counts = [utils.randInt(2, 6), utils.randInt(2, 6), utils.randInt(2, 6)];
      var total = counts[0] + counts[1] + counts[2];
      var targetIdx = utils.randInt(0, 2);
      var targetColor = colors[targetIdx];

      // ~이 아닐 확률 = 1 - P(target)
      var notFavorable = total - counts[targetIdx];
      var answerLatex = utils.fractionToLatex(notFavorable, total);

      var bagDesc = '';
      for (var i = 0; i < 3; i++) {
        if (i > 0) bagDesc += ', ';
        bagDesc += colors[i] + ' 구슬 $' + counts[i] + '$개';
      }

      var questionText = '주머니에 ' + bagDesc + '가 들어 있다. 구슬을 한 개 꺼낼 때, ' +
        targetColor + ' 구슬이 나오지 않을 확률을 구하시오.';
      var answer = '$' + answerLatex + '$';

      var explanation = '전체 구슬: $' + total + '$개\n';
      explanation += targetColor + ' 구슬이 나올 확률: $' + utils.fractionToLatex(counts[targetIdx], total) + '$\n';
      explanation += targetColor + ' 구슬이 나오지 않을 확률 $= 1 - ' + utils.fractionToLatex(counts[targetIdx], total) +
        ' = ' + answerLatex + '$';

      var wrongFracs = [
        utils.fractionToLatex(counts[targetIdx], total),
        utils.fractionToLatex(counts[(targetIdx + 1) % 3], total),
        utils.fractionToLatex(counts[(targetIdx + 2) % 3], total)
      ];

      var choices = [answer];
      for (var i = 0; i < wrongFracs.length; i++) {
        choices.push('$' + wrongFracs[i] + '$');
      }
      choices = utils.unique(choices);
      var _safe = 0;
      while (choices.length < 4 && _safe++ < 20) {
        var rn = utils.randInt(1, total - 1);
        choices.push('$' + utils.fractionToLatex(rn, total) + '$');
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
        explanation: explanation
      };
    }
  }

  MathQuiz.generators['grade2-probability'] = {
    meta: {
      grade: 2,
      topic: '확률',
      topicId: 'probability',
      types: ['multiple-choice', 'short-answer']
    },
    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      var result;
      if (difficulty <= 1) {
        result = generateSingleEvent();
      } else if (difficulty === 2) {
        result = utils.randChoice([generateSingleEvent, generateTwoEvents])();
      } else {
        result = utils.randChoice([generateTwoEvents, generateComplementProbability])();
      }

      return {
        type: type,
        questionText: result.questionText,
        questionLatex: result.questionLatex || null,
        svg: null,
        choices: type === 'multiple-choice' ? result.choices : null,
        answer: result.answer,
        answerIndex: type === 'multiple-choice' ? result.answerIndex : null,
        explanation: result.explanation
      };
    }
  };
})();
