import {Mixin} from "./Mixin";

export function Rect<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        _x = 0;
        _y = 0;
        _w = 0;
        _h = 0;

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

        public Rect(x: number, y: number, w: number, h: number) {
            this._x = x;
            this._y = y;
            this._h = h;
            this._w = w;
        }
    };
}
