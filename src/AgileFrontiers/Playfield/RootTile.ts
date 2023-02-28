import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Dragger, Selecter, Clicker } from "./Abilities";
import { Mouseable, Keyboardable, MyEvent } from "./Events";
import { applyMixins, Logger } from "../Utils";

/**
 * The RootTile has some special capabilities
 */

export class _RootTile extends Tile { };
export interface _RootTile extends Keyboardable, Mouseable, Clicker, Selecter, Dragger, Logger { };
applyMixins(_RootTile, [Keyboardable, Mouseable, Clicker, Selecter, Dragger, Logger]);

export class RootTile extends _RootTile implements Mouseable, Keyboardable {
    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null as unknown as Tile, x, y, w, h, playfield);
        this.Dragger();
        this.Selecter();
        this.Logger("info", false);
    }
    draw() {
        this.redrawChildren();
    }
    MouseMove(myEvent: MyEvent) :boolean {
        this._dragChild(myEvent);
        return true;
    }
    MouseDown(myEvent: MyEvent): boolean {
        this.warn(myEvent);
        let that = (this as any);
        let children = that.children.reverse();
        this.warn(children);
        for (let _child of that.children.reverse()) {
            let child = _child as any;
            if (child.inBounds && child.inBounds(myEvent.x, myEvent.y)) {
                this.warn("Found...", child);
                let processed = false;
                if (child.onGrab) processed = this._grabChild(child, myEvent) || processed;
                if (child.onSelected) processed = this._selectChild(child, myEvent) || processed;
                if (child.onClick) processed = this._clickChild(child, myEvent) || processed;
                if (processed) return true;
            }
        }
        return false;
    }
    MouseUp(myEvent:MyEvent): boolean {
        this._dropChild(myEvent);
        return true;
    }
}
