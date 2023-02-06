function Rect<TBase extends Constructor>(_base: TBase) {
    return class extends _base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        _x = 0;
        _y = 0;
        _w = 0;
        _h = 0;

        public x(xx?: number): number {
            if (xx !== undefined) this._x = xx;
            return this._x;
        }
        public y(yy?: number): number {
            if (yy !== undefined) this._y = yy;
            return this._y;
        }
        public w(ww?: number): number {
            if (ww !== undefined) this._w = ww;
            return this._w;
        }
        public h(hh?: number): number {
            if (hh !== undefined) this._h = hh;
            return this._h;
        }
        public Rect(x: number, y: number, w: number, h: number) {
            this._x = x;
            this._y = y;
            this._h = h;
            this._w = w;
        }
    };
}
