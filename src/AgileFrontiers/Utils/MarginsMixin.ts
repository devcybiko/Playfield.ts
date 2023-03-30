export class Margins {
    private _top = 0;
    private _bottom = 0;
    private _left = 0;
    private _right = 0;

    constructor(...args: number[]) {
        if (args.length === 0) return;
        this.Margins(args[0], args[1], args[2], args[3]);
    }

    Margins(top: number, right: number, bottom: number, left: number): Margins {
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
    set top(n: number) {
        this._top = n;
    }
    get right() {
        return this._right;
    }
    set right(n: number) {
        this._right = n;
    }
    get bottom() {
        return this._bottom;
    }
    set bottom(n: number) {
        this._bottom = n;
    }
    get left() {
        return this._left;
    }
    set left(n: number) {
        this._left = n;
    }
}