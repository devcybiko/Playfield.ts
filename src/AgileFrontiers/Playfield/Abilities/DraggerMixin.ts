import { Draggable } from "./DraggableMixin";
import { MyEvent } from "../Events/MyEvent";

export interface Dragger { };
export class Dragger {
    _dragObj: Draggable;
    _dragX: number;
    _dragY: number;

    Dragger() {
        return this;
    }

    _grabChild(child: Draggable, myEvent: MyEvent): boolean {
        if (!this._dragObj) {
            this._dragObj = child as Draggable;
            child.onGrab(myEvent);
            this._dragX = myEvent.x;
            this._dragY = myEvent.y;
            return true;    
        }
        return false;
    }
    _dragChild(myEvent: MyEvent): boolean {
        if (this._dragObj) {
            this._dragObj.onDrag(myEvent.x - this._dragX, myEvent.y - this._dragY);
            this._dragX = myEvent.x;
            this._dragY = myEvent.y;
            return true;
        }
        return false;
    }
    _dropChild(myEvent: MyEvent): boolean {
        if (this._dragObj) {
            let dragObj = this._dragObj;
            this._dragObj = null;
            dragObj.onDrop(myEvent);
            return true;
        }
        return false;
    }
}