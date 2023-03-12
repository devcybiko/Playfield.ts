import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Resizable, Draggable, Hoverable } from "./Abilities";
import { applyMixins, Logger, Margins, Rect, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _HSplitter extends Tile { };
export interface _HSplitter extends Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_HSplitter, [Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class HSplitter extends _HSplitter {

    private _north: RootTile;
    private _south: RootTile;
    private _gutter = 6;
    private _margins = new Margins();
    private _hGutter = new Rect();
    private _hGutterHover = false;

    constructor(name: string, parent: Tile, topPercent= 0.5) {
        super(name, parent, 0, 0, parent.w, parent.h);
        this.Logger();
        this.Clicker();
        this.Presser();
        this.Selecter();
        this.Dragger();
        this.Editor();
        this.Hoverer();
        this.EventDispatcher();
        this.Draggable();
        this.Hoverable();
        this.Resizable();
        this._margins.Margins(0, 0, 0, 0);

        this._north = new RootTile("ne", this, 0, 0, 0, 0);
        this._south = new RootTile("se", this, 0, 0, 0, 0);

        this._hGutterInit(topPercent);
        this._resize();
    }

    _resize() {
        this._northSize();
        this._southSize();
    }

    _northSize() {
        this._north.x = this._margins.left;
        this._north.y = this._margins.top;
        this._north.w = this.w - this._margins.left - this._margins.right;
        this._north.h = this._hGutter.y0 - this.y0;
    }

    _southSize() {
        this._south.x = this._margins.left;
        this._south.y = this._hGutter.y1;
        this._south.w = this.w - this._margins.left - this._margins.right;
        this._south.h = this.h - this._margins.bottom - this._hGutter.y1 
    }

    _hGutterInit(topPercent: number) {
        let x0 = this._margins.left;
        let y0 = this.h * topPercent - this._gutter / 2;
        this._hGutter.Rect(x0, y0, this.w - this._margins.left - this._margins.right, this._gutter);
    }

    _hoverGutter(gutter: Rect, pfEvent: PlayfieldEvent): boolean {
        return between(gutter.x0, pfEvent.x - this.X, gutter.x1) && between(gutter.y0, pfEvent.y - this.Y, gutter.y1);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use HSplitter.north or HSplitter.south");
    }

    _drawChild(child: RootTile) {
        this.gfx.clipRect(child.x + 1, child.y + 1, child.w - 2, child.h - 2);
        child.redraw();
        this.gfx.restore();
    }

    _drawGutter(gutterRect: Rect, hover: boolean) {
        this.gfx.gparms.borderColor = "";
        let oldColor = this.gfx.gparms.fillColor;
        if (hover) {
            this.gfx.gparms.fillColor = "black";
            this.gfx.rect(gutterRect.x0, gutterRect.y0, gutterRect.w - 1, gutterRect.h - 1);
        } else {
            this.gfx.gparms.fillColor = "black";
            if (gutterRect.w > gutterRect.h) {
                // horizontal
                this.gfx.line(gutterRect.x0, gutterRect.y0 + gutterRect.h / 2, gutterRect.x0 + gutterRect.w, gutterRect.y0 + gutterRect.h / 2);
            } else {
                // vertical
                this.gfx.line(gutterRect.x0 + gutterRect.w / 2, gutterRect.y0, gutterRect.x0 + gutterRect.w / 2, gutterRect.y0 + gutterRect.h);
            }
        }
        this.gfx.gparms.fillColor = oldColor;
        this.gfx.gparms.borderColor = "black";

    }

    // --- Overrides --- //

    override relResize(dw: number, dh: number) {
        console.log("relResize", this.name)
        this._northSize();
        this._southSize();
    }

    override draw() {

        this._drawGutter(this._hGutter, this._hGutterHover);

        this.gfx.gparms.borderColor = "black";
        this._drawChild(this.north);
        this._drawChild(this.south);
    }

    // --- onActions --- //

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (this._hGutterHover) {
            this.isDragging = true;
            pfEvent.isActive = false;    
            return true;
        }
        return false;
    }

    override onRelResize(dw: number, dh: number, pfEvent: PlayfieldEvent) {
        let thisTile = Tile.cast(this);
        console.log("relResize", thisTile.fullName)
        if (dw) {
            this._hGutter.rsize(dw, 0);
        }
        if (dh) {
            this._south.onRelResize(0, dh, pfEvent);
        }
    }

    override onDrop(pfEvent: PlayfieldEvent) {
        this._hGutterHover = false;
        super.onDrop(pfEvent);
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._hGutterHover) {
            this._hGutter.rmove(0, dy);
            this._north.onRelResize(0, dy, pfEvent);
            this._south.rmove(0, dy);
            this._south.onRelResize(0, -dy, pfEvent);
            pfEvent.isActive = false;
        }
    }

    override onEvent(pfEvent: PlayfieldEvent) {
        pfEvent.isActive = true;
        this.dispatchEventToChild(pfEvent, this, false);
        this.dispatchEventToChildren(pfEvent);
    }

    override onHovering(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        this._hGutterHover = this._hoverGutter(this._hGutter, pfEvent);
    }

    onExit(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        super.onExit(pfEvent);
    }

    // --- Accessors --- //

    public get north(): RootTile {
        return this._north;
    }
    public set north(value: RootTile) {
        this._north = value;
    }
    public get south(): RootTile {
        return this._south;
    }
    public set south(value: RootTile) {
        this._south = value;
    }
}