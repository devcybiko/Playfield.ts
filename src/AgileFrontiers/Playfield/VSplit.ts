import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Draggable } from "./Abilities";
import { applyMixins, Logger, Tree, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _VSplit extends Tile { };
export interface _VSplit extends Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_VSplit, [Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class VSplit extends _VSplit {

    private _east: Tile;
    private _west: Tile;
    private _margin = 0;
    private _gutter = 4;
    private _splitWidth = 0;

    constructor(name: string, parent: Tile, percent: number) {
        super(name, parent, 0, 0, 0, 0);
        if (percent >= 1.0) percent = percent / 100.0;
        this.x = 0
        this.y = 0;
        this.w = parent.w;
        this.h = parent.h;
        this.Logger();
        this.Clicker();
        this.Presser();
        this.Selecter();
        this.Dragger();
        this.Editor();
        this.Hoverer();
        this.EventDispatcher();
        this.Draggable();

        let dw = this.w - this._margin * 2 - this._gutter;
        this._splitWidth = int(dw * percent);

        let nx = this._margin;
        let ny = this._margin;
        let nh = this.h - this._margin * 2;
        let nw = this._splitWidth;

        let sy = ny;
        let sx = nx + nw + this._gutter / 2;
        let sh = this.h - this._margin * 2;
        let sw = dw - this._splitWidth;

        this._east = new RootTile("east", this, nx, ny, nw, nh);
        this._west = new RootTile("west", this, sx, sy, sw, sh);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use VSplit.east or VSplit.west");
    }

    draw() {
        this._drawChild(this.east);
        this._drawChild(this.west);
    }

    _drawChild(child: Tile) {
        child.gfx.rect(child.x, child.y, child.w, child.h);
        child.gfx.clipRect(child.x, child.y, child.w, child.h);
        child.redraw();
        child.gfx.restore();
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (between(this._margin, dy, this.h - this._margin)
            && between(this._margin + this._splitWidth, dx, this._margin + this._splitWidth + this._gutter)) {
            return super.onGrab(dx, dy, pfEvent);
        }
        return false;
    }

    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this.isDragging) {
            if (this._splitWidth + dx > this._gutter) {
                this._east.rsize(dx, 0);
                this._west.rmove(dx, 0);
                this._west.rsize(-dx, 0);
                this._splitWidth += dx;
            }
        }
    }

    rsize(dx: number, dy: number) {
        super.rsize(dx, dy);
        this._east.rsize(dx, 0);
        this._west.rmove(dx, 0);
        this._west.rsize(-dx, 0);
        this._splitWidth += dx;
    }

    onEvent(pfEvent: PlayfieldEvent) {
        if (this.inBounds(pfEvent.x, pfEvent.y)) {
            if (!this.isDragging) this.dispatchEventToChildren(pfEvent);
        } else {
            if (pfEvent.isKeyboardEvent) this.dispatchEventToChildren(pfEvent);
        }
    }

    public get east(): Tile {
        return this._east;
    }
    public set east(value: Tile) {
        this._east = value;
    }
    public get west(): Tile {
        return this._west;
    }
    public set west(value: Tile) {
        this._west = value;
    }

}
