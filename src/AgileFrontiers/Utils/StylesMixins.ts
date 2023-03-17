export class Styles {
    protected _top = "black";
    protected _bottom = "black";
    protected _left = "black";
    protected _right = "black";

    Styles(top: string, right: string, bottom: string, left: string): Styles {
        this._top = top;
        this._bottom = bottom;
        this._left = left;
        this._right = right;
        return this;
    }

    // --- Accessors --- //

    get top() {
        return this._top;
    }
    set top(n: string) {
        this._top = n;
    }
    get right() {
        return this._right;
    }
    set right(n: string) {
        this._right = n;
    }
    get bottom() {
        return this._bottom;
    }
    set bottom(n: string) {
        this._bottom = n;
    }
    get left() {
        return this._left;
    }
    set left(n: string) {
        this._left = n;
    }
}