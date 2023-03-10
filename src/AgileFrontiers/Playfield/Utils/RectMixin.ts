import { Point } from "./PointMixin";

export class Rect {
    private _x = 0;
    private _y = 0;
    private _w = 0; // w=1 is a single pixel
    private _h = 0; // h= 1 is a single pixel

    Rect(x: number, y: number, w: number, h: number) {
        return this.RectWH(x,y,w,h);
    }

    RectWH(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

    RectXY(x0: number, y0: number, x1: number, y1: number) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    }

    // --- Public Methods --- //

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    rmove(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }
    sizeXY(x1: number, y1: number) {
        this.x1 = x1;
        this.y1 = y1;
    }
    rsizeXY(dx: number, dy: number) {
        this.x1 += dx;
        this.y1 += dy;
    }
    size(w: number, h: number) {
        this.w = w;
        this.h = h;
    }
    rsize(dw: number, dh: number) {
        this.w += dw;
        this.h += dh;
    }

    // --- Accessors --- //

    get x() {
        return this._x;
    }
    set x(n: number) {
        this._x = n;
    }
    get y() {
        return this._y;
    }
    set y(n: number) {
        this._y = n;
    }
    get w() {
        return this._w;
    }
    set w(n: number) {
        this._w = n;
    }
    get h() {
        return this._h;
    }
    set h(n: number) {
        this._h = n;
    }
    get x0(): number {
        return this._x;
    }
    set x0(n: number) {
        this._x = n;
    }
    get y0(): number {
        return this._y;
    }
    set y0(n: number) {
        this._y = n;
    }
    get x1(): number {
        // if w == 1 then x1 == x0
        return this.x0 + this.w - 1;
    }
    set x1(x1: number) {
        // if x1 == x0 then w == 1
        this._w = x1 - this.x0 + 1;
    }
    get y1(): number {
        // if h == 1 then y1 == y0
        return this.y0 + this.h - 1;
    }
    set y1(y1: number) {
        // if y1 == y0 then h == 1
        this._h = y1 - this._y + 1;
    }
    get p0(): Point {
        let p0 = new Point();
        p0.Point(this.x0, this.y0);
        return p0;
    }
    get p1(): Point {
        let p1 = new Point();
        p1.Point(this.x1, this.y1);
        return p1;
    }
}