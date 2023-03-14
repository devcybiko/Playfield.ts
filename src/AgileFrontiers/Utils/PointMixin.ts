export class Point {
    private _x = 0;
    private _y = 0;

    Point(x: number, y: number) {
        this._x = x;
        this._y = y;
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
}