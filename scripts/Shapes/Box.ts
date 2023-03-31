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
  draw(enable = true) {
    if (this.isSelected) {
      this.playfield.gfx.textRect(
        this.name,
        this.x,
        this.y,
        this.w,
        this.h,
        this.selectedGparms
      );  
    } else {
      this.playfield.gfx.textRect(
        this.name,
        this.x,
        this.y,
        this.w,
        this.h,
        this.gparms
      );
  
    }
  }
}
