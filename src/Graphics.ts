class Graphics {
  private ctx: CanvasRenderingContext2D;

  private fontSize = 12;
  private fontFace = "sans-serif";
  private textColor = "black";
  private borderColor = "black";
  private fillColor = "white";

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.configContext();
  }
  private configContext() {
    let ctx = this.ctx;
    ctx.font = this.fontSize + "px " + this.fontFace;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    borderColor = this.borderColor,
    fillColor = this.fillColor
  ) {
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fillRect(x, y, w, h);
    }
    if (borderColor) {
      this.ctx.strokeStyle = borderColor;
      this.ctx.strokeRect(x, y, w, h);
    }
  }

  ellipse(
    x: number,
    y: number,
    w: number,
    h: number,
    borderColor = this.borderColor,
    fillColor = this.fillColor
  ) {
    if (fillColor) {
      this.ctx.beginPath();
      this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (borderColor) {
      this.ctx.beginPath();
      this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
      this.ctx.strokeStyle = borderColor;
      this.ctx.stroke();
    }
  }

  circle(
    x: number,
    y: number,
    r: number,
    borderColor = this.borderColor,
    fillColor = this.fillColor
  ) {
    this.ellipse(x-r, y-r, r, r, borderColor, fillColor);
  }

  line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color = this.borderColor
  ) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }
  text(msg: string, x = 0, y = 0, color = this.textColor, opts?: any) {
    this.ctx.fillStyle = color;
    if (opts && opts.textAlign) this.ctx.textAlign = opts.textAlign;
    if (opts && opts.textBaseline) this.ctx.textBaseline = opts.textBaseline;
    this.ctx.fillText(msg, x, y);
  }
  textRect(
    msg: string,
    x = 0,
    y = 0,
    w = (msg.length * this.fontSize) / 2.0,
    h = this.fontSize,
    textColor = this.textColor,
    borderColor = this.borderColor,
    fillColor = this.fillColor
  ) {
    this.rect(x, y, w, h, borderColor, fillColor);
    this.text(msg, x + w / 2, y + h / 2, textColor);
  }
}
