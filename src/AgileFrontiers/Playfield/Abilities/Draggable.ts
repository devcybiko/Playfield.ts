import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can be dragged
 */
export interface Draggable { }
export class Draggable {
    public _isDraggableInitialized: boolean;
    protected _isDragging: boolean;
    private _isDraggable: boolean;
    public _asTile: Tile;

    Draggable() {
        this._isDraggableInitialized = true;
        this.isDragging = false;
        this.isDraggable = false;
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

    public get isDragging(): boolean {
        return this._isDragging;
    }
    public set isDragging(value: boolean) {
        this._isDragging = value;
    }
    public get isDraggable(): boolean {
        return this._isDraggable;
    }
    public set isDraggable(value: boolean) {
        this._isDraggable = value;
    }

}
