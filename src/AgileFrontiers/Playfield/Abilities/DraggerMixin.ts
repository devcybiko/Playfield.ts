import { Draggable } from "./DraggableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Logger } from "../../Utils";
import { Tile } from "../Tile";


export interface Dragger { };
export class Dragger {
    _dragObj: Draggable;
    _dragX: number;
    _dragY: number;
    _logger: Logger;

    Dragger() {
        this._dragObj = null;
        this._dragX = 0;
        this._dragY = 0;
        this._logger = (this as unknown as Logger);
        return this;
    }
    dragEvent(pfEvent: PlayfieldEvent, child: Draggable): boolean {
        if (pfEvent.type === "mousemove") return this._dragChild(pfEvent, child);
        else if (pfEvent.type === "mousedown") return this._grabChild(pfEvent, child);
        else if (pfEvent.type === "mouseup") return this._dropChild(pfEvent, child);
    }

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