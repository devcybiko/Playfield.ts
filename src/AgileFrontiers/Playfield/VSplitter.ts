import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Resizable, Draggable, Hoverable } from "./Abilities";
import { applyMixins, Logger, Margins, Rect, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _VSplitter extends Tile { };
export interface _VSplitter extends Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_VSplitter, [Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class VSplitter extends _VSplitter {

    private _east: RootTile;
    private _west: RootTile;
    private _gutter = 6;
    private _margins = new Margins();
    private _vGutter = new Rect();
    private _vGutterHover = false;

    constructor(name: string, parent: Tile, leftPercent = 0.5) {
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

        this._east = new RootTile("east", this, 0, 0, 0, 0);
        this._west = new RootTile("west", this, 0, 0, 0, 0);

        this._vGutterInit(leftPercent);
        this._resize();
    }

    _resize() {
        this._eastSize();
        this._westSize();
    }

    _eastSize() {
        this._east.x = this._margins.left;
        this._east.y = this._vGutter.y0;
        this._east.w = this._vGutter.x0 - this.x0;
        this._east.h = this.h - this._margins.bottom;
    }

    _westSize() {
        this._west.x = this._vGutter.x1;
        this._west.y = this._margins.top;
        this._west.w = this.w - this._vGutter.x0 - this._margins.right;
        this._west.h = this.h - this._margins.bottom;
    }

    _vGutterInit(leftPercent: number) {
        let x0 = this.w * leftPercent - this._gutter / 2;
        let y0 = this._margins.top;
        this._vGutter.Rect(x0, y0, this._gutter, this.h - this._margins.top - this._margins.bottom);
    }

    _hoverGutter(gutter: Rect, pfEvent: PlayfieldEvent): boolean {
        return between(gutter.x0, pfEvent.x - this.X, gutter.x1) && between(gutter.y0, pfEvent.y - this.Y, gutter.y1);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use VSplitter.east or VSplitter.west");
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
        this._eastSize();
        this._westSize();
    }

    override draw() {

        this._drawGutter(this._vGutter, this._vGutterHover);

        this.gfx.gparms.borderColor = "black";
        this._drawChild(this.east);
        this._drawChild(this.west);
    }

    // --- onActions --- //

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (this._vGutterHover) {
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
            this._west.onRelResize(dw, 0, pfEvent);
        }
        if (dh) {
            this._vGutter.rsize(0, dh);
        }
    }

    override onDrop(pfEvent: PlayfieldEvent) {
        this._vGutterHover = false;
        super.onDrop(pfEvent);
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._vGutterHover) {
            this._vGutter.rmove(dx, 0);
            this._east.onRelResize(dx, 0, pfEvent);
            this._west.rmove(dx, 0);
            this._west.onRelResize(-dx, 0, pfEvent);
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
        this._vGutterHover = this._hoverGutter(this._vGutter, pfEvent);
    }

    onExit(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        super.onExit(pfEvent);
    }

    // --- Accessors --- //

    public get east(): RootTile {
        return this._east;
    }
    public set east(value: RootTile) {
        this._east = value;
    }
    public get west(): RootTile {
        return this._west;
    }
    public set west(value: RootTile) {
        this._west = value;
    }
}