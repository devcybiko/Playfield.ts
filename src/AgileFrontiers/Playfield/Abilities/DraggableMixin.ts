import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Draggable { }
export class Draggable {
    private _isDraggable: boolean;
    private _isDragging: boolean;

    Draggable() {
        this.isDraggable = true;
        this.isDragging = false;
        return this;
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        this.isDragging = true;
        pfEvent.isActive = false;
        return true;
    }
    
    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
        if (this.isDragging) {
            let that = this as any;
            if (that.rmove) that.rmove(dx, dy);
            pfEvent.isActive = false;
        }
    }
    onDrop(pfEvent: PlayfieldEvent): void {
        if (this.isDragging) {
            this.isDragging = false;
            pfEvent.isActive = false;
        }
    }

    // --- Accessors --- //

    public get isDraggable() {
        return this._isDraggable;
    }
    public set isDraggable(value) {
        this._isDraggable = value;
    }
    public get isDragging(): boolean {
        return this._isDragging;
    }
    public set isDragging(value: boolean) {
        this._isDragging = value;
    }

}
