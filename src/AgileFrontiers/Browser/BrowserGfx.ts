import { Gfx } from "../Playfield/Graphics/Gfx";
import { GfxParms } from "../Playfield/Graphics/GfxParms";

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d") as any,
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();


function createHiDPICanvas(w: number, h: number, canvas?: any, ratio?: number,) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = canvas || document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function createHiDPIFromCanvas(canvasId: string, ratio?: number,) {
    if (!ratio) { ratio = PIXEL_RATIO; }

    var can = document.querySelector(canvasId) as any;
    can._ratio = ratio;
    can.width = can.width * ratio;
    can.height = can.height * ratio;
    can.style.width = can.width + "px";
    can.style.height = can.height + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

export class BrowserGfx implements Gfx {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _gparms: GfxParms;

    constructor(canvasId?: string) {
        if (canvasId) this._init(canvasId);
    }

    private _init(canvasId: string) {
        // this._canvas = createHiDPIFromCanvas(canvasId, 1.0);
        this._canvas = createHiDPIFromCanvas(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._gparms = new GfxParms();
        this._ctx.fontKerning = "none";
        (this._ctx as any).letterSpacing = "1px";
        (this._ctx as any).textRendering = "geometricPrecision";
    }

    // --- Public Methods --- //
    clone(): Gfx {
        let newGfx = new BrowserGfx();
        newGfx._canvas = this._canvas;
        newGfx._ctx = this._ctx;
        newGfx._gparms = this.gparms.clone();
        return newGfx;
    }
    rect(
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        if (this.gparms.fillColor) {
            this._ctx.fillStyle = this.gparms.fillColor;
            this._ctx.beginPath();
            if (this.gparms.borderRadius) this._ctx.roundRect(this.gparms.dx + x, this.gparms.dy + y, w, h, this.gparms.borderRadius);
            else this._ctx.rect(this.gparms.dx + x, this.gparms.dy + y, w, h);
            this._ctx.fill();
        }
        if (this.gparms.borderColor) {
            this._ctx.strokeStyle = this.gparms.borderColor;
            this._ctx.beginPath();
            if (this.gparms.borderRadius) this._ctx.roundRect(this.gparms.dx + x, this.gparms.dy + y, w, h, this.gparms.borderRadius);
            else this._ctx.rect(this.gparms.dx + x, this.gparms.dy + y, w, h);
            this._ctx.stroke();
        }
    }

    ellipse(
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        if (this.gparms.fillColor) {
            this._ctx.beginPath();
            this._ctx.ellipse(this.gparms.dx + x + w / 2, this.gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this._ctx.fillStyle = this.gparms.fillColor;
            this._ctx.fill();
        }
        if (this.gparms.borderColor) {
            this._ctx.beginPath();
            this._ctx.ellipse(this.gparms.dx + x + w / 2, this.gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this._ctx.strokeStyle = this.gparms.borderColor;
            this._ctx.stroke();
        }
    }

    circle(
        x: number,
        y: number,
        r: number
    ) {
        this.ellipse(x - r, y - r, r * 2, r * 2);
    }

    line(
        x0: number,
        y0: number,
        x1: number,
        y1: number
    ) {
        this._ctx.beginPath();
        this._ctx.strokeStyle = this.gparms.borderColor;
        this._ctx.moveTo(this.gparms.dx + x0, this.gparms.dy + y0);
        this._ctx.lineTo(this.gparms.dx + x1, this.gparms.dy + y1);
        this._ctx.stroke();
    }

    text(msg: string, x = 0, y = 0, w?: number, h?: number) {
        this._ctx.fillStyle = this.gparms.color;
        this._ctx.font = this.gparms.font;
        this._ctx.textAlign = this.gparms.textAlign;
        this._ctx.textBaseline = this.gparms.textBaseline;
        let textX = x;
        let textY = y;
        if (!w || !h) {
            let boundingBox = this.boundingBox(msg);
            if (!w) w = boundingBox.w;
            if (!h) h = boundingBox.h;
        }

        if (this.gparms.textAlign === GfxParms.LEFT) {
            // do nothing
        } else if (this.gparms.textAlign === GfxParms.RIGHT) {
            textX += w;
        } else if (this.gparms.textAlign === GfxParms.CENTER) {
            textX += w / 2;
        } else {
            throw new Error("Unknown textAlign: " + this.gparms.textAlign)
        }
        if (this.gparms.textBaseline === GfxParms.TOP) {
            // do nothing
        } else if (this.gparms.textBaseline === GfxParms.BOTTOM) {
            textY += h;
        } else if (this.gparms.textBaseline === GfxParms.MIDDLE) {
            textY += h / 2;
        } else {
            throw new Error("Unknown textAlign: " + this.gparms.textAlign)
        }

        if (w) {
            this.clipRect(x - 1, y - 1, w + 2, h + 2);
            this._ctx.fillText(msg, this.gparms.dx + textX, this.gparms.dy + textY);
            this.restore();
        } else {
            this._ctx.fillText(msg, this.gparms.dx + textX, this.gparms.dy + textY);
        }
    }

    textRect(
        msg: string,
        x = 0,
        y = 0,
        w?: number,
        h?: number
    ) {
        this._ctx.font = this.gparms.font;
        if (!w || !h) {
            let boundingBox = this.boundingBox(msg);
            if (!w) w = boundingBox.w;
            if (!h) h = boundingBox.h;
        }
        this.rect(x, y, w, h);
        this.text(msg, x + 1, y + 1, w, h);
    }


    boundingBox(msg: string): any {
        this._ctx.font = this.gparms.font;
        let boundingBox = this._ctx.measureText(msg) as any;
        return { w: Math.floor(boundingBox.width + 0.5), h: this.gparms.fontSize };
    }

    clipRect(x = 0, y = 0, w = this._ctx.canvas.width, h = this._ctx.canvas.height) {
        this.save();
        let region = new Path2D();
        region.rect(x + this.gparms.dx - 1, y + this.gparms.dy - 2, w + 2, h + 2);
        this._ctx.clip(region);
    }

    save() {
        this._ctx.save();
    }

    restore() {
        this._ctx.restore();
    }

    // --- Accessors --- //

    get width(): number {
        return this._canvas.width;
    }

    get height(): number {
        return this._canvas.height;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    public get gparms(): GfxParms {
        return this._gparms;
    }

}
