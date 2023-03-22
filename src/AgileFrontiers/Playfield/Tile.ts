import { applyMixins, Tree, Rect, RelRect, between, Logger, Margins } from "../Utils";
import { Gfx } from "./Graphics";
import { Playfield } from "./Playfield";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { Options } from "./Options";

/**
 * A Tile is a rectangular item on a Playfield.
 * It can draw itself on the Playfield
* It has its own set of GfxParms (font, colors, x/y offset)`       
 * it can move around
 * it is hierarcically organized so is drawn relative to its parent
 */

export class TileOptions extends Options {
    margins = (new Margins).Margins(0, 0, 0, 0);
}

export class _Tile { };
export interface _Tile extends Logger, Tree, Rect, RelRect { };
applyMixins(_Tile, [Logger, Tree, Rect, RelRect]);

export interface Tile { };
export class Tile extends _Tile {
    private _playfield: Playfield;
    private _gfx: Gfx;
    private _options = new TileOptions;
    private _logger: Logger;
    private _tabOrder = 0;

    constructor(name: string, parent: Tile, x0: number, y0: number, w: number, h: number) {
        super();
        this.Logger();
        this.RelRect(x0, y0, x0 + w - 1, y0 + h - 1);
        this.Tree(name, parent);
    }

    // --- Static Members --- //
    public static null = null as unknown as Tile;
    public static cast(obj: any): Tile {
        return obj as Tile;
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        super.addChild(child);
        child.playfield = this._playfield;
        child._gfx = this._playfield.gfx;
        child._tabOrder = this.children.length - 1;
    }
    // --- Public Methods --- //

    inBoundsChildren(x: number, y: number, checkThis = true): Tile {
        let found = Tile.null;
        if (checkThis) found = this.inBounds(x,y);
        if (found) return found;
        for (let child of this.children) {
            let tileChild = Tile.cast(child);
            found = tileChild.inBoundsChildren(x, y);
            if (found) break;
        }
        return found;
    }

    inBounds(x: number, y: number): Tile {
        if (
            between(this.X, x, this.X + this.w) &&
            between(this.Y, y, this.Y + this.h))
            return this;
        return Tile.null;
    }

    drawChildren() {
        this.children.forEach(child => (child as Tile).draw());
    }

    draw() {
        this.drawChildren();
    }

    // --- OnActions --- //

    onTick() {
        this.children.forEach(child => (child as Tile).onTick());
    }

    onEvent(pfEvent: PlayfieldEvent) {
    }

    // --- Accessors --- //

    get gfx(): Gfx {
        return this._gfx;
    }
    get X(): number {
        // Absolute Screen coordinates
        if (this.parent) return this.x + Tile.cast(this.parent).X;
        return this.x;
    }
    get Y(): number {
        // Absolute Screen Coordinates
        if (this.parent) return this.y + Tile.cast(this.parent).Y;
        return this.y;
    }
    get W(): number {
        // Absolute Screen Coordinates (kinda)
        return this.w;
    }
    get H(): number {
        // Absolute Screen Coordinates (kinda)
        return this.h;
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
