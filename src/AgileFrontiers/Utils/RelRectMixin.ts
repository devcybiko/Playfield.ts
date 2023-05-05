import { Tile } from "../Playfield";
import { int } from "./Functions";
import { Tree } from "./TreeMixin";

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
    public _asTile: Tile;

    RelRect(x0: number, y0: number, x1: number, y1: number) {
        this._asTile = this as unknown as Tile;
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
    set x0(x0: number) {
        let thisTile = this._asTile;
        this._x0 = x0;
        if (-1 < x0 && x0 < 1) {
            if (x0 >= 0) thisTile.x = int(thisTile.parent.w * x0);
            else thisTile.x = int(thisTile.parent.w * (1+ x0));
        } else {
            if (x0 >= 0) thisTile.x = x0;
            else thisTile.x = thisTile.parent.w + x0;
        }
    }
    set y0(y0: number) {
        let thisTile = this._asTile;
        this._y0 = y0;
        if (-1 < y0 && y0 < 1) {
            if (y0 >= 0) thisTile.y = int(thisTile.parent.h * y0);
            else thisTile.y = int(thisTile.parent.h * (1 + y0));
        } else {
            if (y0 >= 0) thisTile.y = y0;
            else thisTile.y = thisTile.parent.h + y0;
        }
    }
    set x1(x1: number) {
        let thisTile = this._asTile;
        this._x1 = x1;
        if (-1 < x1 && x1 < 1) {
            if (x1 >= 0) thisTile.w = int(thisTile.parent.w * x1) + 1;
            else thisTile.w = int(thisTile.parent.w * (1 + x1)) + 1;
        } else {
            if (x1 >= 0) thisTile.w = x1 - thisTile.x + 1;
            else thisTile.w = thisTile.parent.w + x1 - thisTile.x + 1;
        }
    }
    set y1(y1: number) {
        let thisTile = this._asTile;;
        this._y1 = y1;
        if (-1 < y1 && y1 < 1) {
            if (y1 >= 0) thisTile.h = int(thisTile.parent.h * y1) + 1;
            else thisTile.h = int(thisTile.parent.h * (1 + y1)) + 1;
        } else {
            if (y1 >= 0) thisTile.h = y1 - thisTile.y + 1;
            else thisTile.h = thisTile.parent.h + y1 - thisTile.y + 1;
        }
    }
}