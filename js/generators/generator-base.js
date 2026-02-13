// 문제 생성 공통 유틸리티
window.MathQuiz = window.MathQuiz || {};
MathQuiz.generators = MathQuiz.generators || {};

MathQuiz.utils = {
  // 랜덤 정수 [min, max] 범위
  randInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 0이 아닌 랜덤 정수
  randIntNonZero: function(min, max) {
    var n;
    do { n = this.randInt(min, max); } while (n === 0);
    return n;
  },

  // 배열에서 랜덤 선택
  randChoice: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // 배열 셔플 (Fisher-Yates)
  shuffle: function(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  },

  // 최대공약수
  gcd: function(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a;
  },

  // 최소공배수
  lcm: function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },

  // 소수 판별
  isPrime: function(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (var i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  },

  // 소인수분해
  primeFactors: function(n) {
    var factors = {};
    var d = 2;
    while (n > 1) {
      while (n % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        n /= d;
      }
      d++;
    }
    return factors;
  },

  // 소인수분해를 LaTeX 문자열로
  primeFactorsToLatex: function(factors) {
    var keys = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
    var parts = [];
    for (var i = 0; i < keys.length; i++) {
      var base = keys[i];
      var exp = factors[base];
      parts.push(exp > 1 ? base + '^{' + exp + '}' : String(base));
    }
    return parts.join(' \\times ');
  },

  // 분수 약분
  simplifyFraction: function(num, den) {
    if (den === 0) return { num: num, den: 1 };
    var g = this.gcd(Math.abs(num), Math.abs(den));
    num = num / g;
    den = den / g;
    if (den < 0) { num = -num; den = -den; }
    return { num: num, den: den };
  },

  // 분수를 LaTeX 문자열로
  fractionToLatex: function(num, den) {
    var f = this.simplifyFraction(num, den);
    if (f.den === 1) return String(f.num);
    var sign = (f.num < 0) ? '-' : '';
    return sign + '\\frac{' + Math.abs(f.num) + '}{' + f.den + '}';
  },

  // 계수를 문자열로 (1x → x, -1x → -x)
  coeffStr: function(c, variable, isFirst) {
    if (c === 0) return '';
    var sign = '';
    if (c > 0 && !isFirst) sign = '+';
    else if (c < 0) { sign = '-'; c = -c; }

    if (c === 1) return sign + variable;
    return sign + c + variable;
  },

  // 상수항 문자열
  constStr: function(c, isFirst) {
    if (c === 0) return '';
    if (c > 0 && !isFirst) return '+' + c;
    return String(c);
  },

  // 중복 없는 문제 생성
  generateUnique: function(generator, count, options) {
    var problems = [];
    var seen = {};
    var maxAttempts = count * 10;
    var attempts = 0;

    while (problems.length < count && attempts < maxAttempts) {
      var p = generator.generate(options);
      var key = (p.questionText || '') + '|' + (p.questionLatex || '') + '|' + p.answer;
      if (!seen[key]) {
        seen[key] = true;
        p.id = options.topicId + '-' + Date.now() + '-' + problems.length;
        problems.push(p);
      }
      attempts++;
    }
    return problems;
  },

  // 객관식 오답 생성 (정답 주변 값으로)
  generateDistractors: function(correctAnswer, count, generator) {
    var distractors = [];
    var seen = {};
    seen[String(correctAnswer)] = true;
    var attempts = 0;

    while (distractors.length < count && attempts < count * 10) {
      var d = generator();
      var key = String(d);
      if (!seen[key]) {
        seen[key] = true;
        distractors.push(d);
      }
      attempts++;
    }
    return distractors;
  },

  // 유일한 값 배열
  unique: function(arr) {
    var seen = {};
    return arr.filter(function(x) {
      var key = String(x);
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  },

  // 객관식 보기 중복 제거 및 부족분 보충
  // answer: 정답 문자열, choices: 보기 배열, answerIndex: 정답 인덱스
  // fallbackGenerator: 부족한 보기를 생성하는 함수 (인덱스를 인자로 받음)
  ensureUniqueChoices: function(answer, choices, fallbackGenerator) {
    if (!choices || choices.length === 0) return { choices: choices, answerIndex: null };
    var seen = {};
    var unique = [];
    for (var i = 0; i < choices.length; i++) {
      var key = String(choices[i]);
      if (!seen[key]) {
        seen[key] = true;
        unique.push(choices[i]);
      }
    }
    // 부족분 보충
    if (fallbackGenerator) {
      var attempt = 0;
      while (unique.length < 4 && attempt < 20) {
        var extra = fallbackGenerator(attempt);
        var ek = String(extra);
        if (!seen[ek]) {
          seen[ek] = true;
          unique.push(extra);
        }
        attempt++;
      }
    }
    // 정답이 반드시 포함되도록
    if (unique.indexOf(answer) === -1) {
      unique[0] = answer;
    }
    var shuffled = this.shuffle(unique.slice(0, 4));
    return { choices: shuffled, answerIndex: shuffled.indexOf(answer) };
  }
};

// 퀴즈 생성 오케스트레이터
MathQuiz.generateQuiz = function(grade, topicId, count, difficulty, mcRatio) {
  var key = 'grade' + grade + '-' + topicId;
  var generator = MathQuiz.generators[key];
  if (!generator) {
    throw new Error('생성기를 찾을 수 없습니다: ' + key);
  }

  mcRatio = mcRatio !== undefined ? mcRatio : 0.7;
  var mcCount = Math.round(count * mcRatio);
  var saCount = count - mcCount;

  var mcProblems = MathQuiz.utils.generateUnique(generator, mcCount, {
    type: 'multiple-choice',
    difficulty: difficulty,
    topicId: topicId
  });

  var saProblems = MathQuiz.utils.generateUnique(generator, saCount, {
    type: 'short-answer',
    difficulty: difficulty,
    topicId: topicId
  });

  return MathQuiz.utils.shuffle(mcProblems.concat(saProblems));
};

// 등록된 생성기 목록 조회
MathQuiz.getAvailableGenerators = function(grade) {
  var result = [];
  var prefix = 'grade' + grade + '-';
  for (var key in MathQuiz.generators) {
    if (key.indexOf(prefix) === 0) {
      result.push(MathQuiz.generators[key].meta);
    }
  }
  return result;
};
