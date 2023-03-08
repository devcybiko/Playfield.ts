import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { applyMixins, Logger } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _RootTile extends Tile { };
export interface _RootTile extends EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_RootTile, [EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class RootTile extends _RootTile {
    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null as unknown as Tile, x, y, w, h, playfield);
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

    // --- onActions --- //

    onEvent(pfEvent: PlayfieldEvent): boolean {
        let children = this.children.reverse();
        return this.dispatchEventToChildren(pfEvent);
    }
}
