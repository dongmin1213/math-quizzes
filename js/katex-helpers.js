// KaTeX 수식 렌더링 유틸리티
(function() {
  MathQuiz.renderMath = function(container) {
    if (typeof katex === 'undefined') return;

    // data-latex 속성을 가진 요소들 렌더링
    var els = container.querySelectorAll('[data-latex]');
    for (var i = 0; i < els.length; i++) {
      try {
        katex.render(els[i].getAttribute('data-latex'), els[i], {
          throwOnError: false,
          displayMode: els[i].hasAttribute('data-display'),
          strict: false
        });
      } catch (e) {
        els[i].textContent = els[i].getAttribute('data-latex');
      }
    }

    // data-math-text 속성: 텍스트 내의 $...$ 구분자 처리
    var textEls = container.querySelectorAll('[data-math-text]');
    for (var j = 0; j < textEls.length; j++) {
      var text = textEls[j].getAttribute('data-math-text');
      textEls[j].innerHTML = MathQuiz.renderInlineLatex(text);
    }
  };

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // $...$ 구분자를 KaTeX로 변환
  MathQuiz.renderInlineLatex = function(text) {
    if (!text) return '';
    // 수식 토큰을 플레이스홀더로 치환 → 텍스트 이스케이프 → 수식 복원
    var tokens = [];
    var placeholder = function(rendered) {
      var idx = tokens.length;
      tokens.push(rendered);
      return '\x00MATH' + idx + '\x00';
    };
    var result = text.replace(/\$\$(.+?)\$\$/g, function(match, latex) {
      try {
        return placeholder(katex.renderToString(latex, { throwOnError: false, displayMode: true }));
      } catch (e) {
        return placeholder(escapeHtml(match));
      }
    }).replace(/\$(.+?)\$/g, function(match, latex) {
      try {
        return placeholder(katex.renderToString(latex, { throwOnError: false, displayMode: false }));
      } catch (e) {
        return placeholder(escapeHtml(match));
      }
    });
    // 수식 외부 텍스트를 이스케이프
    result = result.replace(/([^\x00]+)/g, function(m) {
      if (m.indexOf('MATH') === 0 && m.match(/^MATH\d+$/)) return m;
      return escapeHtml(m);
    });
    // 플레이스홀더를 수식 HTML로 복원
    result = result.replace(/\x00MATH(\d+)\x00/g, function(m, idx) {
      return tokens[parseInt(idx, 10)];
    });
    return result;
  };
})();
