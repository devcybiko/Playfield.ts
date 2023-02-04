class Graphics {
    constructor(ctx) {
        this.logger = new Logger("Graphics", "info");
        this.ctx = ctx;
        this.gparms = new GraphicsParms();
        this.ctx.fontKerning = "none";
        this.ctx.letterSpacing = "1px";
        this.ctx.textRendering = "geometricPrecision";
    }
    rect(x, y, w, h, gparms = this.gparms) {
        if (gparms.fillColor) {
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fillRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
        }
        if (gparms.borderColor) {
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.strokeRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
        }
    }
    ellipse(x, y, w, h, gparms = this.gparms) {
        if (gparms.fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fill();
        }
        if (gparms.borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.stroke();
        }
    }
    circle(x, y, r, gparms = this.gparms) {
        this.ellipse(x - r, y - r, r, r, gparms);
    }
    line(x0, y0, x1, y1, gparms = this.gparms) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = gparms.color;
        this.ctx.moveTo(gparms.xOffset + x0, gparms.yOffset + y0);
        this.ctx.lineTo(gparms.xOffset + x1, gparms.yOffset + y1);
        this.ctx.stroke();
    }
    text(msg, x = 0, y = 0, gparms = this.gparms) {
        this.ctx.fillStyle = gparms.color;
        this.ctx.font = gparms.font;
        this.ctx.textAlign = gparms.textAlign;
        this.ctx.textBaseline = gparms.textBaseline;
        this.ctx.fillText(msg, gparms.xOffset + x, gparms.yOffset + y);
    }
    textRect(msg, x = 0, y = 0, w, h, gparms = this.gparms) {
        this.ctx.font = gparms.font;
        let boundingBox = this.boundingBox(msg, gparms);
        if (!w)
            w = boundingBox.w;
        if (!h)
            h = boundingBox.h;
        this.rect(x, y, w, h, gparms);
        this.text(msg, x, y, gparms);
    }
    boundingBox(msg, gparms = this.gparms) {
        this.ctx.font = gparms.font;
        let boundingBox = this.ctx.measureText(msg);
        return { w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize };
    }
    clipRect(x = 0, y = 0, w = this.ctx.canvas.width, h = this.ctx.canvas.height, gparms = this.gparms) {
        this.save();
        let region = new Path2D();
        region.rect(x + gparms.xOffset, y + gparms.yOffset, w, h);
        this.ctx.clip(region);
    }
    save() {
        this.ctx.save();
    }
    restore() {
        this.ctx.restore();
    }
}
//# sourceMappingURL=Graphics.js.map