import * as Utils from "../Utils";
import { Mixin } from "../Mixins";
import { _Movable } from "./Movable";

export function Draggable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _origX = 0; // original x
        _origY = 0; // original y
        _snap = 10;
        _isDraggable = true;
        _movable: _Movable;

        Dragabble(snap=10) {
            this._snap = snap;
            this._movable = this as unknown as _Movable;
        }
        get isDraggable() {
            return this._isDraggable;
        }
        set isDraggable(b: boolean) {
            this._isDraggable = b;
        }
        drag(dx: number, dy: number) {
            let newX = Utils.snapTo(this._origX + dx, this._snap);
            let newY = Utils.snapTo(this._origY + dy, this._snap);
            this._movable.move(newX, newY);
        }
        grab() {
            this._origX = this._movable.x;
            this._origY = this._movable.y;
        }
        drop() {
        }
    };
}
