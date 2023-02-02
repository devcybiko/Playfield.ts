class Box extends Shape {
    constructor(name, x, y, w, h, color, borderColor, fillColor) {
        super(name, x, y, w, h, color, borderColor, fillColor);
        this.logger = new Logger("Box");
    }
    draw() {
        if (this.isSelected) {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, "black", this.borderColor, this.color);
        }
        else {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, "black", null, this.color);
        }
    }
}
//# sourceMappingURL=Box.js.map