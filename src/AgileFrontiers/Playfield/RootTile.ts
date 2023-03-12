import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Resizable, EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { applyMixins, Logger } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _RootTile extends Tile { };
export interface _RootTile extends Resizable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_RootTile, [Resizable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

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
        this.Resizable();
        this.EventDispatcher();
    }

    // --- Overrides --- //

    draw() {
        this.redrawChildren();
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
