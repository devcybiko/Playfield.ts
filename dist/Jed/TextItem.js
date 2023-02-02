class TextItem extends Item {
    constructor(name, label, value, x, y, w = 100, h = 24) {
        super(name, label, value, x, y, w, h);
        this.options = {
            textBaseline: "bottom",
            textAlign: "left"
        };
        this.xOffset = 2;
        this.yOffset = this.h - 4;
    }
    draw() {
        let gfx = this.playfield.gfx;
        gfx.rect(this.x, this.y, this.w, this.h);
        gfx.text(this.value(), this.x + this.xOffset, this.y + this.yOffset, this.color, this.options);
    }
}
//# sourceMappingURL=TextItem.js.map