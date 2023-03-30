import { Dimensions } from "./DimensionsMixin";
import { Point } from "./PointMixin";

export class Rect {
    private _x = 0;
    private _y = 0;
    private _w = 0; // w=1 is a single pixel
    private _h = 0; // h= 1 is a single pixel

    constructor(...args: number[]) {
        if (args.length === 0) return;
        this.Rect(args[0], args[1], args[2], args[3]);
    }

    Rect(x: number, y: number, w: number, h: number) {
        return this.RectWH(x, y, w, h);
    }

    RectWH(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
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
    get X(): number {
        // placeholder for absolute screen X
        return this._x;
    }
    get Y(): number {
        // placeholder for absolute screen Y
        return this._y;
    }
    get W(): number {
        // placeholder for absolute absolute W
        return this._w;
    }
    get H(): number {
        // placeholder for absolute absolute H
        return this._h;
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
}