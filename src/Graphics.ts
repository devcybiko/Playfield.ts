class Graphics {
    private ctx: CanvasRenderingContext2D;
    private gparms: GraphicsParms;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.gparms = new GraphicsParms();
    }

    rect(
        x: number,
        y: number,
        w: number,
        h: number,
        gparms = this.gparms
    ) {
        if (gparms.fillColor) {
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fillRect(x, y, w, h);
        }
        if (gparms.borderColor) {
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.strokeRect(x, y, w, h);
        }
    }

    ellipse(
        x: number,
        y: number,
        w: number,
        h: number,
        gparms = this.gparms
    ) {
        if (gparms.fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fill();
        }
        if (gparms.borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.stroke();
        }
    }

    circle(
        x: number,
        y: number,
        r: number,
        gparms = this.gparms
    ) {
        this.ellipse(x - r, y - r, r, r, gparms);
    }

    line(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        gparms = this.gparms
    ) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = gparms.color;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    text(msg: string, x = 0, y = 0, gparms = this.gparms) {
        this.ctx.fillStyle = gparms.color;
        this.ctx.font = gparms.font;
        this.ctx.textAlign = gparms.textAlign;
        this.ctx.textBaseline = gparms.textBaseline;
        x += gparms.xOffset;
        y += gparms.yOffset;
        this.ctx.fillText(msg, x, y);
    }
    textRect(
        msg: string,
        x = 0,
        y = 0,
        w?: number,
        h?: number,
        gparms = this.gparms
    ) {
        this.ctx.font = gparms.font;
        let boundingBox = this.boundingBox(msg, gparms);
        if (!w) w = boundingBox.w;
        if (!h) h = boundingBox.h;
        this.rect(x, y, w, h, gparms);
        this.text(msg, x + w / 2, y + h / 2 + 1, gparms);
    }
    boundingBox(msg: string, gparms = this.gparms): any {
        this.ctx.font = gparms.font;
        let boundingBox = this.ctx.measureText(msg) as any;
        return {w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize};
    }
}
