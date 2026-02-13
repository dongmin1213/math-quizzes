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

  // $...$ 구분자를 KaTeX로 변환
  MathQuiz.renderInlineLatex = function(text) {
    if (!text) return '';
    return text.replace(/\$\$(.+?)\$\$/g, function(match, latex) {
      try {
        return katex.renderToString(latex, { throwOnError: false, displayMode: true });
      } catch (e) {
        return match;
      }
    }).replace(/\$(.+?)\$/g, function(match, latex) {
      try {
        return katex.renderToString(latex, { throwOnError: false, displayMode: false });
      } catch (e) {
        return match;
      }
    });
  };
})();
