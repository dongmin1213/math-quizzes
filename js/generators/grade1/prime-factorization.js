// 중1 - 소인수분해 문제 생성기
(function() {
  var utils = MathQuiz.utils;

  // 난이도별 범위에서 소인수분해하기 좋은 수 생성 (소인수가 2, 3, 5, 7, 11, 13 등)
  function generateCompositeNumber(difficulty) {
    var min, max;
    if (difficulty === 1) { min = 12; max = 50; }
    else if (difficulty === 2) { min = 50; max = 200; }
    else { min = 200; max = 500; }

    // 소인수분해가 의미있는 합성수를 찾을 때까지 반복
    var n;
    var attempts = 0;
    do {
      n = utils.randInt(min, max);
      attempts++;
    } while ((utils.isPrime(n) || n < min) && attempts < 100);
    return n;
  }

  // 약수의 개수 계산
  function countDivisors(factors) {
    var count = 1;
    var primes = Object.keys(factors);
    for (var i = 0; i < primes.length; i++) {
      count *= (factors[primes[i]] + 1);
    }
    return count;
  }

  // 소인수분해 결과로부터 원래 수 복원
  function factorsToNumber(factors) {
    var n = 1;
    var primes = Object.keys(factors);
    for (var i = 0; i < primes.length; i++) {
      var p = parseInt(primes[i]);
      var e = factors[primes[i]];
      for (var j = 0; j < e; j++) {
        n *= p;
      }
    }
    return n;
  }

  // 모든 약수를 구하는 함수
  function getAllDivisors(n) {
    var divisors = [];
    for (var i = 1; i <= n; i++) {
      if (n % i === 0) divisors.push(i);
    }
    return divisors;
  }

  MathQuiz.generators['grade1-prime-factorization'] = {
    meta: {
      grade: 1,
      topic: '소인수분해',
      topicId: 'prime-factorization',
      types: ['multiple-choice', 'short-answer']
    },

    generate: function(options) {
      var difficulty = options.difficulty || 2;
      var type = options.type || 'multiple-choice';

      // 문제 유형 선택: 소인수분해, 역소인수분해, 약수 개수, 소인수 판별
      var problemTypes;
      if (difficulty === 1) {
        problemTypes = ['factorize', 'count-divisors', 'find-primes'];
      } else if (difficulty === 2) {
        problemTypes = ['factorize', 'reverse-factorize', 'count-divisors', 'find-primes'];
      } else {
        problemTypes = ['factorize', 'reverse-factorize', 'count-divisors', 'find-specific-divisor'];
      }
      var problemType = utils.randChoice(problemTypes);

      if (problemType === 'factorize') {
        return this._generateFactorize(difficulty, type);
      } else if (problemType === 'reverse-factorize') {
        return this._generateReverseFactorize(difficulty, type);
      } else if (problemType === 'count-divisors') {
        return this._generateCountDivisors(difficulty, type);
      } else if (problemType === 'find-primes') {
        return this._generateFindPrimes(difficulty, type);
      } else {
        return this._generateFindSpecificDivisor(difficulty, type);
      }
    },

    // 소인수분해하기
    _generateFactorize: function(difficulty, type) {
      var n = generateCompositeNumber(difficulty);
      var factors = utils.primeFactors(n);
      var correctLatex = utils.primeFactorsToLatex(factors);
      var correctAnswer = correctLatex;

      if (type === 'multiple-choice') {
        var choices = [correctLatex];

        // 오답 생성: 흔한 실수 기반
        var primes = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });

        // 오답1: 지수를 하나 바꿈
        var wrongFactors1 = JSON.parse(JSON.stringify(factors));
        var randomPrime = utils.randChoice(primes);
        wrongFactors1[randomPrime] = wrongFactors1[randomPrime] + 1;
        choices.push(utils.primeFactorsToLatex(wrongFactors1));

        // 오답2: 다른 지수를 바꿈
        var wrongFactors2 = JSON.parse(JSON.stringify(factors));
        var randomPrime2 = utils.randChoice(primes);
        wrongFactors2[randomPrime2] = Math.max(1, wrongFactors2[randomPrime2] - 1);
        choices.push(utils.primeFactorsToLatex(wrongFactors2));

        // 오답3: 합성수를 소인수로 잘못 사용
        var wrongFactors3 = {};
        if (n % 4 === 0) {
          wrongFactors3[4] = 1;
          var remaining = n / 4;
          if (remaining > 1) {
            var rf = utils.primeFactors(remaining);
            for (var k in rf) wrongFactors3[k] = rf[k];
          }
        } else if (n % 6 === 0) {
          wrongFactors3[6] = 1;
          var remaining2 = n / 6;
          if (remaining2 > 1) {
            var rf2 = utils.primeFactors(remaining2);
            for (var k2 in rf2) wrongFactors3[k2] = rf2[k2];
          }
        } else {
          // 임의의 근처 수의 소인수분해
          var nearN = n + utils.randChoice([-2, -1, 1, 2]);
          if (nearN < 2) nearN = n + 2;
          wrongFactors3 = utils.primeFactors(nearN);
        }
        choices.push(utils.primeFactorsToLatex(wrongFactors3));

        // 중복 제거 후 부족하면 추가
        choices = utils.unique(choices);
        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          var nearNum = n + utils.randInt(-5, 5);
          if (nearNum > 1 && nearNum !== n) {
            var nf = utils.primeFactorsToLatex(utils.primeFactors(nearNum));
            if (choices.indexOf(nf) === -1) choices.push(nf);
          }
        }
        choices = choices.slice(0, 4);

        var correctIndex = 0;
        choices = utils.shuffle(choices);
        correctIndex = choices.indexOf(correctLatex);

        return {
          type: type,
          questionText: '$' + n + '$을 소인수분해하시오.',
          questionLatex: null,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: correctLatex,
          answerIndex: correctIndex,
          explanation: '$' + n + ' = ' + correctLatex + '$'
        };
      } else {
        return {
          type: type,
          questionText: '$' + n + '$을 소인수분해하시오. (예: 2^3 x 3 형태로 입력)',
          questionLatex: null,
          svg: null,
          choices: null,
          answer: String(n),
          answerIndex: null,
          explanation: '$' + n + ' = ' + correctLatex + '$'
        };
      }
    },

    // 소인수분해 결과로부터 수 찾기
    _generateReverseFactorize: function(difficulty, type) {
      var n = generateCompositeNumber(difficulty);
      var factors = utils.primeFactors(n);
      var factorLatex = utils.primeFactorsToLatex(factors);

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(n, 3, function() {
          var offset = utils.randIntNonZero(-10, 10);
          var candidate = n + offset;
          return candidate > 1 ? candidate : n + Math.abs(offset);
        });

        var choices = [String(n)].concat(distractors.map(String));
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(n));

        return {
          type: type,
          questionText: '다음 소인수분해의 결과가 나타내는 자연수를 구하시오.',
          questionLatex: factorLatex,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: String(n),
          answerIndex: correctIndex,
          explanation: '$' + factorLatex + ' = ' + n + '$'
        };
      } else {
        return {
          type: type,
          questionText: '다음 소인수분해의 결과가 나타내는 자연수를 구하시오.',
          questionLatex: factorLatex,
          svg: null,
          choices: null,
          answer: String(n),
          answerIndex: null,
          explanation: '$' + factorLatex + ' = ' + n + '$'
        };
      }
    },

    // 약수의 개수 구하기
    _generateCountDivisors: function(difficulty, type) {
      var n = generateCompositeNumber(difficulty);
      var factors = utils.primeFactors(n);
      var factorLatex = utils.primeFactorsToLatex(factors);
      var correctCount = countDivisors(factors);

      if (type === 'multiple-choice') {
        var distractors = utils.generateDistractors(correctCount, 3, function() {
          return correctCount + utils.randIntNonZero(-3, 3);
        });
        distractors = distractors.filter(function(d) { return d > 0; });
        var _safe = 0;
        while (distractors.length < 3 && _safe++ < 20) {
          distractors.push(correctCount + distractors.length + 1);
        }

        var choices = [String(correctCount)].concat(distractors.slice(0, 3).map(String));
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(String(correctCount));

        // 풀이 생성
        var primes = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
        var expParts = [];
        for (var i = 0; i < primes.length; i++) {
          expParts.push('(' + factors[primes[i]] + '+1)');
        }
        var expStr = expParts.join(' \\times ');

        return {
          type: type,
          questionText: '$' + n + '$의 약수의 개수를 구하시오.',
          questionLatex: null,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$개'; }),
          answer: String(correctCount),
          answerIndex: correctIndex,
          explanation: '$' + n + ' = ' + factorLatex + '$이므로 약수의 개수는 $' + expStr + ' = ' + correctCount + '$개입니다.'
        };
      } else {
        var primes2 = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
        var expParts2 = [];
        for (var j = 0; j < primes2.length; j++) {
          expParts2.push('(' + factors[primes2[j]] + '+1)');
        }
        var expStr2 = expParts2.join(' \\times ');

        return {
          type: type,
          questionText: '$' + n + '$의 약수의 개수를 구하시오.',
          questionLatex: null,
          svg: null,
          choices: null,
          answer: String(correctCount),
          answerIndex: null,
          explanation: '$' + n + ' = ' + factorLatex + '$이므로 약수의 개수는 $' + expStr2 + ' = ' + correctCount + '$개입니다.'
        };
      }
    },

    // 소인수 찾기
    _generateFindPrimes: function(difficulty, type) {
      var n = generateCompositeNumber(difficulty);
      var factors = utils.primeFactors(n);
      var factorLatex = utils.primeFactorsToLatex(factors);
      var primeList = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
      var correctAnswer = primeList.join(', ');

      if (type === 'multiple-choice') {
        // 보기: 소인수 목록 조합
        var allSmallPrimes = [2, 3, 5, 7, 11, 13];
        var choices = [correctAnswer];

        // 오답: 소인수에 하나 추가
        for (var attempt = 0; attempt < 10 && choices.length < 4; attempt++) {
          var wrongPrimes = primeList.slice();
          var action = utils.randChoice(['add', 'remove', 'replace']);

          if (action === 'add' && wrongPrimes.length < 4) {
            var extraPrime = utils.randChoice(allSmallPrimes);
            if (wrongPrimes.indexOf(extraPrime) === -1) {
              wrongPrimes.push(extraPrime);
              wrongPrimes.sort(function(a, b) { return a - b; });
            }
          } else if (action === 'remove' && wrongPrimes.length > 1) {
            var removeIdx = utils.randInt(0, wrongPrimes.length - 1);
            wrongPrimes.splice(removeIdx, 1);
          } else {
            // 합성수로 교체 (흔한 실수: 4, 6, 9 등을 소인수로 착각)
            var composites = [4, 6, 8, 9, 10, 12, 14, 15];
            var replacePrime = utils.randChoice(wrongPrimes);
            var replaceIdx = wrongPrimes.indexOf(replacePrime);
            wrongPrimes[replaceIdx] = utils.randChoice(composites);
            wrongPrimes.sort(function(a, b) { return a - b; });
          }

          var wrongStr = wrongPrimes.join(', ');
          if (choices.indexOf(wrongStr) === -1) {
            choices.push(wrongStr);
          }
        }

        var _safe = 0;
        while (choices.length < 4 && _safe++ < 20) {
          var filler = allSmallPrimes.slice(0, utils.randInt(1, 3)).join(', ');
          if (choices.indexOf(filler) === -1) choices.push(filler);
        }
        choices = choices.slice(0, 4);
        choices = utils.shuffle(choices);
        var correctIndex = choices.indexOf(correctAnswer);

        return {
          type: type,
          questionText: '$' + n + '$의 소인수를 모두 구하시오.',
          questionLatex: null,
          svg: null,
          choices: choices.map(function(c) { return '$' + c + '$'; }),
          answer: correctAnswer,
          answerIndex: correctIndex,
          explanation: '$' + n + ' = ' + factorLatex + '$이므로 소인수는 $' + correctAnswer + '$입니다.'
        };
      } else {
        return {
          type: type,
          questionText: '$' + n + '$의 소인수를 모두 구하시오. (쉼표로 구분하여 입력)',
          questionLatex: null,
          svg: null,
          choices: null,
          answer: correctAnswer,
          answerIndex: null,
          explanation: '$' + n + ' = ' + factorLatex + '$이므로 소인수는 $' + correctAnswer + '$입니다.'
        };
      }
    },

    // 특정 조건을 만족하는 약수 찾기 (고급)
    _generateFindSpecificDivisor: function(difficulty, type) {
      var n = generateCompositeNumber(difficulty);
      var divisors = getAllDivisors(n);
      var factors = utils.primeFactors(n);
      var factorLatex = utils.primeFactorsToLatex(factors);

      // "가장 큰 약수" 또는 "홀수인 약수의 개수" 등
      var subTypes = ['largest-proper', 'odd-divisor-count'];
      var subType = utils.randChoice(subTypes);

      if (subType === 'largest-proper') {
        // 가장 큰 진약수 (n 자신 제외)
        var properDivisors = divisors.filter(function(d) { return d < n; });
        var correctAnswer = properDivisors[properDivisors.length - 1];

        if (type === 'multiple-choice') {
          var distractors = utils.generateDistractors(correctAnswer, 3, function() {
            return utils.randChoice(divisors.filter(function(d) { return d !== correctAnswer; }));
          });
          var _safe2 = 0;
          while (distractors.length < 3 && _safe2++ < 20) {
            distractors.push(correctAnswer + utils.randIntNonZero(-5, 5));
          }

          var choices = [String(correctAnswer)].concat(distractors.slice(0, 3).map(String));
          choices = utils.unique(choices).slice(0, 4);
          var _safe = 0;
          while (choices.length < 4 && _safe++ < 20) {
            choices.push(String(correctAnswer + choices.length));
          }
          choices = utils.shuffle(choices);
          var correctIndex = choices.indexOf(String(correctAnswer));

          return {
            type: type,
            questionText: '$' + n + '$의 약수 중 $' + n + '$을 제외한 가장 큰 약수를 구하시오.',
            questionLatex: null,
            svg: null,
            choices: choices.map(function(c) { return '$' + c + '$'; }),
            answer: String(correctAnswer),
            answerIndex: correctIndex,
            explanation: '$' + n + ' = ' + factorLatex + '$이므로, $' + n + '$을 가장 작은 소인수로 나누면 가장 큰 진약수 $' + correctAnswer + '$을 구할 수 있습니다.'
          };
        } else {
          return {
            type: type,
            questionText: '$' + n + '$의 약수 중 $' + n + '$을 제외한 가장 큰 약수를 구하시오.',
            questionLatex: null,
            svg: null,
            choices: null,
            answer: String(correctAnswer),
            answerIndex: null,
            explanation: '$' + n + ' = ' + factorLatex + '$이므로, $' + n + '$을 가장 작은 소인수로 나누면 가장 큰 진약수 $' + correctAnswer + '$을 구할 수 있습니다.'
          };
        }
      } else {
        // 홀수인 약수의 개수
        var oddDivisors = divisors.filter(function(d) { return d % 2 === 1; });
        var correctCount = oddDivisors.length;

        if (type === 'multiple-choice') {
          var distractors2 = utils.generateDistractors(correctCount, 3, function() {
            return correctCount + utils.randIntNonZero(-3, 3);
          });
          distractors2 = distractors2.filter(function(d) { return d > 0; });
          var _safe3 = 0;
          while (distractors2.length < 3 && _safe3++ < 20) {
            distractors2.push(correctCount + distractors2.length + 1);
          }

          var choices2 = [String(correctCount)].concat(distractors2.slice(0, 3).map(String));
          choices2 = utils.unique(choices2).slice(0, 4);
          var _safe4 = 0;
          while (choices2.length < 4 && _safe4++ < 20) {
            choices2.push(String(correctCount + choices2.length + 2));
          }
          choices2 = utils.shuffle(choices2);
          var correctIndex2 = choices2.indexOf(String(correctCount));

          return {
            type: type,
            questionText: '$' + n + '$의 약수 중 홀수인 것의 개수를 구하시오.',
            questionLatex: null,
            svg: null,
            choices: choices2.map(function(c) { return '$' + c + '$개'; }),
            answer: String(correctCount),
            answerIndex: correctIndex2,
            explanation: '$' + n + ' = ' + factorLatex + '$의 약수 중 홀수인 것은 $' + oddDivisors.join(', ') + '$으로 총 $' + correctCount + '$개입니다.'
          };
        } else {
          return {
            type: type,
            questionText: '$' + n + '$의 약수 중 홀수인 것의 개수를 구하시오.',
            questionLatex: null,
            svg: null,
            choices: null,
            answer: String(correctCount),
            answerIndex: null,
            explanation: '$' + n + ' = ' + factorLatex + '$의 약수 중 홀수인 것은 $' + oddDivisors.join(', ') + '$으로 총 $' + correctCount + '$개입니다.'
          };
        }
      }
    }
  };
})();
