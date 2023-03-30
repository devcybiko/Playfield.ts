import { Point } from "./PointMixin";

export class Dimensions {
    protected _w: number;
    protected _h: number;

    constructor(w=0, h=0) {
        this.Dimensions(w, h);
    }

    Dimensions(w: number, h: number): Dimensions {
        this._w = w;
        this._h = h;
        return this;
    }

    // Static Methods -- //
    public static cast(obj: any): Dimensions {
        return obj as unknown as Dimensions;
    }
    // --- Public Methods --- //

    size(w: number, h: number) {
        this.w = w;
        this.h = h;
    }
    rsize(dw: number, dh: number) {
        this.w += dw;
        this.h += dh;
    }

    // --- Accessors --- //

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
    get W(): number {
        // placeholder for absolute absolute W
        return this._w;
    }
    get H(): number {
        // placeholder for absolute absolute H
        return this._h;
    }
}