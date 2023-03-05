import { Draggable } from "./DraggableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";


export interface Dragger { };
export class Dragger {
    private _dragObj: Draggable;
    private _dragX: number;
    private _dragY: number;

    Dragger() {
        this._dragObj = null;
        this._dragX = 0;
        this._dragY = 0;
        return this;
    }

    // --- Public Methods --- //

    dragEvent(pfEvent: PlayfieldEvent, child: Draggable): boolean {
        if (pfEvent.isMove) return this._dragChild(pfEvent, child);
        else if (pfEvent.isPress) return this._grabChild(pfEvent, child);
        else if (pfEvent.isRelease) return this._dropChild(pfEvent, child);
    }

    // --- Private Methods --- //

    _dragChild(pfEvent: PlayfieldEvent, child: Draggable): boolean {
        if (this._dragObj) {
            this._dragObj.onDrag(pfEvent.x - this._dragX, pfEvent.y - this._dragY, pfEvent);
            this._dragX = pfEvent.x;
            this._dragY = pfEvent.y;
            return true;
        }
        return false;
    }
    _grabChild(pfEvent: PlayfieldEvent, child: Draggable): boolean {
        let tileChild = child as unknown as Tile;
        if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
            this._dropChild(pfEvent, child);
            this._dragObj = child;
            this._dragX = pfEvent.x;
            this._dragY = pfEvent.y;
            child.onGrab(pfEvent);
            return true;
        }
        return false;
    }

    _dropChild(pfEvent: PlayfieldEvent, child: Draggable): boolean {
        if (this._dragObj) {
            this._dragObj.onDrop(pfEvent);
            this._dragObj = null;
            return true;
        }
        return false;
    }

}