class Graphics {
    constructor(ctx) {
        this.fontSize = 12;
        this.fontFace = "sans-serif";
        this.textColor = "black";
        this.borderColor = "black";
        this.fillColor = "white";
        this.ctx = ctx;
        this.configContext();
    }
    configContext() {
        let ctx = this.ctx;
        ctx.font = this.fontSize + "px " + this.fontFace;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }
    rect(x, y, w, h, borderColor = this.borderColor, fillColor = this.fillColor) {
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fillRect(x, y, w, h);
        }
        if (borderColor) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.strokeRect(x, y, w, h);
        }
    }
    ellipse(x, y, w, h, borderColor = this.borderColor, fillColor = this.fillColor) {
        if (fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        if (borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.strokeStyle = borderColor;
            this.ctx.stroke();
        }
    }
    circle(x, y, r, borderColor = this.borderColor, fillColor = this.fillColor) {
        this.ellipse(x - r, y - r, r, r, borderColor, fillColor);
    }
    line(x0, y0, x1, y1, color = this.borderColor) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    text(msg, x = 0, y = 0, color = this.textColor, opts) {
        this.ctx.fillStyle = color;
        if (opts && opts.textAlign)
            this.ctx.textAlign = opts.textAlign;
        if (opts && opts.textBaseline)
            this.ctx.textBaseline = opts.textBaseline;
        console.log("text", msg, x, y, color, opts);
        this.ctx.fillText(msg, x, y);
    }
    textRect(msg, x = 0, y = 0, w = (msg.length * this.fontSize) / 2.0, h = this.fontSize, textColor = this.textColor, borderColor = this.borderColor, fillColor = this.fillColor) {
        this.rect(x, y, w, h, borderColor, fillColor);
        this.text(msg, x + w / 2, y + h / 2, textColor);
    }
}
//# sourceMappingURL=Graphics.js.map