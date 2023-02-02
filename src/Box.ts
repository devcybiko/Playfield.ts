class Box extends Shape {
  constructor(
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string, borderColor?: string, fillColor?: string
  ) {
    super(name, x, y, w, h, color, borderColor, fillColor);
    this.logger = new Logger("Box");
  }
  draw() {
    if (this.isSelected) {
      this.playfield.gfx.textRect(
        this.name,
        this.x,
        this.y,
        this.w,
        this.h,
        "black",
        this.borderColor,
        this.color
      );  
    } else {
      this.playfield.gfx.textRect(
        this.name,
        this.x,
        this.y,
        this.w,
        this.h,
        "black",
        null,
        this.color
      );
  
    }
  }
}
