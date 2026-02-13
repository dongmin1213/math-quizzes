// 관리자 페이지 엔진
(function() {
  var currentProblems = null;
  var isAuthenticated = false;

  MathQuiz.admin = {
    init: function() {
      this.setupTabs();
      this.checkAuth();
    },

    // 비밀번호 인증
    checkAuth: function() {
      var saved = sessionStorage.getItem('adminAuth');
      if (saved === MathQuiz.config.ADMIN_PASSWORD) {
        this.showMain();
      }
    },

    login: function() {
      var pw = document.getElementById('adminPassword').value;
      var errorEl = document.getElementById('loginError');

      if (pw === MathQuiz.config.ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', pw);
        this.showMain();
      } else {
        errorEl.textContent = '비밀번호가 틀립니다.';
        errorEl.classList.remove('hidden');
      }
    },

    showMain: function() {
      isAuthenticated = true;
      document.getElementById('loginSection').classList.add('hidden');
      document.getElementById('mainSection').classList.remove('hidden');
      this.populateTopics();
    },

    // 탭 전환
    setupTabs: function() {
      var tabs = document.querySelectorAll('.admin-tab');
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
          var target = this.getAttribute('data-tab');
          document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
          document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
          this.classList.add('active');
          document.getElementById('tab-' + target).classList.add('active');

          if (target === 'results') {
            MathQuiz.admin.loadResults();
          }
        });
      }
    },

    // 학년 변경 시 단원 목록 업데이트
    populateTopics: function() {
      var gradeSelect = document.getElementById('genGrade');
      if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
          MathQuiz.admin.updateTopicList();
        });
        this.updateTopicList();
      }
    },

    updateTopicList: function() {
      var grade = parseInt(document.getElementById('genGrade').value);
      var topicSelect = document.getElementById('genTopic');
      topicSelect.innerHTML = '<option value="">단원을 선택하세요</option>';

      if (!grade || !MathQuiz.config.GRADES[grade]) return;

      var topics = MathQuiz.config.GRADES[grade].topics;

      // 실제 등록된 생성기만 활성화
      var available = MathQuiz.getAvailableGenerators(grade);
      var availableIds = {};
      for (var i = 0; i < available.length; i++) {
        availableIds[available[i].topicId] = true;
      }

      for (var j = 0; j < topics.length; j++) {
        var opt = document.createElement('option');
        opt.value = topics[j].id;
        opt.textContent = topics[j].name;
        if (!availableIds[topics[j].id]) {
          opt.disabled = true;
          opt.textContent += ' (준비 중)';
        }
        topicSelect.appendChild(opt);
      }
    },

    // 문제 생성
    generate: function() {
      var grade = parseInt(document.getElementById('genGrade').value);
      var topicId = document.getElementById('genTopic').value;
      var count = parseInt(document.getElementById('genCount').value) || 10;
      var difficulty = parseInt(document.getElementById('genDifficulty').value) || 2;
      var mcRatio = parseInt(document.getElementById('genMcRatio').value) / 100;

      var statusEl = document.getElementById('genStatus');
      var previewEl = document.getElementById('previewArea');

      if (!grade || !topicId) {
        statusEl.innerHTML = '<div class="message message-error">학년과 단원을 선택해주세요.</div>';
        return;
      }

      try {
        currentProblems = MathQuiz.generateQuiz(grade, topicId, count, difficulty, mcRatio);

        // 단원명 찾기
        var topicName = '';
        var topics = MathQuiz.config.GRADES[grade].topics;
        for (var i = 0; i < topics.length; i++) {
          if (topics[i].id === topicId) { topicName = topics[i].name; break; }
        }

        statusEl.innerHTML = '<div class="message message-success">' +
          currentProblems.length + '개 문제가 생성되었습니다!</div>';

        // 미리보기 렌더링
        this.renderPreview(currentProblems, topicName);

        // 배포 버튼 표시
        document.getElementById('deploySection').classList.remove('hidden');

      } catch (err) {
        statusEl.innerHTML = '<div class="message message-error">생성 실패: ' + err.message + '</div>';
        console.error(err);
      }
    },

    renderPreview: function(problems, topicName) {
      var el = document.getElementById('previewArea');
      var html = '<h3 style="margin-bottom:12px">' + topicName + ' - 미리보기 (' + problems.length + '문제)</h3>';
      html += '<div class="preview-list">';

      for (var i = 0; i < problems.length; i++) {
        var p = problems[i];
        var typeLabel = p.type === 'multiple-choice' ? '객관식' : '주관식';
        var typeClass = p.type === 'multiple-choice' ? 'mc' : 'sa';

        html += '<div class="preview-item">';
        html += '<span class="problem-number">문제 ' + (i + 1) + '</span>';
        html += '<span class="problem-type-badge ' + typeClass + '">' + typeLabel + '</span>';
        html += '<div class="problem-question" data-math-text="' + escapeAttr(p.questionText) + '" style="margin:10px 0"></div>';

        if (p.questionLatex) {
          html += '<div data-latex="' + escapeAttr(p.questionLatex) + '" data-display style="margin:8px 0"></div>';
        }

        if (p.svg) {
          html += '<div class="problem-svg">' + p.svg + '</div>';
        }

        if (p.type === 'multiple-choice' && p.choices) {
          var labels = ['\u2460', '\u2461', '\u2462', '\u2463'];
          html += '<div style="margin:8px 0;font-size:14px">';
          for (var j = 0; j < p.choices.length; j++) {
            var mark = j === p.answerIndex ? ' <strong style="color:var(--success)">[정답]</strong>' : '';
            html += '<div style="padding:4px 0">' + labels[j] + ' <span data-math-text="' +
              escapeAttr(p.choices[j]) + '"></span>' + mark + '</div>';
          }
          html += '</div>';
        } else {
          html += '<div style="font-size:14px;color:var(--success)">정답: <span data-math-text="' +
            escapeAttr(p.answer) + '"></span></div>';
        }

        if (p.explanation) {
          html += '<div style="font-size:13px;color:var(--text-light);margin-top:6px">해설: <span data-math-text="' +
            escapeAttr(p.explanation) + '"></span></div>';
        }

        html += '</div>';
      }

      html += '</div>';
      el.innerHTML = html;

      // KaTeX 렌더링
      if (typeof MathQuiz.renderMath === 'function') {
        MathQuiz.renderMath(el);
      }
    },

    // 퀴즈 배포
    deploy: function() {
      if (!currentProblems || currentProblems.length === 0) {
        alert('먼저 문제를 생성해주세요.');
        return;
      }

      var grade = document.getElementById('genGrade').value;
      var topicId = document.getElementById('genTopic').value;
      var topicName = '';
      var topics = MathQuiz.config.GRADES[parseInt(grade)].topics;
      for (var i = 0; i < topics.length; i++) {
        if (topics[i].id === topicId) { topicName = topics[i].name; break; }
      }

      var deployBtn = document.getElementById('deployBtn');
      var deployStatus = document.getElementById('deployStatus');

      // Apps Script URL 미설정 시
      if (!MathQuiz.config.APPS_SCRIPT_URL) {
        deployStatus.innerHTML = '<div class="message message-info">' +
          'Google Apps Script URL이 설정되지 않았습니다.<br>' +
          '<strong>로컬 테스트 모드:</strong> 문제가 브라우저에 저장됩니다.<br>' +
          '실제 배포하려면 config.js에 APPS_SCRIPT_URL을 설정하세요.</div>';

        // 로컬 스토리지에 저장 (테스트용)
        var quizData = {
          quizId: 'local-' + Date.now(),
          grade: grade,
          topic: topicName,
          createdAt: new Date().toISOString(),
          problemCount: currentProblems.length,
          problems: currentProblems,
          fullProblems: currentProblems
        };
        localStorage.setItem('localQuiz', JSON.stringify(quizData));
        deployStatus.innerHTML += '<div class="message message-success" style="margin-top:8px">로컬 저장 완료! 학생 페이지에서 테스트할 수 있습니다.</div>';
        return;
      }

      deployBtn.disabled = true;
      deployBtn.textContent = '배포 중...';
      deployStatus.innerHTML = '<div class="message message-info" style="font-size:13px">Google 서버에 전송 중입니다. 처음에는 최대 10초 정도 걸릴 수 있습니다.</div>';

      MathQuiz.api.deployQuiz({
        password: sessionStorage.getItem('adminAuth'),
        grade: grade,
        topic: topicName,
        problems: currentProblems
      }).then(function(res) {
        if (res.success) {
          deployStatus.innerHTML = '<div class="message message-success">' +
            '배포 완료! 학생들이 바로 퀴즈를 풀 수 있습니다.<br>' +
            '퀴즈 ID: ' + res.quizId + '</div>';
        } else {
          deployStatus.innerHTML = '<div class="message message-error">배포 실패: ' +
            (res.error || '알 수 없는 오류') + '</div>';
        }
        deployBtn.disabled = false;
        deployBtn.textContent = '배포하기';
      }).catch(function(err) {
        deployStatus.innerHTML = '<div class="message message-error">서버 연결 실패. 인터넷을 확인해주세요.</div>';
        deployBtn.disabled = false;
        deployBtn.textContent = '배포하기';
      });
    },

    // 결과 조회
    loadResults: function() {
      var container = document.getElementById('resultsContainer');

      if (!MathQuiz.config.APPS_SCRIPT_URL) {
        container.innerHTML = '<div class="message message-info">Google Apps Script URL이 설정되지 않아 결과를 조회할 수 없습니다.</div>';
        return;
      }

      container.innerHTML = '<div class="loading"><div class="spinner"></div><p style="margin-top:8px">결과를 불러오는 중...</p><p style="font-size:13px;color:var(--text-light)">처음에는 최대 10초 정도 걸릴 수 있습니다.</p></div>';

      MathQuiz.api.getResults(sessionStorage.getItem('adminAuth'))
        .then(function(res) {
          if (res.success) {
            MathQuiz.admin.renderResults(res.data);
          } else {
            container.innerHTML = '<div class="message message-error">' + (res.error || '조회 실패') + '</div>';
          }
        }).catch(function(err) {
          container.innerHTML = '<div class="message message-error">서버 연결 실패</div>';
        });
    },

    renderResults: function(data) {
      var container = document.getElementById('resultsContainer');

      if (!data || data.length === 0) {
        container.innerHTML = '<div class="message message-info">아직 제출된 결과가 없습니다.</div>';
        return;
      }

      // 통계
      var totalScore = 0, totalCount = data.length;
      for (var i = 0; i < data.length; i++) {
        var pct = data[i]['총문제수'] > 0 ? data[i]['점수'] / data[i]['총문제수'] * 100 : 0;
        totalScore += pct;
      }
      var avgScore = (totalScore / totalCount).toFixed(1);

      var html = '';
      html += '<div class="stats-grid">';
      html += '<div class="stat-card"><div class="stat-value">' + totalCount + '</div><div class="stat-label">제출 수</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + avgScore + '%</div><div class="stat-label">평균 정답률</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + data[data.length - 1]['단원'] + '</div><div class="stat-label">최근 단원</div></div>';
      html += '</div>';

      // 테이블
      html += '<div style="overflow-x:auto"><table class="result-table">';
      html += '<thead><tr><th>이름</th><th>학년</th><th>반</th><th>단원</th><th>점수</th><th>정답률</th><th>제출시간</th></tr></thead>';
      html += '<tbody>';

      // 최신순 정렬
      var sorted = data.slice().reverse();
      for (var j = 0; j < sorted.length; j++) {
        var r = sorted[j];
        var time = r['제출시간'] ? new Date(r['제출시간']).toLocaleString('ko-KR') : '';
        html += '<tr>';
        html += '<td><strong>' + (r['학생이름'] || '') + '</strong></td>';
        html += '<td>중' + (r['학년'] || '') + '</td>';
        html += '<td>' + (r['반'] || '') + '</td>';
        html += '<td>' + (r['단원'] || '') + '</td>';
        html += '<td>' + (r['점수'] || 0) + '/' + (r['총문제수'] || 0) + '</td>';
        html += '<td>' + (r['정답률'] || '') + '</td>';
        html += '<td style="font-size:12px;color:var(--text-light)">' + time + '</td>';
        html += '</tr>';
      }

      html += '</tbody></table></div>';
      container.innerHTML = html;
    }
  };

  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
