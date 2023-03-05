import { Gfx } from "../Graphics/Gfx";
import { GfxParms } from "../Graphics/GfxParms";

export class GfxBrowser implements Gfx {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _gparms: GfxParms;

    constructor(canvasId: string) {
        this._canvas = document.querySelector(canvasId); // canvasId
        this._ctx = this._canvas.getContext("2d");
        this._gparms = new GfxParms();
        this._ctx.fontKerning = "none";
        (this._ctx as any).letterSpacing = "1px";
        (this._ctx as any).textRendering = "geometricPrecision";
    }

    get width(): number {
        return this._canvas.width;
    }

    get height(): number {
        return this._canvas.height;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    rect(
        x: number,
        y: number,
        w: number,
        h: number,
        _gparms = this._gparms
    ) {
        if (_gparms.fillColor) {
            this._ctx.fillStyle = _gparms.fillColor;
            this._ctx.fillRect(_gparms.dx + x, _gparms.dy + y, w, h);
        }
        if (_gparms.borderColor) {
            this._ctx.strokeStyle = _gparms.borderColor;
            this._ctx.strokeRect(_gparms.dx + x, _gparms.dy + y, w, h);
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
    text(msg: string, x = 0, y = 0, _gparms = this._gparms, w?: number) {
        this._ctx.fillStyle = _gparms.color;
        this._ctx.font = _gparms.font;
        this._ctx.textAlign = _gparms.textAlign;
        this._ctx.textBaseline = _gparms.textBaseline;
        this._ctx.fillText(msg, _gparms.dx + x, _gparms.dy + y, w);
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
        let boundingBox = this.boundingBox(msg, _gparms);
        if (!w) w = boundingBox.w;
        if (!h) h = boundingBox.h;
        this.rect(x, y, w, h, _gparms);
        this.text(msg, x, y, _gparms, w);
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
}
