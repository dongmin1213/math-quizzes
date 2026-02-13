// SVG 도형 생성 헬퍼
(function() {
  MathQuiz.svg = {
    // SVG 캔버스 시작
    open: function(width, height) {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        width + ' ' + height + '" style="max-width:' + width + 'px;width:100%;height:auto;">';
    },

    close: function() { return '</svg>'; },

    // 기본 도형
    line: function(x1, y1, x2, y2, opts) {
      opts = opts || {};
      var stroke = opts.stroke || '#333';
      var width = opts.strokeWidth || 2;
      var dash = opts.dash ? ' stroke-dasharray="' + opts.dash + '"' : '';
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
        '" stroke="' + stroke + '" stroke-width="' + width + '"' + dash + '/>';
    },

    circle: function(cx, cy, r, opts) {
      opts = opts || {};
      var fill = opts.fill || 'none';
      var stroke = opts.stroke || '#333';
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
        '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (opts.strokeWidth || 2) + '"/>';
    },

    polygon: function(points, opts) {
      opts = opts || {};
      var fill = opts.fill || 'none';
      var stroke = opts.stroke || '#333';
      var pts = points.map(function(p) { return p[0] + ',' + p[1]; }).join(' ');
      return '<polygon points="' + pts + '" fill="' + fill +
        '" stroke="' + stroke + '" stroke-width="' + (opts.strokeWidth || 2) + '"/>';
    },

    text: function(x, y, content, opts) {
      opts = opts || {};
      var size = opts.fontSize || 14;
      var anchor = opts.anchor || 'middle';
      var fill = opts.fill || '#333';
      return '<text x="' + x + '" y="' + y + '" font-size="' + size +
        '" text-anchor="' + anchor + '" fill="' + fill +
        '" font-family="sans-serif">' + content + '</text>';
    },

    arc: function(cx, cy, r, startDeg, endDeg, opts) {
      opts = opts || {};
      var startRad = (startDeg * Math.PI) / 180;
      var endRad = (endDeg * Math.PI) / 180;
      var x1 = cx + r * Math.cos(startRad);
      var y1 = cy - r * Math.sin(startRad);
      var x2 = cx + r * Math.cos(endRad);
      var y2 = cy - r * Math.sin(endRad);
      var largeArc = (endDeg - startDeg > 180) ? 1 : 0;
      var d = 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' +
        largeArc + ' 0 ' + x2 + ' ' + y2;
      return '<path d="' + d + '" fill="none" stroke="' +
        (opts.stroke || '#333') + '" stroke-width="' + (opts.strokeWidth || 1.5) + '"/>';
    },

    // 고수준 도형: 삼각형
    triangle: function(ax, ay, bx, by, cx, cy, labels) {
      labels = labels || {};
      var s = '';
      s += this.polygon([[ax, ay], [bx, by], [cx, cy]]);
      if (labels.A) s += this.text(ax + (ax < (bx + cx) / 2 ? -12 : 12), ay - 8, labels.A);
      if (labels.B) s += this.text(bx + (bx < ax ? -12 : 12), by + 18, labels.B);
      if (labels.C) s += this.text(cx + (cx > ax ? 12 : -12), cy + 18, labels.C);
      return s;
    },

    // 직각 표시
    rightAngle: function(vx, vy, p1x, p1y, p2x, p2y, size) {
      size = size || 12;
      var dx1 = (p1x - vx), dy1 = (p1y - vy);
      var dx2 = (p2x - vx), dy2 = (p2y - vy);
      var len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      var len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      dx1 = dx1 / len1 * size; dy1 = dy1 / len1 * size;
      dx2 = dx2 / len2 * size; dy2 = dy2 / len2 * size;
      var ax = vx + dx1, ay = vy + dy1;
      var bx = vx + dx1 + dx2, by = vy + dy1 + dy2;
      var cx = vx + dx2, cy = vy + dy2;
      return '<polyline points="' + ax + ',' + ay + ' ' + bx + ',' + by + ' ' +
        cx + ',' + cy + '" fill="none" stroke="#333" stroke-width="1.5"/>';
    },

    // 좌표 그리드
    coordinateGrid: function(xMin, xMax, yMin, yMax, width, height, opts) {
      opts = opts || {};
      var padding = 30;
      var w = width - padding * 2;
      var h = height - padding * 2;
      var scaleX = w / (xMax - xMin);
      var scaleY = h / (yMax - yMin);
      var ox = padding + (-xMin) * scaleX;
      var oy = padding + yMax * scaleY;

      var s = '';
      // 격자
      for (var x = xMin; x <= xMax; x++) {
        var px = padding + (x - xMin) * scaleX;
        s += this.line(px, padding, px, height - padding, { stroke: '#e0e0e0', strokeWidth: 1 });
        if (x !== 0) s += this.text(px, oy + 16, x, { fontSize: 11 });
      }
      for (var y = yMin; y <= yMax; y++) {
        var py = padding + (yMax - y) * scaleY;
        s += this.line(padding, py, width - padding, py, { stroke: '#e0e0e0', strokeWidth: 1 });
        if (y !== 0) s += this.text(ox - 14, py + 4, y, { fontSize: 11 });
      }
      // 축
      s += this.line(padding, oy, width - padding, oy, { stroke: '#333', strokeWidth: 2 });
      s += this.line(ox, padding, ox, height - padding, { stroke: '#333', strokeWidth: 2 });
      s += this.text(width - padding + 14, oy + 4, 'x', { fontSize: 13 });
      s += this.text(ox + 2, padding - 8, 'y', { fontSize: 13 });
      s += this.text(ox - 10, oy + 16, 'O', { fontSize: 11 });

      return { svg: s, toPixel: function(x, y) { return [padding + (x - xMin) * scaleX, padding + (yMax - y) * scaleY]; } };
    },

    // 점 표시
    dot: function(x, y, opts) {
      opts = opts || {};
      return '<circle cx="' + x + '" cy="' + y + '" r="' +
        (opts.r || 4) + '" fill="' + (opts.fill || '#4A90D9') + '"/>';
    }
  };
})();
