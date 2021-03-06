/**
 * Renders all of Fracas2 using an HTML5 canvas.
 * @constructor
 */
function Renderer(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.context.font = "bold 14px monospace";
  this.context.lineWidth = 2;
  this.canvasWidth = this.canvas.width;
  this.canvasHeight = this.canvas.height;
  this.lastTimeSec = (new Date()).getTime() / 1000;
  this.frameCount = 0;
  this.fps = 0;
  this.posVec = new Vec2d();
  this.radVec = new Vec2d();
}

Renderer.prototype.cameraX = 0;
Renderer.prototype.cameraY = 0;

Renderer.prototype.zoom = 1;

Renderer.prototype.setCenter = function(x, y) {
  this.cameraX = x;
  this.cameraY = y;
};

Renderer.prototype.setZoom = function(zoom) {
  this.zoom = zoom;
};

Renderer.prototype.clear = function() {
  var c = this.context;
  c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
//  this.setFillStyle('rgb(0, 0, 0)');
//  c.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

  this.context.lineWidth = 100;
  this.context.strokeStyle = 'rgb(255, 255, 255)';
  this.context.fillStyle = 'rgb(255, 255, 255)';
};

Renderer.prototype.transformStart = function() {
  var c = this.context;
  c.save();
  c.translate(this.canvasWidth/2, this.canvasHeight/2);
  c.scale(this.zoom, this.zoom);
  c.translate(-this.cameraX, -this.cameraY);
};

Renderer.prototype.transformEnd = function() {
  this.context.restore();
};

Renderer.prototype.stats = function() {
  var c = this.context;
  this.frameCount++;
  if (this.frameCount >= 30) {
    var newTimeSec = (new Date()).getTime() / 1000;
    this.fps = Math.round(this.frameCount / (newTimeSec - this.lastTimeSec));
    this.lastTimeSec = newTimeSec;
    this.frameCount = 0;
  }
  c.restore();
  c.textBaseline = "top";
  c.textSize = "14pt";
  c.fontFamily = "monospace";
  this.setFillStyle("rgb(128, 128, 128)");
  c.fillText(this.fps + ' ' + GU_nextDelay, 2, 2);
};

Renderer.prototype.setFillStyle = function(style) {
  this.context.fillStyle = style;
};

Renderer.prototype.setStrokeStyle = function(style) {
  this.context.strokeStyle = style;
};

Renderer.prototype.fillRectSprite = function(s) {
  var p = s.getPos(Vec2d.alloc());
  this.context.fillRect(
      p.x - s.rx, p.y - s.ry,
      s.rx * 2, s.ry * 2);
  Vec2d.free(p);
};

Renderer.prototype.strokeRectSprite = function(s) {
  var p = s.getPos(Vec2d.alloc());
  this.context.strokeRect(
      p.x - s.rx, p.y - s.ry,
      s.rx * 2, s.ry * 2);
  Vec2d.free(p);
};

Renderer.prototype.fillRectPosXYRadXY = function(px, py, rx, ry) {
  this.context.fillRect(
      px - rx, py - ry,
      rx * 2, ry * 2);
};

Renderer.prototype.strokeRectPosXYRadXY = function(px, py, rx, ry) {
  this.context.strokeRect(
      px - rx, py - ry,
      rx * 2, ry * 2);
};

Renderer.prototype.drawLineXYXY = function(x0, y0, x1, y1) {
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.lineTo(x1, y1);
  this.context.stroke();
};

Renderer.prototype.drawLineVV = function(v0, v1) {
  this.context.beginPath();
  this.context.moveTo(v0.x, v0.y);
  this.context.lineTo(v1.x, v1.y);
  this.context.stroke();
};

Renderer.prototype.drawMark = function(mark) {
  this.context.lineWidth = 4;
  switch (mark.type) {
    case Mark.Type.DRAWRECT:
      this.setStrokeStyle(mark.style);
      this.context.strokeRect(mark.x0, mark.y0, mark.x1 - mark.x0, mark.y1 - mark.y0);
      break;
    case Mark.Type.FILLRECT:
      this.setFillStyle(mark.style);
      this.context.fillRect(mark.x0, mark.y0, mark.x1, mark.y1);
      break;
    case Mark.Type.LINE:
      this.context.beginPath();
      this.setStrokeStyle(mark.style);
      this.context.moveTo(mark.x0, mark.y0);
      this.context.lineTo(mark.x1, mark.y1);
      this.context.stroke();
      break;
  }
};
