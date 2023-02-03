class TextItem extends Item {
    public eventHandler: TextItemEventHandler;
    public cursor: number;
    public cursorOn = true;
    public gparms = new GraphicsParms();
    public labelGparms = new GraphicsParms();
    public rectWidth: number;
    public timerId: any;

    constructor(name: string, label: string, value: string, x: number, y: number, w = 100, h = 24) {
        super(name, label, value, x, y, w, h);
        this.rectWidth = w;
        this.timerId = setInterval(this.blink.bind(this), 500);
        this.labelGparms.fontFace = "serif";
    }
    blink() {
        this.cursorOn = !this.cursorOn;
    }
    addMeToPlayfield(playfield: Playfield) {
        this.eventHandler = new TextItemEventHandler(this);
    }
    drawCursor(labelBB: any) {
        if (!this.cursorOn) return;
        if (!this.hasFocus) return;
        let gfx = this.playfield.gfx;
        let valueBB = gfx.boundingBox(this.value(), this.gparms);
        let x0 = this.x + labelBB.w + valueBB.w + 4;
        let x1 = x0;
        let y0 = this.y + 2;
        let y1 = y0 + valueBB.h - 4;
        gfx.line(x0, y0, x1, y1, this.gparms);
    }
    drawLabel() {
        if (!this.label()) return {w: 0, h: this.labelGparms.fontSize};
        let gfx = this.playfield.gfx;
        let bb = gfx.boundingBox(this.label(), this.labelGparms);
        gfx.text(this.label(), this.x, this.y, this.labelGparms);
        return bb;
    }
    drawValue(labelBB: any) {
        let gfx = this.playfield.gfx;
        gfx.rect(this.x + labelBB.w, this.y, this.rectWidth, this.h, this.gparms);
        gfx.text(this.value(), this.x + labelBB.w + 2, this.y + 1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        let labelBB = this.drawLabel();
        this.drawValue(labelBB);
        this.drawCursor(labelBB);
        this.w = labelBB.w + this.rectWidth + 4;
    }
}