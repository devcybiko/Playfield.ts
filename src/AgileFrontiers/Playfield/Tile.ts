import { applyMixins, Tree, Rect, between, Logger } from "./Utils";
import { Gfx } from "./Graphics";
import { Playfield } from "./Playfield";
import { PlayfieldEvent } from "./PlayfieldEvent";

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

export interface Tile { };
export class Tile extends _Tile {
    private _playfield: Playfield;
    private _gfx: Gfx;
    private _logger: Logger;
    private _tabOrder: number;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, playfield = parent._playfield) {
        super();
        this.Logger();
        this.Tree(name, parent);
        this.Rect(x, y, w, h);
        this._playfield = playfield;
        this._gfx = playfield.gfx.clone();
        this._tabOrder = this.parent ? this.parent.children.indexOf(this) : 0;
        return this;
    }

    // --- Public Methods --- //

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

    // --- OnActions --- //

    onTick(): boolean {
        this.children.forEach(child => (child as Tile).onTick());
        return true;
    }

    onEvent(pfEvent: PlayfieldEvent): boolean {
        this.children.forEach(child => (child as Tile).onEvent(pfEvent));
        return true;
    }

    // --- Private Methods --- //
    
    _recompute() {
        if (this.parent) {
            this.gfx.gparms.dx = (this.parent as Tile).X;
            this.gfx.gparms.dy = (this.parent as Tile).Y;
        }
    }

    // --- Accessors --- //

    get gfx(): Gfx {
        return this._gfx;
    }
    get X(): number {
        return this.x + this.gfx.gparms.dx;
    }
    get Y(): number {
        return this.y + this.gfx.gparms.dy;
    }
    public get playfield(): Playfield {
        return this._playfield;
    }
    public set playfield(value: Playfield) {
        this._playfield = value;
    }
}
