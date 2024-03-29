import { applyMixins, Tree, Rect, RelRect, between, Logger, Margins, Dimensions } from "../Utils";
import { Gfx } from "./Graphics";
import { Playfield } from "./Playfield";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { Options } from "./Options";
import { ClickController, Clickable, DragController, Draggable, EditController, Editable, DispatchController, HoverController, Hoverable, PressController, Pressable, Resizable, SelectController, Selectable, SlideController, Slideable } from "./Abilities"
import { Swipeable } from "./Abilities/Swipeable";
import { SwipeController } from "./Abilities/SwipeController";
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
export interface _Tile extends DispatchController, Logger, Tree, Rect, RelRect { };
applyMixins(_Tile, [DispatchController, Logger, Tree, Rect, RelRect]);

export interface Tile { };
export class Tile extends _Tile {
    protected _playfield: Playfield;
    protected _gfx: Gfx;
    protected _options = new TileOptions;
    protected _tabOrder = 0;
    protected _data: any;
    protected _X = 0;
    protected _Y = 0;
    protected _isVisible = true;
    public override _asRect: Rect;
    public _type = "Tile";
    public override _asTile: Tile;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super();
        this.Tree(name, parent);
        this._asTile = this;
        this.Logger();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if (parent && w && h) this.RelRect(x, y, x + w - 1, y + h - 1);
        this._data = null;
    }

    // --- Static Members --- //
    public static null = null as unknown as Tile;
    public static cast(obj: any): Tile {
        return obj as Tile;
    }

    // --- Overrides --- //

    _initTile() {
        let anyChild = this as any;
        // is this a good idea? or should we enforce objects initizing within their constructors?
        (anyChild as Logger).Logger && (anyChild as Logger).Logger();

        (anyChild as Clickable).Clickable && (anyChild as Clickable).Clickable();
        (anyChild as Draggable).Draggable && (anyChild as Draggable).Draggable();
        (anyChild as Editable).Editable && (anyChild as Editable).Editable();
        (anyChild as DispatchController).DispatchController && (anyChild as DispatchController).DispatchController();
        (anyChild as Hoverable).Hoverable && (anyChild as Hoverable).Hoverable();
        (anyChild as Pressable).Pressable && (anyChild as Pressable).Pressable();
        (anyChild as Resizable).Resizable && (anyChild as Resizable).Resizable();
        (anyChild as Selectable).Selectable && (anyChild as Selectable).Selectable();
        (anyChild as Slideable).Slideable && (anyChild as Slideable).Slideable();
        (anyChild as Swipeable).Swipeable && (anyChild as Swipeable).Swipeable();

        (anyChild as ClickController).ClickController && (anyChild as ClickController).ClickController();
        (anyChild as DragController).DragController && (anyChild as DragController).DragController();
        (anyChild as EditController).EditController && (anyChild as EditController).EditController();
        (anyChild as HoverController).HoverController && (anyChild as HoverController).HoverController();
        (anyChild as PressController).PressController && (anyChild as PressController).PressController();
        (anyChild as SelectController).SelectController && (anyChild as SelectController).SelectController();
        (anyChild as SlideController).SlideController && (anyChild as SlideController).SlideController();
        (anyChild as SwipeController).SwipeController && (anyChild as SwipeController).SwipeController();

        // (anyChild as Draggable)._isDraggableInitialized && (anyChild as Pressable)._isPressableInitialized && this.error("Warning: It's not a good idea to mix Draggable with Pressable since Draggable will invalidate the Event on isPress")
    }
    override addChild(child: Tile) {
        super.addChild(child);
        child.playfield = this._playfield;
        child._gfx = this._playfield.gfx.clone();
        child._tabOrder = this.children.length - 1;
        child._initTile();
    }
    updateRect() {
        // this is called only in rare cases where the parent never sets .x or .y
        this.x = this.x; // see set x(), below (updates _X relative to parent)
        this.y = this.y; // see set y(), below (updates _Y relative to parent)
    }
    updateGparms(enable = true) {
        this.gfx.gparms.enable = enable;
        this.gfx.gparms.fillColor = this._options.backgroundColor;
    }
    // --- Public Methods --- //

    inBoundsChildren(x: number, y: number, pfEvent?: PlayfieldEvent, checkThis = true): Tile {
        // GLS - the CheckThis flag doesn't appear to ever be used
        let found = Tile.null;
        if (checkThis) found = this.inBounds(x, y, pfEvent);
        if (found) return found;
        for (let child of this.children) {
            let tileChild = child as unknown as Tile;
            found = tileChild.inBoundsChildren(x, y, pfEvent);
            if (found) break;
        }
        return found;
    }

    inBounds(x: number, y: number, pfEvent?: PlayfieldEvent): Tile {
        // if (!pfEvent.isMove) console.log("inbounds 0", this);
        if (this.isVisible &&
            between(this.X, x, this.X + this.w) &&
            between(this.Y, y, this.Y + this.h))
            return this;
        return Tile.null;
    }

    drawChildren(enable = true): Dimensions {
        let maxDimensions = new Dimensions();
        for (let i = 0; i < this.children.length; i++) {
            let tileChild = this.children[i] as unknown as Tile;
            let deltas = tileChild.draw(enable);
            maxDimensions.w = Math.max(maxDimensions.w, tileChild.x + deltas.w);
            maxDimensions.h = Math.max(maxDimensions.h, tileChild.y + deltas.h);
        }
        return maxDimensions;
    }

    draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        return this.drawChildren(enable);
    }

    serialize() {
        let obj = this.objectify();
        if (obj && this.children) {
            obj.children = [];
            for (let _child of this.children) {
                let child = _child as unknown as Tile;
                let childObj = child.serialize();
                if (childObj) obj.children.push(childObj);
            }
        }
        return obj;
    }

    objectify(): any {
        let obj = {} as any;
        obj.name = this.name;
        obj.x = this.x;
        obj.y = this.y;
        obj.w = this.w;
        obj.h = this.h;
        return obj;
    }

    find(name: string): Tile {
        for (let child of this.children) {
            if (child.name === name) return child as unknown as Tile;
            let found = (child as unknown as Tile).find(name);
            if (found) return found;
        }
        return Tile.null;
    }
    // --- OnActions --- //

    onTick(): void {
        this.children.forEach(child => (child as Tile).onTick());
    }

    // --- Overrides --- //

    override printMe() {
        console.log(" | ".repeat(this.depth()), this.name, this.x, this.y, this.w, this.h, "(", this.X, this.Y, this.W, this.H, ")", this.isVisible);
    }

    // --- Accessors --- //

    get gfx(): Gfx {
        return this._gfx;
    }
    override set x(n: number) {
        this._x = n;
        this._X = n;
        this._X += this.parent.X;
    }
    override get x(): number {
        return this._x;
    }
    override set y(n: number) {
        this._y = n;
        this._Y = n;
        this._Y += this.parent.Y;
    }
    override get parent(): Tile {
        return this._parent as Tile;
    }
    override get y(): number {
        return this._y;
    }
    get X(): number {
        // Absolute Screen coordinates
        return this._X;
    }
    get Y(): number {
        // Absolute Screen Coordinates
        return this._Y;
    }
    get W(): number {
        // Absolute Screen Coordinates (kinda)
        return this.w;
    }
    get H(): number {
        // Absolute Screen Coordinates (kinda)
        return this.h;
    }
    get Dimensions(): Dimensions {
        let d = this.dimensions;
        d.w += this.x;
        d.h = this.y;
        return d;
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
    public get isVisible() {
        return this._isVisible;
    }
    public set isVisible(value) {
        this._isVisible = value;
    }
    override onEvent(pfEvent: PlayfieldEvent, controller: Tile) {
        return super.onEvent(pfEvent, controller);
    }
}
