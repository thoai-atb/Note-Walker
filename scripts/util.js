CanvasRenderingContext2D.prototype.roundedRectangle = function(x, y, width, height, rounded) {
  const radiansInCircle = 2 * Math.PI
  const halfRadians = (2 * Math.PI)/2
  const quarterRadians = (2 * Math.PI)/4
  x -= width/2
  y -= height/2

  // top left arc
  this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)

  // line from top left to bottom left
  this.lineTo(x, y + height - rounded)

  // bottom left arc
  this.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)

  // line from bottom left to bottom right
  this.lineTo(x + width - rounded, y + height)

  // bottom right arc
  this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)

  // line from bottom right to top right
  this.lineTo(x + width, y + rounded)

  // top right arc
  this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)

  // line from top right to top left
  this.lineTo(x + rounded, y)
}

Math.lerp = function(a, b, l){
  return a + l * (b - a);
}

function lerpColor(a, b, amount) {
    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
