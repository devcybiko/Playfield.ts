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
    public static null = null as unknown as Tile;

    private _playfield: Playfield;
    private _gfx: Gfx;
    private _logger: Logger;
    private _tabOrder = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super();
        this.Logger();
        this.Rect(x, y, w, h);
        this.Tree(name, parent);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        super.addChild(child);
        child.playfield = this._playfield;
        child._tabOrder = this.children.indexOf(child);
    }
    // --- Public Methods --- //

    inBoundsChildren(x: number, y: number): Tile {
        let found = Tile.null;
        for (let child of this.children.reverse()) {
            let tileChild = child as Tile;
            found = tileChild.inBoundsChildren(x, y);
            if (found) break;
        }
        if (!found) found = this.inBounds(x, y);
        return found;
    }

    inBounds(x: number, y: number): Tile {
        let found = Tile.null;
        let result =
            between(this.X, x, this.X + this.w) &&
            between(this.Y, y, this.Y + this.h);
        if (result) found = this;
        return found;
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

    onTick() {
        this.children.forEach(child => (child as Tile).onTick());
    }

    onEvent(pfEvent: PlayfieldEvent) {
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
        this._gfx = this._playfield.gfx.clone();
    }
    public get tabOrder() {
        return this._tabOrder;
    }
    public set tabOrder(value) {
        this._tabOrder = value;
    }
}
