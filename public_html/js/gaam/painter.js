/**
 * @param {number=} opt_maxTrailLength
 * @constructor
 */
function Painter(opt_maxTrailLength) {
  this.events = new CircularQueue(opt_maxTrailLength || 1);
  this.now = 0;
}

/**
 * @param {PaintEvent} event
 */
Painter.prototype.addEvent = function(event) {
  this.events.enqueue(event);
};

/**
 * Override to add more computation, like maybe spark calculations.
 * @param {number} now
 */
Painter.prototype.advance = function(now) {
  this.now = now;
};

/**
 * @param {Object} renderer  The API the painter uses to paint with.
 * @param {number} layer  When painting happens in multpile layers,
 * for debugging or because the order matters visually, this is important.
 */
Painter.prototype.paint = function(renderer, layer) {
  throw new Error("you gotta implement Painter.paint() in your subclasses");
};

/**
 * @return {boolean} true iff the painter is never going to paint again,
 * and can be reused or garbage collected by the Gaam.
 */
Painter.prototype.isKaput = function() {
  throw new Error("isKaput is unimplemented");
};
