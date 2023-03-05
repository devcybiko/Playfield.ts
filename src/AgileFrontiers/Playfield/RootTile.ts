import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Dragger, Selecter, Clicker, Presser, Editor, Editable, Hoverer } from "./Abilities";
import { applyMixins, Logger } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

/**
 * The RootTile has some special capabilities
 */

export class _RootTile extends Tile { };
export interface _RootTile extends Clicker, Presser, Selecter, Dragger, Logger, Editor, Hoverer { };
applyMixins(_RootTile, [Clicker, Selecter, Presser, Dragger, Logger, Editor, Hoverer]);

export class RootTile extends _RootTile {
    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null as unknown as Tile, x, y, w, h, playfield);
        this.Dragger();
        this.Selecter();
        this.Logger();
    }
    draw() {
        this.redrawChildren();
    }
    onEvent(pfEvent: PlayfieldEvent): boolean {
        let children = this.children.reverse();
        for (let _child of children) {
            let child = _child as any;
            if (child.isHoverable) this.hoverEvent(pfEvent, child);
            if (child.isDraggable) this.dragEvent(pfEvent, child);
            if (child.isSelectable) this.selectEvent(pfEvent, child);
            if (child.isClickable) this.clickEvent(pfEvent, child);
            if (child.isPressable) this.pressEvent(pfEvent, child);
            if (child.isFocusable) this.editorEvent(pfEvent, child);
            child.onEvent(pfEvent);
        }
        return true;
    }
}
