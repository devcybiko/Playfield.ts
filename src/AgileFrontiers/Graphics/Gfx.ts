import {GfxParms} from "./GfxParms";
import * as Utils from "../Utils";

export interface hasGfx {
    get gfx(): Gfx;
}

export class Gfx {
    public ctx: CanvasRenderingContext2D;
    public gparms: GfxParms;
    private logger = new Utils.Logger();

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.gparms = new GfxParms();
        this.ctx.fontKerning = "none";
        (this.ctx as any).letterSpacing = "1px";
        (this.ctx as any).textRendering = "geometricPrecision";
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
            this.ctx.fillRect(gparms.dx + x, gparms.dy + y, w, h);
        }
        if (gparms.borderColor) {
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.strokeRect(gparms.dx + x, gparms.dy + y, w, h);
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
            this.ctx.ellipse(gparms.dx + x + w / 2, gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fill();
        }
        if (gparms.borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(gparms.dx + x + w / 2, gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
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
        this.ellipse(x - r, y - r, r*2, r*2, gparms);
    }

    line(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        gparms0 = this.gparms,
        gparms1 = gparms0
    ) {
        this.logger.info("line", x0, y0, x1, y1);
        this.ctx.beginPath();
        this.ctx.strokeStyle = gparms0.borderColor;
        this.ctx.moveTo(gparms0.dx + x0, gparms0.dy + y0);
        this.ctx.lineTo(gparms1.dx + x1, gparms1.dy + y1);
        this.ctx.stroke();
    }
    text(msg: string, x = 0, y = 0, gparms = this.gparms, w?: number) {
        this.ctx.fillStyle = gparms.color;
        this.ctx.font = gparms.font;
        this.ctx.textAlign = gparms.textAlign;
        this.ctx.textBaseline = gparms.textBaseline;
        this.ctx.fillText(msg, gparms.dx + x, gparms.dy + y, w);
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
        this.text(msg, x, y, gparms, w);
    }
    boundingBox(msg: string, gparms = this.gparms): any {
        this.ctx.font = gparms.font;
        let boundingBox = this.ctx.measureText(msg) as any;
        return { w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize };
    }
    clipRect(x = 0, y = 0, w = this.ctx.canvas.width, h = this.ctx.canvas.height, gparms = this.gparms) {
        this.save();
        let region = new Path2D();
        region.rect(x + gparms.dx, y + gparms.dy, w, h);
        this.ctx.clip(region);
    }
    save() {
        this.ctx.save();
    }
    restore() {
        this.ctx.restore();
    }
}
