import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Draggable } from "./Abilities";
import { applyMixins, Logger, Tree, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _HSplit extends Tile { };
export interface _HSplit extends Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_HSplit, [Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class HSplit extends _HSplit {

    private _north: Tile;
    private _south: Tile;
    private _margin = 0;
    private _gutter = 4;
    private _splitHeight = 0;

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

        let dh = this.h - this._margin * 2 - this._gutter;
        this._splitHeight = int(dh * percent);

        let nx = this._margin;
        let ny = this._margin;
        let nw = this.w - this._margin * 2;
        let nh = this._splitHeight;

        let sx = nx;
        let sy = ny + nh + this._gutter / 2;
        let sw = this.w - this._margin * 2;
        let sh = dh - this._splitHeight;

        this._north = new RootTile("north", this, nx, ny, nw, nh);
        this._south = new RootTile("south", this, sx, sy, sw, sh);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use HSplit.north or HSplit.south");
    }

    draw() {
        this._drawChild(this.north);
        this._drawChild(this.south);
    }

    _drawChild(child: Tile) {
        child.gfx.rect(child.x, child.y, child.w, child.h);
        child.gfx.clipRect(child.x, child.y, child.w, child.h);
        child.redraw();
        child.gfx.restore();
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (between(this._margin, dx, this.w - this._margin)
            && between(this._margin + this._splitHeight, dy, this._margin + this._splitHeight + this._gutter)) {
            return super.onGrab(dx, dy, pfEvent);
        }
        return false;
    }

    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this.isDragging) {
            if (this._splitHeight + dy > this._gutter) {
                this._north.rsize(0, dy);
                this._south.rmove(0, dy);
                this._south.rsize(0, -dy);
                this._splitHeight += dy;
            }
            return true;
        }
        return false;
    }

    rsize(dx: number, dy: number) {
        console.log("RSIZE", dx, dy);
        super.rsize(dx, dy);
        this._north.rsize(0, dy);
        this._south.rmove(0, dy);
        this._south.rsize(0, -dy);
        this._splitHeight += dy;
    }

    onEvent(pfEvent: PlayfieldEvent) {
        if (this.inBounds(pfEvent.x, pfEvent.y)) {
            if (!this.isDragging) this.dispatchEventToChildren(pfEvent);
        } else {
            if (pfEvent.isKeyboardEvent) this.dispatchEventToChildren(pfEvent);
        }
    }

    public get north(): Tile {
        return this._north;
    }
    public set north(value: Tile) {
        this._north = value;
    }
    public get south(): Tile {
        return this._south;
    }
    public set south(value: Tile) {
        this._south = value;
    }

}
