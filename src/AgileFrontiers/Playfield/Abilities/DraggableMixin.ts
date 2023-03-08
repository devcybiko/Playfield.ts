import { PlayfieldEvent } from "../PlayfieldEvent";

export interface Draggable { }
export class Draggable {
    private _isDraggable: boolean;

    Draggable() {
        this.isDraggable = true;
        return this;
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    
    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        let that = this as any;
        if (that.rmove) that.rmove(dx, dy);
        return true;
    }
    onDrop(pfEvent: PlayfieldEvent): boolean {
        return false;
    }

    // --- Accessors --- //

    public get isDraggable() {
        return this._isDraggable;
    }
    public set isDraggable(value) {
        this._isDraggable = value;
    }
}
