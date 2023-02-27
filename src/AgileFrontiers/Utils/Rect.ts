export class Rect {
    _x = 0;
    _y = 0;
    _w = 0;
    _h = 0;

    Rect(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

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
}
