// 퀴즈 엔진 - 문제 렌더링, 답 수집, 채점, 제출
(function() {
  var state = {
    problems: [],
    answers: [],       // 학생 답안 배열
    currentIndex: 0,
    quizData: null,
    studentInfo: null,
    submitted: false
  };

  MathQuiz.quizEngine = {
    init: function() {
      // 학생 정보 확인
      var name = sessionStorage.getItem('studentName');
      var grade = sessionStorage.getItem('grade');
      var classNum = sessionStorage.getItem('classNum');

      if (!name || !grade) {
        window.location.href = 'index.html';
        return;
      }

      state.studentInfo = { name: name, grade: grade, classNum: classNum };

      // 퀴즈 데이터 로드
      var testMode = sessionStorage.getItem('testMode');
      var quizJson = sessionStorage.getItem('quizData');

      // 로컬 테스트 모드: localStorage에서 관리자가 배포한 퀴즈 확인 (학년별 키 우선)
      var localQuiz = localStorage.getItem('localQuiz_grade' + grade)
        || localStorage.getItem('localQuiz');

      if (quizJson) {
        // 서버 또는 로컬에서 가져온 퀴즈 데이터
        state.quizData = JSON.parse(quizJson);
        state.problems = state.quizData.problems;
      } else if (testMode && localQuiz) {
        // 로컬 관리자가 배포한 퀴즈
        state.quizData = JSON.parse(localQuiz);
        state.problems = state.quizData.problems;
      } else {
        // 샘플 문제 사용
        state.quizData = this.getSampleQuiz();
        state.problems = state.quizData.problems;
      }

      // fullProblems가 없으면 problems를 그대로 사용 (로컬 모드)
      if (!state.quizData.fullProblems) {
        state.quizData.fullProblems = state.problems;
      }

      // 이전 답안 복구 (새로고침 대비)
      var savedAnswers = sessionStorage.getItem('quizAnswers');
      if (savedAnswers) {
        state.answers = JSON.parse(savedAnswers);
      } else {
        state.answers = new Array(state.problems.length).fill(null);
      }

      this.renderProgressDots();
      this.showProblem(0);
    },

    renderProgressDots: function() {
      var container = document.getElementById('problemDots');
      if (!container) return;
      container.innerHTML = '';

      for (var i = 0; i < state.problems.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'problem-dot';
        if (i === state.currentIndex) dot.className += ' current';
        if (state.answers[i] !== null) dot.className += ' answered';
        dot.textContent = i + 1;
        dot.setAttribute('data-index', i);
        dot.onclick = function() {
          MathQuiz.quizEngine.showProblem(parseInt(this.getAttribute('data-index')));
        };
        container.appendChild(dot);
      }

      // 진행 텍스트 업데이트
      var currentEl = document.getElementById('progressCurrent');
      if (currentEl) {
        currentEl.textContent = (state.currentIndex + 1) + ' / ' + state.problems.length;
      }
    },

    showProblem: function(index) {
      if (index < 0 || index >= state.problems.length) return;
      state.currentIndex = index;

      var p = state.problems[index];
      var area = document.getElementById('problemArea');
      if (!area) return;

      // 문제 번호 및 유형
      var typeLabel = p.type === 'multiple-choice' ? '객관식' : '주관식';
      var typeClass = p.type === 'multiple-choice' ? 'mc' : 'sa';

      var html = '<div class="problem-card fade-in">';
      html += '<span class="problem-number">문제 ' + (index + 1) + '</span>';
      html += '<span class="problem-type-badge ' + typeClass + '">' + typeLabel + '</span>';

      // 문제 텍스트
      html += '<div class="problem-question" data-math-text="' +
        this.escapeAttr(p.questionText) + '"></div>';

      // LaTeX 수식 (별도 블록)
      if (p.questionLatex) {
        html += '<div class="problem-question" style="text-align:center" data-latex="' +
          this.escapeAttr(p.questionLatex) + '" data-display></div>';
      }

      // SVG 도형
      if (p.svg) {
        html += '<div class="problem-svg">' + p.svg + '</div>';
      }

      // 답안 영역
      if (p.type === 'multiple-choice' && p.choices) {
        html += '<div class="choices">';
        var labels = ['\u2460', '\u2461', '\u2462', '\u2463'];
        for (var i = 0; i < p.choices.length; i++) {
          var selected = (state.answers[index] === i) ? ' selected' : '';
          html += '<button class="choice-btn' + selected + '" data-choice="' + i + '" onclick="MathQuiz.quizEngine.selectChoice(' + i + ')">';
          html += '<span class="choice-label">' + labels[i] + '</span>';
          html += '<span data-math-text="' + this.escapeAttr(p.choices[i]) + '"></span>';
          html += '</button>';
        }
        html += '</div>';
      } else {
        // 주관식
        var val = state.answers[index] || '';
        html += '<input type="text" class="answer-input" id="shortAnswer" ' +
          'inputmode="decimal" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
          'placeholder="답을 입력하세요" value="' + this.escapeAttr(val) + '" ' +
          'oninput="MathQuiz.quizEngine.onShortAnswerInput(this.value)">';
      }

      html += '</div>';
      area.innerHTML = html;

      // KaTeX 렌더링
      if (typeof MathQuiz.renderMath === 'function') {
        MathQuiz.renderMath(area);
      }

      // 진행 도트 업데이트
      this.renderProgressDots();

      // 네비게이션 버튼 업데이트
      this.updateNav();
    },

    selectChoice: function(choiceIndex) {
      state.answers[state.currentIndex] = choiceIndex;
      this.saveAnswers();

      // 선택 버튼만 갱신 (전체 리렌더링 방지 → 깜빡임 해소)
      var buttons = document.querySelectorAll('.choice-btn');
      for (var i = 0; i < buttons.length; i++) {
        if (parseInt(buttons[i].getAttribute('data-choice')) === choiceIndex) {
          buttons[i].classList.add('selected');
        } else {
          buttons[i].classList.remove('selected');
        }
      }
      this.renderProgressDots();
    },

    onShortAnswerInput: function(value) {
      state.answers[state.currentIndex] = value || null;
      this.saveAnswers();
      this.renderProgressDots();
    },

    saveAnswers: function() {
      sessionStorage.setItem('quizAnswers', JSON.stringify(state.answers));
    },

    updateNav: function() {
      var prevBtn = document.getElementById('prevBtn');
      var nextBtn = document.getElementById('nextBtn');
      var submitBtn = document.getElementById('submitBtn');

      if (prevBtn) prevBtn.style.display = state.currentIndex === 0 ? 'none' : '';
      if (nextBtn) nextBtn.style.display = state.currentIndex >= state.problems.length - 1 ? 'none' : '';
      if (submitBtn) submitBtn.style.display = state.currentIndex === state.problems.length - 1 ? '' : 'none';
    },

    prevProblem: function() {
      this.showProblem(state.currentIndex - 1);
    },

    nextProblem: function() {
      this.showProblem(state.currentIndex + 1);
    },

    confirmSubmit: function() {
      // 안 푼 문제 확인
      var unanswered = 0;
      for (var i = 0; i < state.answers.length; i++) {
        if (state.answers[i] === null) unanswered++;
      }

      var msg = '제출하시겠습니까?';
      if (unanswered > 0) {
        msg = '아직 ' + unanswered + '문제를 풀지 않았습니다.\n그래도 제출하시겠습니까?';
      }

      if (confirm(msg)) {
        this.submit();
      }
    },

    submit: function() {
      if (state.submitted) return;
      state.submitted = true;

      // 채점
      var result = this.grade();

      // 결과 저장 (result 페이지에서 사용)
      sessionStorage.setItem('quizResult', JSON.stringify(result));

      var goToResult = function() { window.location.href = 'result.html'; };

      // 서버에 제출 (완료 후 결과 페이지로 이동)
      if (MathQuiz.config.APPS_SCRIPT_URL && !sessionStorage.getItem('testMode')) {
        // 제출 중 표시
        var submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '제출 중...';
        }

        // 10초 안에 응답 없으면 그냥 이동 (타임아웃 안전장치)
        var timeout = setTimeout(goToResult, 10000);

        MathQuiz.api.submitResult({
          studentName: state.studentInfo.name,
          grade: state.studentInfo.grade,
          classNum: state.studentInfo.classNum,
          quizId: state.quizData.quizId || 'test',
          topic: state.quizData.topic || '테스트',
          score: result.score,
          total: result.total,
          wrongProblems: result.wrongProblems
        }).then(function() {
          clearTimeout(timeout);
          goToResult();
        }).catch(function(err) {
          console.error('결과 제출 실패:', err);
          clearTimeout(timeout);
          goToResult();
        });
      } else {
        goToResult();
      }
    },

    grade: function() {
      // 원본 문제 (정답 포함) - 관리자가 배포한 전체 데이터 또는 테스트 데이터
      var fullProblems = state.quizData.fullProblems || state.problems;
      var score = 0;
      var total = fullProblems.length;
      var details = [];
      var wrongProblems = [];

      for (var i = 0; i < fullProblems.length; i++) {
        var p = fullProblems[i];
        var userAnswer = state.answers[i];
        var isCorrect = false;

        if (p.type === 'multiple-choice') {
          isCorrect = (userAnswer === p.answerIndex);
        } else {
          // 주관식 비교
          isCorrect = MathQuiz.quizEngine.checkAnswer(userAnswer, p.answer);
        }

        if (isCorrect) score++;
        else wrongProblems.push('Q' + (i + 1));

        details.push({
          index: i,
          problem: p,
          userAnswer: userAnswer,
          isCorrect: isCorrect
        });
      }

      return {
        score: score,
        total: total,
        percentage: total > 0 ? Math.round(score / total * 100) : 0,
        details: details,
        wrongProblems: wrongProblems,
        studentInfo: state.studentInfo
      };
    },

    checkAnswer: function(userInput, correctAnswer) {
      if (userInput === null || userInput === undefined) return false;

      var normalize = function(s) {
        return String(s).replace(/\s+/g, '')
          .replace(/，/g, ',').replace(/．/g, '.').replace(/－/g, '-')
          .toLowerCase();
      };

      var user = normalize(userInput);
      var correct = normalize(correctAnswer);

      if (user === correct) return true;

      // 숫자 비교 (3.0 == 3, 1/2 == 0.5)
      var evalFraction = function(s) {
        if (s.indexOf('/') !== -1) {
          var parts = s.split('/');
          if (parts.length === 2) return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        return parseFloat(s);
      };

      var userNum = evalFraction(user);
      var correctNum = evalFraction(correct);
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        return Math.abs(userNum - correctNum) < 0.0001;
      }

      return false;
    },

    escapeAttr: function(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    // 테스트용 샘플 퀴즈
    getSampleQuiz: function() {
      return {
        quizId: 'sample-001',
        grade: 3,
        topic: '이차방정식 (샘플)',
        problems: [
          {
            type: 'multiple-choice',
            questionText: '다음 이차방정식의 해를 구하시오.',
            questionLatex: 'x^2 - 5x + 6 = 0',
            svg: null,
            choices: ['$x = 1, x = 6$', '$x = 2, x = 3$', '$x = -2, x = -3$', '$x = -1, x = -6$'],
            answer: 'x = 2, x = 3',
            answerIndex: 1,
            explanation: '$(x-2)(x-3) = 0$이므로 $x = 2$ 또는 $x = 3$'
          },
          {
            type: 'short-answer',
            questionText: '다음 이차방정식의 두 근의 합을 구하시오.',
            questionLatex: 'x^2 + 7x + 12 = 0',
            svg: null,
            choices: null,
            answer: '-7',
            answerIndex: null,
            explanation: '근과 계수의 관계에 의해 두 근의 합은 $-7$'
          },
          {
            type: 'multiple-choice',
            questionText: '다음 중 이차방정식이 아닌 것은?',
            questionLatex: null,
            svg: null,
            choices: ['$x^2 + 3x - 1 = 0$', '$2x^2 = 8$', '$x^2 - x^2 + 3x = 0$', '$-x^2 + 5 = 0$'],
            answer: 'x^2 - x^2 + 3x = 0',
            answerIndex: 2,
            explanation: '$x^2 - x^2 + 3x = 0$은 정리하면 $3x = 0$으로 일차방정식입니다.'
          }
        ],
        fullProblems: null
      };
      // fullProblems가 null이면 problems 자체에서 채점
    }
  };

  // fullProblems 설정 (sample에서는 problems = fullProblems)
  var sample = MathQuiz.quizEngine.getSampleQuiz();
  sample.fullProblems = sample.problems;
})();
