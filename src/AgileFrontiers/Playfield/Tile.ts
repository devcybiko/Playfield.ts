import { applyMixins, Tree, Rect, between, Logger } from "../Utils";
import { Gfx, GfxParms } from "../Graphics";
import { Playfield } from "./Playfield";
import { PlayfieldEvent } from "./PlayfieldEvents";

/**
 * A Tile is a rectangular item on a Playfield.
 * It can draw itself on the Playfield
* It has its own set of GfxParms (font, colors, x/y offset)`       
 * it can move around
 * it is hierarcically organized so is drawn relative to its parent
 */

export class _Tile { };
export interface _Tile extends Logger, Tree, Rect { };
applyMixins(_Tile, [Logger, Tree, Rect]);

export interface Tile {};
export class Tile extends _Tile  {
    _playfield: Playfield;
    _gparms: GfxParms;
    _logger: Logger;
    _tabOrder: number;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, playfield = parent._playfield) {
        super();
        this.Tree(name, parent);
        this.Rect(x, y, w, h);
        this.Logger();
        this._gparms = new GfxParms();
        this._playfield = playfield;
        this._tabOrder = this.parent ? this.parent.children.indexOf(this) : 0;
        return this;
    }
    get gfx(): Gfx {
        return this._playfield.gfx;
    }
    get gparms(): GfxParms {
        return this._gparms;
    }
    get X(): number {
        return this.x + this.gparms.dx;
    }
    get Y(): number {
        return this.y + this.gparms.dy;
    }
    // add(child: Tile) {
    // super.add(child);
    // child._playfield = this._playfield;
    // }
    inBounds(x: number, y: number): Tile {
        let result =
            between(this.X, x, this.X + this.w) &&
            between(this.Y, y, this.Y + this.h);
        if (result) return this;
        for (let child of this.children.reverse()) {
            let found = (child as Tile).inBounds(x, y);
            if (found) return found;
        }
        return null;
    }
    _recompute() {
        if (this.parent) {
            this.gparms.dx = (this.parent as Tile).X;
            this.gparms.dy = (this.parent as Tile).Y;
        }
    }
    drawAll(): void {
        this.redraw();
        for (let child of this.children) {
            (child as Tile).drawAll();
        }
    }
    redraw() {
        this._recompute();
        this.draw();
    }
    redrawChildren() {
        this.children.forEach(child => (child as Tile).redraw());
    }
    draw() {
        this.redrawChildren();
    }
    onTick(): boolean {
        this.children.forEach(child => (child as Tile).onTick());
        return true;
    }
    onEvent(pfEvent: PlayfieldEvent): boolean {
        return true;
    }
}
