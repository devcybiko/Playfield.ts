import * as Utils from "../Utils";
import { Mixin, Null } from "../Mixins";

export function Movable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _x = 0;
        _y = 0;

        Movable(x: number, y: number) {
            this._x = x;
            this._y = y;
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
        move(x: number, y: number): void {
            this.x = x;
            this.y = y;
        }
        rmove(dx: number, dy: number): void {
            this.x += dx;
            this.y += dy;
        }
    };
}

export const __Movable = Movable(Null);
export class _Movable extends __Movable {
    costructor() {
    }
}