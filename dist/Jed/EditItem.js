class EditItem extends Item {
    constructor(parent, name, value, x, y, w = 100, h = 24) {
        super(parent, name, value, x, y, w, h);
        this.cursor = 0;
        this.left = 0;
        this.right = 0;
        this.cursorOn = true;
        this.cursorBlinkRate = 500;
        this.nchars = 0;
        this.nchars2 = 0;
        this.gparms.fontFace = "monospace";
        this.eventHandler = new EditItemEventHandler(this);
        this.nchars = Math.ceil(this.rect.w / this.playfield.gfx.boundingBox("m", this.gparms).w);
        this.nchars2 = Math.ceil(this.rect.w / this.playfield.gfx.boundingBox("m", this.gparms).w / 2);
        this.left = 0;
        this.right = this.computeRight();
        this._setIntervalTimer();
        this.logger = new Logger("EditItem", "none");
    }
    _setIntervalTimer() {
        this.cursorOn = true;
        if (this.timerId)
            clearInterval(this.timerId);
        this.timerId = setInterval(this.blink.bind(this), this.cursorBlinkRate);
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
        let valueBB = gfx.boundingBox(this.value().substring(this.left, this.cursor), this.gparms);
        let dw = valueBB.w;
        if (dw <= 0)
            dw = 1;
        else if (dw >= this.rect.w)
            dw = this.rect.w - 1;
        let x0 = this.rect.x + dw;
        if (x0 <= this.rect.x)
            x0 = this.rect.x + 1;
        let x1 = x0;
        let y0 = this.rect.y;
        let y1 = y0 + valueBB.h;
        gfx.line(x0, y0, x1, y1, this.gparms);
        gfx.line(x0 + 1, y0, x1 + 2, y1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        if (this.hasFocus)
            this.gparms.color = "red";
        else
            this.gparms.color = "black";
        gfx.clipRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h, this.gparms);
        gfx.textRect(this.value().substring(this.left), this.rect.x, this.rect.y, this.rect.w, this.rect.h, this.gparms);
        this.drawCursor();
        gfx.restore();
    }
    computeRight() {
        // let gfx = this.playfield.gfx;
        // let right = this.left;
        // for(let i=this.left; i<=this._value.length; i++) {
        //     let bb = gfx.boundingBox(this._value.substring(this.left, i));
        //     right = i;
        //     if (bb.w > this.rect.w) break;
        // }
        let right = this.left + this.nchars2 * 2;
        if (right >= this._value.length)
            right = this._value.length - 1;
        return right;
    }
    computeLeft() {
        // let gfx = this.playfield.gfx;
        // let left = this.right;
        // for(let i=this.right; i>=0; i--) {
        //     let bb = gfx.boundingBox(this._value.substring(i, this.right));
        //     if (bb.w > this.rect.w) break;
        //     left = i;
        // }
        let left = this.right - this.nchars2 * 2 + 1;
        if (left < 0)
            left = 0;
        return left;
    }
    cursorInc(delta) {
        this.cursor += delta;
        this._setIntervalTimer();
        this.cursorOn = true;
        if (this.cursor < 0)
            this.cursor = 0;
        if (this.cursor > this._value.length)
            this.cursor = this._value.length;
        this.left = this.cursor - this.nchars2;
        if (this.left < 0)
            this.left = 0;
        this.right = this.left + this.nchars;
        if (this.right > this._value.length)
            this.right = this._value.length;
        if (this.right === this._value.length)
            this.left = Math.max(this.right - this.nchars + 1, 0);
        this.logger.log(this.left, this.cursor, this.right, this.nchars, this.nchars2);
    }
}
//# sourceMappingURL=EditItem.js.map