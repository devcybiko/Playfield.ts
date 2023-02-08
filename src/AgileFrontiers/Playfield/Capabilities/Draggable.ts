import * as Utils from "../../Utils";
import { Mixin, Base, iBase } from "../../Mixins";
import { MovableClass } from "./Movable";

export interface iDraggable extends iBase {
    Dragabble(snap: number): void;
    get isDraggable(): boolean;
    set isDraggable(b: boolean);
    drag(dx: number, dy: number): void;
    grab(): void;
    drop(): void;
}

export const DraggleBase = Draggable(Base);
export abstract class DraggableClass extends DraggleBase {};
export function Draggable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _origX = 0; // original x
        _origY = 0; // original y
        _snap = 10;
        _isDraggable = true;
        any: MovableClass;

        Dragabble(snap=10) {
            this._snap = snap;
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
            this.any.move(newX, newY);
        }
        grab() {
            this._origX = this.any.x;
            this._origY = this.any.y;
        }
        drop() {
        }
    };
}
