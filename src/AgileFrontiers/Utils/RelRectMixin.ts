import { int } from "./Functions";
import { Point } from "./PointMixin";
import { Rect } from "./RectMixin";

export class RelRect {
    // all points are relative to the parent
    // if positive integer, they are relative to the parent's top or left edge
    // if negative integer, they are relative to the parent's bottom or right edge
    // if positive/negative fractional, they are a percentage of the parent's width/height
    // modifying these values update x/y/w/h
    // -- but modifying x/y/w/h does not change these values

    private _x0 = 0;
    private _y0 = 0;
    private _x1 = 0;
    private _y1 = 0;

    RelRect(x0: number, y0: number, x1: number, y1: number) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        return this;
    }

    // --- Accessors --- //

    get x0() {
        return this._x0;
    }
    get y0() {
        return this._y0;
    }
    get x1() {
        return this._x1;
    }
    get y1() {
        return this._y1;
    }
    get _parentRect(): Rect {
        let that = this as any;
        if (that.parent) that._parent as Rect;
        return (new Rect).Rect(0,0,0,0);
    }
    get _rect(): Rect {
        return (this as any) as Rect;
    }
    set x0(x0: number) {
        this._x0 = x0;
        if (-1 < x0 && x0 < 1) {
            if (x0 > 0) this._rect.x = int(this._parentRect.w * x0);
            else this._rect.x = int(this._parentRect.w * (1+ x0));
        } else {
            if (x0 >= 0) this._rect.x = x0;
            else this._rect.x = this._parentRect.w + x0;
        }
    }
    set y0(y0: number) {
        this._y0 = y0;
        if (-1 < y0 && y0 < 1) {
            if (y0 > 0) this._rect.y = int(this._parentRect.h * y0);
            else this._rect.y = int(this._parentRect.h * (1 + y0));
        } else {
            if (y0 >= 0) this._rect.y = y0;
            else this._rect.y = this._parentRect.h + y0;
        }
    }
    set x1(x1: number) {
        this._x1 = x1;
        if (-1 < x1 && x1 < 1) {
            if (x1 > 0) this._rect.w = int(this._parentRect.w * x1) + 1;
            else this._rect.w = int(this._parentRect.w * (1 + x1)) + 1;
        } else {
            if (x1 >= 0) this._rect.w = x1 - this._rect.x + 1;
            else this._rect.w = this._parentRect.w + x1 - this._rect.x + 1;
        }
    }
    set y1(y1: number) {
        this._y1 = y1;
        if (-1 < y1 && y1 < 1) {
            if (y1 > 0) this._rect.h = int(this._parentRect.h * y1) + 1;
            else this._rect.h = int(this._parentRect.h * (1 + y1)) + 1;
        } else {
            if (y1 >= 0) this._rect.h = y1 - this._rect.y + 1;
            else this._rect.h = this._parentRect.h + y1 - this._rect.y + 1;
        }
    }
}