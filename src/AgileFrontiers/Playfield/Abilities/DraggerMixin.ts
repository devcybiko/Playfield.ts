import { Draggable } from "./DraggableMixin";
import { MouseEvent } from "../Events/MouseEvent";

export interface Dragger { };
export class Dragger {
    _dragObj: Draggable;
    _dragX: number;
    _dragY: number;

    Dragger() {
        this._dragObj = null;
        this._dragX = 0;
        this._dragY = 0;
        return this;
    }

    _grabChild(child: Draggable, myEvent: MouseEvent): boolean {
        if (child.isDraggable && !this._dragObj) {
            this._dragObj = child as Draggable;
            child.onGrab(myEvent);
            this._dragX = myEvent.x;
            this._dragY = myEvent.y;
            return true;    
        }
        return false;
    }
    _dragChild(myEvent: MouseEvent): boolean {
        if (this._dragObj) {
            this._dragObj.onDrag(myEvent.x - this._dragX, myEvent.y - this._dragY);
            this._dragX = myEvent.x;
            this._dragY = myEvent.y;
            return true;
        }
        return false;
    }
    _dropChild(myEvent: MouseEvent): boolean {
        if (this._dragObj) {
            let dragObj = this._dragObj;
            this._dragObj = null;
            dragObj.onDrop(myEvent);
            return true;
        }
        return false;
    }
}