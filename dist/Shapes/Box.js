class Box extends Shape {
    constructor(name, x, y, w, h, color, borderColor, fillColor) {
        super(name, x, y, w, h, color, borderColor, fillColor);
        this.logger = new Logger("Box");
    }
    draw() {
        if (this.isSelected) {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, this.selectedGparms);
        }
        else {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, this.gparms);
        }
    }
}
//# sourceMappingURL=Box.js.map