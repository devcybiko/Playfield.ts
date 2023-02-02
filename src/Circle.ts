class Circle extends Shape {
  private r: number;
  constructor(
    name: string,
    x: number,
    y: number,
    r: number,
    color?: string,
    borderColor?: string,
    fillColor?: string
  ) {
    super(name, x - r, y - r, r, r, color, borderColor, fillColor);
    this.logger = new Logger("Circle");
    this.r = r;
  }
  draw() {
    if (this.isSelected) {
      this.playfield.gfx.circle(
        this.x + this.r,
        this.y + this.r,
        this.r,
        this.borderColor,
        this.color
      );
    } else {
      this.playfield.gfx.circle(
        this.x + this.r,
        this.y + this.r,
        this.r,
        null,
        this.color
      );
    }
    this.playfield.gfx.textRect(
      this.name,
      this.x,
      this.y,
      this.w,
      this.h,
      "black",
      null,
      null
    );
  }
}
