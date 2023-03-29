import { applyMixins, Tree, Rect, RelRect, between, Logger, Margins } from "../Utils";
import { Gfx } from "./Graphics";
import { Playfield } from "./Playfield";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { Options } from "./Options";
import { Dispatchable } from "./Abilities";
/**
 * A Tile is a rectangular item on a Playfield.
 * It can draw itself on the Playfield
* It has its own set of GfxParms (font, colors, x/y offset)`       
 * it can move around
 * it is hierarcically organized so is drawn relative to its parent
 */

export class TileOptions extends Options {
    margins = (new Margins).Margins(0, 0, 0, 0);
    backgroundColor = "white";
}

export class _Tile { };
export interface _Tile extends Dispatchable, Logger, Tree, Rect, RelRect { };
applyMixins(_Tile, [Dispatchable, Logger, Tree, Rect, RelRect]);

export interface Tile { };
export class Tile extends _Tile {
    protected _playfield: Playfield;
    protected _gfx: Gfx;
    protected _options = new TileOptions;
    protected _tabOrder = 0;
    protected _data: any;

    constructor(name: string, parent: Tile, x0: number, y0: number, w: number, h: number) {
        super();
        this.RelRect(x0, y0, x0 + w - 1, y0 + h - 1);
        this.Tree(name, parent);
        this._data = null;
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
        child._gfx = this._playfield.gfx.clone();
        child._tabOrder = this.children.length - 1;
        let anyChild = child as any;
        // is this a good idea? or should we enforce objects initizing within their constructors?
        if (anyChild.Clickable && !anyChild.isClickable) anyChild.Clickable();
        if (anyChild.Dispatchable && !anyChild.isDispatchable) anyChild.Dispatchable();
        if (anyChild.Draggable && !anyChild.isDraggable) anyChild.Draggable();
        if (anyChild.Editable && !anyChild.isEditable) anyChild.Editable();
        if (anyChild.Hoverable && !anyChild.isHoverable) anyChild.Hoverable();
        if (anyChild.Pressable && !anyChild.isPressable) anyChild.Pressable();
        if (anyChild.Resizable && !anyChild.isResizable) anyChild.Resizable();
        if (anyChild.Selectable && !anyChild.isSelectable) anyChild.Selectable();

        if (anyChild.Clicker && !anyChild.isClicker) anyChild.Clicker();
        if (anyChild.Dispatcher && !anyChild.isDispatcher) anyChild.Dispatcher();
        if (anyChild.Dragger && !anyChild.isDragger) anyChild.Dragger();
        if (anyChild.Editer && !anyChild.isEditer) anyChild.Editer();
        if (anyChild.Hoverer && !anyChild.isHoverer) anyChild.Hoverer();
        if (anyChild.Presser && !anyChild.isPresser) anyChild.Presser();
        if (anyChild.Resizer && !anyChild.isResizer) anyChild.Resizer();
        if (anyChild.Selecter && !anyChild.isSelecter) anyChild.Selecter();

        if (anyChild.Logger && !anyChild.isLoggable) anyChild.Logger();
        if (anyChild.isDraggable && anyChild.isPressable) this.error("Warning: It's not a good idea to mix Draggable with Pressable since Draggable will invalidate the Event on isPress")
    }

    _updateGparms() {
        this.gfx.gparms.fillColor = this._options.backgroundColor;
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

    draw(): void {
        this._updateGparms();
        this.drawChildren();
    }

    // --- OnActions --- //

    onTick(): void {
        this.children.forEach(child => (child as Tile).onTick());
    }

    // --- Overrides --- //

    override printMe() {
        console.log(" | ".repeat(this.depth()), this.name, this.X, this.Y, this.W, this.H);
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
    public get data(): any {
        return this._data;
    }
    public set data(value: any) {
        this._data = value;
    }
    public get options() {
        return this._options;
    }
    public set options(value) {
        this._options = value;
    }

}
