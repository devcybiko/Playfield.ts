class LabelItem extends Item {
    constructor(parent, name, value, x, y, w = 0, h = 0) {
        super(parent, name, value, x, y, w, h);
        this.gparms.fontFace = "serif";
        this.bb = this.playfield.gfx.boundingBox(this.value(), this.gparms);
        if (!w)
            this.w = this.bb.w;
        if (!h)
            this.h = this.bb.h;
    }
    draw() {
        let gfx = this.playfield.gfx;
        // this.bb = gfx.boundingBox(this.value(), this.gparms);
        // this.w = this.bb.w;
        // this.h = this.bb.h;
        gfx.text(this.value(), this.x, this.y, this.gparms);
    }
}
//# sourceMappingURL=LabelItem.js.map