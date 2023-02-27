import { Tile } from "./Tile";
import { Mouseable } from "./Events/Mouseable";
import { Draggable } from "./Draggable";

export interface hasDragger {
    get dragger(): Dragger;
}

export class Dragger implements Mouseable {
    _obj: hasDragger & Tile;
    _isMouseHandler: true;
    _dragObj: Draggable;
    _dragX: number;;
    _dragY: number;

    constructor(obj: hasDragger & Tile) {
        this._obj = obj;
    }

    MouseDown(event: any): boolean {
        console.log("MouseDown", event);
        for (let _child of this._obj.children.reverse()) {
            let child = _child as any;
            if (child.inBounds && child.inBounds(event.x, event.y) && child.grab) {
                this._dragObj = child as Draggable;
                if (child.click) child.click(event);
                if (child.grab) child.grab(event);
                this._dragX = event.offsetX;
                this._dragY = event.offsetY;
                return true;
            }
        }
    }
    MouseUp(event: any): boolean {
        if (this._dragObj) {
            this._dragObj.drop();
            this._dragObj = null;
            return true;
        }
    }
    MouseMove(event: any): boolean {
        if (this._dragObj) {
            let dx = this._dragX - event.offsetX;
            let dy = this._dragY - event.offsetY;
            this._dragX = event.offsetX;
            this._dragY = event.offsetY;
            this._dragObj.drag(dx, dy);
        }
        return false;
    }
    MenuUp(event: any): boolean {
        throw new Error("Method not implemented.");
    }
    MenuDown(event: any): boolean {
        throw new Error("Method not implemented.");
    }
    MiddleUp(event: any): boolean {
        throw new Error("Method not implemented.");
    }
    MiddleDown(event: any): boolean {
        throw new Error("Method not implemented.");
    }
    WheelUp(event: any, delta: number): boolean {
        throw new Error("Method not implemented.");
    }
    WheelDown(event: any, delta: number): boolean {
        throw new Error("Method not implemented.");
    }
}