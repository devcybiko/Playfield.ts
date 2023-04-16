import { Dimensions } from "./DimensionsMixin";
import { Point } from "./PointMixin";

export class Rect {
    protected _x = 0;
    protected _y = 0;
    protected _w = 0; // w=1 is a single pixel
    protected _h = 0; // h= 1 is a single pixel
    public _asRect: Rect;

    constructor(...args: number[]) {
        if (args.length === 0) return;
        this.Rect(args[0], args[1], args[2], args[3]);
    }

    Rect(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._asRect = this;
        return this;
    }

    // Static Methods -- //
    public static cast(obj: any): Rect {
        return obj as unknown as Rect;
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
    get point(): Point {
        return new Point(this._x, this._y);
    }
    set point(point: Point) {
        this._x = point.x;
        this._y = point.y;
    }
    get dimensions(): Dimensions {
        return new Dimensions(this._w, this._h);
    }
    set dimensions(d: Dimensions) {
        this._w = d.w;
        this._h = d.h;
    }
    get rect(): Rect {
        return new Rect(this.x, this.y, this.w, this.h);
    }
    set rect(value: Rect) {
        this.x = value.x;
        this.y = value.y;
        this.w = value.w;
        this.h = value.h;
    }

}