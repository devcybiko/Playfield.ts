class EditItem extends Item {
    constructor(parent, name, value, x, y, w = 100, h = 24) {
        super(parent, name, value, x, y, w, h);
        this.cursorOn = true;
        this.timerId = setInterval(this.blink.bind(this), 500);
        this.eventHandler = new EditItemEventHandler(this);
    }
    blink() {
        this.cursorOn = !this.cursorOn;
    }
    click(x, y) {
        this.playfield.focusObj(this);
    }
    drawCursor() {
        if (!this.hasFocus)
            return;
        if (!this.cursorOn)
            return;
        let gfx = this.playfield.gfx;
        let valueBB = gfx.boundingBox(this.value(), this.gparms);
        let x0 = this.x + valueBB.w + 4;
        let x1 = x0;
        let y0 = this.y + 2;
        let y1 = y0 + valueBB.h - 4;
        gfx.line(x0, y0, x1, y1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        if (this.hasFocus)
            this.gparms.color = "red";
        else
            this.gparms.color = "black";
        gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.text(this.value(), this.x + 2, this.y + 1, this.gparms);
        this.drawCursor();
    }
}
//# sourceMappingURL=EditItem.js.map