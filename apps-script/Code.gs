/**
 * 수학 퀴즈 - Google Apps Script 백엔드
 *
 * 설정 방법:
 * 1. Google Sheets에서 "확장 프로그램" > "Apps Script" 클릭
 * 2. 이 코드를 붙여넣기
 * 3. "배포" > "새 배포" > 유형: "웹 앱"
 * 4. "다음 사용자 인증 정보로 실행": 나 (본인 계정)
 * 5. "액세스 권한이 있는 사용자": 모든 사용자
 * 6. "배포" 클릭 → URL 복사 → config.js의 APPS_SCRIPT_URL에 입력
 *
 * 시트 구조 (자동 생성됨):
 * - "현재퀴즈": 현재 활성 퀴즈 데이터
 * - "결과": 학생 제출 결과
 */

var ADMIN_PASSWORD = 'math1234'; // config.js와 동일하게 설정

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'getQuiz') {
    return handleGetQuiz();
  }

  if (action === 'getResults') {
    if (e.parameter.password !== ADMIN_PASSWORD) {
      return jsonResponse({ success: false, error: '비밀번호가 틀립니다.' });
    }
    return handleGetResults();
  }

  return jsonResponse({ success: false, error: '알 수 없는 요청입니다.' });
}

function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: '잘못된 데이터 형식입니다.' });
  }

  var action = payload.action;

  if (action === 'deployQuiz') {
    if (payload.password !== ADMIN_PASSWORD) {
      return jsonResponse({ success: false, error: '비밀번호가 틀립니다.' });
    }
    return handleDeployQuiz(payload);
  }

  if (action === 'submitResult') {
    return handleSubmitResult(payload);
  }

  return jsonResponse({ success: false, error: '알 수 없는 요청입니다.' });
}

function handleGetQuiz() {
  var sheet = getOrCreateSheet('현재퀴즈');
  var data = sheet.getRange('A2:F2').getValues()[0];

  if (!data[0]) {
    return jsonResponse({ success: false, error: '현재 진행 중인 퀴즈가 없습니다.' });
  }

  var problems;
  try {
    problems = JSON.parse(data[5]);
  } catch (err) {
    return jsonResponse({ success: false, error: '퀴즈 데이터를 읽을 수 없습니다.' });
  }

  // 학생에게 보낼 때 정답 정보 제거
  var safeProblems = problems.map(function(p) {
    var copy = {};
    for (var key in p) {
      if (key !== 'answer' && key !== 'answerIndex' && key !== 'explanation') {
        copy[key] = p[key];
      }
    }
    return copy;
  });

  return jsonResponse({
    success: true,
    data: {
      quizId: data[0],
      grade: data[1],
      topic: data[2],
      createdAt: data[3],
      problemCount: data[4],
      problems: safeProblems
    }
  });
}

function handleDeployQuiz(payload) {
  var sheet = getOrCreateSheet('현재퀴즈');
  var quizId = 'quiz-' + new Date().getTime();

  // 헤더가 없으면 추가
  if (!sheet.getRange('A1').getValue()) {
    sheet.getRange('A1:F1').setValues([['quizId', 'grade', 'topic', 'createdAt', 'problemCount', 'quizJSON']]);
  }

  sheet.getRange('A2:F2').setValues([[
    quizId,
    payload.grade,
    payload.topic,
    new Date().toISOString(),
    payload.problems.length,
    JSON.stringify(payload.problems)
  ]]);

  return jsonResponse({ success: true, quizId: quizId });
}

function handleSubmitResult(payload) {
  var sheet = getOrCreateSheet('결과');

  // 헤더가 없으면 추가
  if (!sheet.getRange('A1').getValue()) {
    sheet.getRange('A1:J1').setValues([[
      '제출시간', '학생이름', '학년', '반', 'quizId', '단원', '점수', '총문제수', '정답률', '오답목록'
    ]]);
  }

  // 중복 제출 확인
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === payload.studentName &&
        data[i][2] == payload.grade &&
        data[i][3] === payload.classNum &&
        data[i][4] === payload.quizId) {
      return jsonResponse({ success: false, error: '이미 제출했습니다.' });
    }
  }

  var accuracy = payload.total > 0
    ? (payload.score / payload.total * 100).toFixed(1) + '%'
    : '0%';

  sheet.appendRow([
    new Date().toISOString(),
    payload.studentName,
    payload.grade,
    payload.classNum,
    payload.quizId,
    payload.topic,
    payload.score,
    payload.total,
    accuracy,
    JSON.stringify(payload.wrongProblems || [])
  ]);

  return jsonResponse({ success: true });
}

function handleGetResults() {
  var sheet = getOrCreateSheet('결과');
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return jsonResponse({ success: true, data: [] });
  }

  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }

  return jsonResponse({ success: true, data: rows });
}

// 시트 가져오기 (없으면 생성)
function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// JSON 응답 생성
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
