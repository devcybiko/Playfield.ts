import { Draggable } from "./Draggable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Draggable
 */
export interface DragController { };
export class DragController {
    protected _isDragControllerInitialized: boolean;
    protected _dragObj: Draggable;
    protected _dragX: number;
    protected _dragY: number;
    public _asTile: Tile;

    DragController() {
        this._isDragControllerInitialized = true;
        this._dragObj = null;
        this._dragX = 0;
        this._dragY = 0;
        return this;
    }

    // --- Public Methods --- //

    dragEvent(pfEvent: PlayfieldEvent, child: Draggable) {
        if (pfEvent.isMove) return this._dragChild(pfEvent, child);
        else if (pfEvent.isPress) return this._grabChild(pfEvent, child);
        else if (pfEvent.isRelease) return this._dropChild(pfEvent, child);
    }

    // --- Private Methods --- //

    _dragChild(pfEvent: PlayfieldEvent, child: Draggable) {
        if (this._dragObj) {
            this._dragObj.onDrag(pfEvent.x - this._dragX, pfEvent.y - this._dragY, pfEvent);
            this._dragX = pfEvent.x;
            this._dragY = pfEvent.y;
        }
    }

    _grabChild(pfEvent: PlayfieldEvent, child: Draggable) {
        if (!child.isDragEnabled) return;
        if (child._asTile.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            let dx = pfEvent.x - child._asTile.X;
            let dy = pfEvent.y - child._asTile.Y;
            console.log(dx, dy, this._asTile.X, this._asTile.Y);
            console.log(this, this._asTile);
            if (child.onGrab(dx, dy, pfEvent)) {
                // if the child does not reject the "grab"
                this._dropChild(pfEvent, child);
                this._dragX = pfEvent.x;
                this._dragY = pfEvent.y;
                this._dragObj = child;
            }
        }
    }

    _dropChild(pfEvent: PlayfieldEvent, child: Draggable) {
        if (this._dragObj) {
            this._dragObj.onDrop(pfEvent);
            this._dragObj = null;
        }
    }

}