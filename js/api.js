// Google Sheets API 통신 레이어
(function() {
  MathQuiz.api = {
    // 현재 퀴즈 불러오기 (학생용, 학년별)
    loadQuiz: function(grade) {
      var url = MathQuiz.config.APPS_SCRIPT_URL +
        '?action=getQuiz&grade=' + encodeURIComponent(grade);
      return fetch(url, { redirect: 'follow' })
        .then(function(res) { return res.json(); });
    },

    // 퀴즈 배포 (관리자용)
    deployQuiz: function(data) {
      return fetch(MathQuiz.config.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deployQuiz',
          password: data.password,
          grade: data.grade,
          topic: data.topic,
          problems: data.problems
        }),
        redirect: 'follow'
      }).then(function(res) { return res.json(); });
    },

    // 학생 결과 제출
    submitResult: function(data) {
      return fetch(MathQuiz.config.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submitResult',
          studentName: data.studentName,
          grade: data.grade,
          classNum: data.classNum,
          quizId: data.quizId,
          topic: data.topic,
          score: data.score,
          total: data.total,
          wrongProblems: data.wrongProblems
        }),
        redirect: 'follow'
      }).then(function(res) { return res.json(); });
    },

    // 결과 조회 (관리자용)
    getResults: function(password) {
      var url = MathQuiz.config.APPS_SCRIPT_URL +
        '?action=getResults&password=' + encodeURIComponent(password);
      return fetch(url, { redirect: 'follow' })
        .then(function(res) { return res.json(); });
    },

    // 배포 현황 조회 (관리자용)
    getDeployedStatus: function(password) {
      var url = MathQuiz.config.APPS_SCRIPT_URL +
        '?action=getDeployedStatus&password=' + encodeURIComponent(password);
      return fetch(url, { redirect: 'follow' })
        .then(function(res) { return res.json(); });
    }
  };
})();
