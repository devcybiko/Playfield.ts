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

function createHiDPIFromCanvas(canvas: any, ratio?: number,) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    console.log(ratio);

    var can = canvas;
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
    private _ratio = 1.0;

    constructor(canvasId: string) {
        this._canvas = createHiDPIFromCanvas(document.querySelector(canvasId), 1.0);
        this._ctx = this._canvas.getContext("2d");
        this._gparms = new GfxParms();
        // this._ratio = PIXEL_RATIO;
        (this._canvas as any)._ratio = this._ratio;
        this._ctx.fontKerning = "none";
        (this._ctx as any).letterSpacing = "1px";
        (this._ctx as any).textRendering = "geometricPrecision";
    }

    // --- Public Methods --- //

    rect(
        x: number,
        y: number,
        w: number,
        h: number,
        _gparms = this._gparms
    ) {
        if (_gparms.fillColor) {
            this._ctx.fillStyle = _gparms.fillColor;
            this._ctx.beginPath();
            if (_gparms.borderRadius) this._ctx.roundRect(_gparms.dx + x, _gparms.dy + y, w, h, _gparms.borderRadius);
            else this._ctx.rect(_gparms.dx + x, _gparms.dy + y, w, h);
            this._ctx.fill();
        }
        if (_gparms.borderColor) {
            this._ctx.strokeStyle = _gparms.borderColor;
            this._ctx.beginPath();
            if (_gparms.borderRadius) this._ctx.roundRect(_gparms.dx + x, _gparms.dy + y, w, h, _gparms.borderRadius);
            else this._ctx.rect(_gparms.dx + x, _gparms.dy + y, w, h);
            this._ctx.stroke();
        }
    }

    ellipse(
        x: number,
        y: number,
        w: number,
        h: number,
        _gparms = this._gparms
    ) {
        if (_gparms.fillColor) {
            this._ctx.beginPath();
            this._ctx.ellipse(_gparms.dx + x + w / 2, _gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this._ctx.fillStyle = _gparms.fillColor;
            this._ctx.fill();
        }
        if (_gparms.borderColor) {
            this._ctx.beginPath();
            this._ctx.ellipse(_gparms.dx + x + w / 2, _gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this._ctx.strokeStyle = _gparms.borderColor;
            this._ctx.stroke();
        }
    }

    circle(
        x: number,
        y: number,
        r: number,
        _gparms = this._gparms
    ) {
        this.ellipse(x - r, y - r, r * 2, r * 2, _gparms);
    }

    line(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        _gparms0 = this._gparms,
        _gparms1 = _gparms0
    ) {
        this._ctx.beginPath();
        this._ctx.strokeStyle = _gparms0.borderColor;
        this._ctx.moveTo(_gparms0.dx + x0, _gparms0.dy + y0);
        this._ctx.lineTo(_gparms1.dx + x1, _gparms1.dy + y1);
        this._ctx.stroke();
    }

    text(msg: string, x = 0, y = 0, _gparms = this._gparms, w?: number, h?: number) {
        this._ctx.fillStyle = _gparms.color;
        this._ctx.font = _gparms.font;
        this._ctx.textAlign = _gparms.textAlign;
        this._ctx.textBaseline = _gparms.textBaseline;
        let textX = x;
        let textY = y;
        if (!w || !h) {
            let boundingBox = this.boundingBox(msg, _gparms);
            if (!w) w = boundingBox.w;
            if (!h) h = boundingBox.h;
        }

        if (_gparms.textAlign === GfxParms.LEFT) {
            // do nothing
        } else if (_gparms.textAlign === GfxParms.RIGHT) {
            textX += w;
        } else if (_gparms.textAlign === GfxParms.CENTER) {
            textX += w / 2;
        } else {
            throw new Error("Unknown textAlign: " + _gparms.textAlign)
        }
        if (_gparms.textBaseline === GfxParms.TOP) {
            // do nothing
        } else if (_gparms.textBaseline === GfxParms.BOTTOM) {
            textY += h;
        } else if (_gparms.textBaseline === GfxParms.MIDDLE) {
            textY += h / 2;
        } else {
            throw new Error("Unknown textAlign: " + _gparms.textAlign)
        }

        if (w) {
            this.clipRect(x-1, y-1, w+2, h+2, _gparms);
            this._ctx.fillText(msg, _gparms.dx + textX, _gparms.dy + textY);
            this.restore();
        } else {
            this._ctx.fillText(msg, _gparms.dx + textX, _gparms.dy + textY);
        }
    }

    textRect(
        msg: string,
        x = 0,
        y = 0,
        w?: number,
        h?: number,
        _gparms = this._gparms
    ) {
        this._ctx.font = _gparms.font;
        if (!w || !h) {
            let boundingBox = this.boundingBox(msg, _gparms);
            if (!w) w = boundingBox.w;
            if (!h) h = boundingBox.h;
        }
        this.rect(x, y, w, h, _gparms);
        this.text(msg, x+1, y+1, _gparms, w, h);
    }


    boundingBox(msg: string, _gparms = this._gparms): any {
        this._ctx.font = _gparms.font;
        let boundingBox = this._ctx.measureText(msg) as any;
        return { w: Math.floor(boundingBox.width + 0.5), h: _gparms.fontSize };
    }

    clipRect(x = 0, y = 0, w = this._ctx.canvas.width, h = this._ctx.canvas.height, _gparms = this._gparms) {
        this.save();
        let region = new Path2D();
        region.rect(x + _gparms.dx, y + _gparms.dy, w, h);
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

}
