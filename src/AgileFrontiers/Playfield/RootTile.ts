import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { applyMixins, Logger } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _RootTile extends Tile { };
export interface _RootTile extends EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_RootTile, [EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class RootTile extends _RootTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Logger();
        this.Clicker();
        this.Presser();
        this.Selecter();
        this.Dragger();
        this.Editor();
        this.Hoverer();
        this.EventDispatcher();
    }

    // --- Overrides --- //

    draw() {
        this.redrawChildren();
    }

    rsize(dx: number, dy: number) {
        let child = this.children[0] as any;
        super.rsize(dx, dy);
        if (child.east) { // VSplit found
            child.rsize(dx, dy);
            child.east.rsize(dx, dy);
            child.west.rsize(dx, dy);
        }
        if (child.north) { // HSplit found
            child.rsize(dx, dy);
            child.north.rsize(dx, dy);
            child.south.rsize(dx, dy);
        }
    }
    // --- onActions --- //

    onEvent(pfEvent: PlayfieldEvent) {
        if (pfEvent.isMouseEvent && this.inBounds(pfEvent.x, pfEvent.y)) {
            this.dispatchEventToChildren(pfEvent);
        } else if (pfEvent.isKeyboardEvent) {
            this.dispatchEventToChildren(pfEvent);
        }
    }

}
