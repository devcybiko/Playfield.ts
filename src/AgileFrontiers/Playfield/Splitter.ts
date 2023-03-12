import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Resizable, Draggable, Hoverable } from "./Abilities";
import { applyMixins, Logger, Margins, Rect, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _Splitter extends Tile { };
export interface _Splitter extends Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer { };
applyMixins(_Splitter, [Resizable, Hoverable, Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editor, Hoverer]);

export class Splitter extends _Splitter {

    private _ne: RootTile;
    private _nw: RootTile;
    private _se: RootTile;
    private _sw: RootTile;
    private _gutter = 6;
    private _margins = new Margins();
    private _hGutter = new Rect();
    private _vGutter = new Rect();
    private _hGutterHover = false;
    private _vGutterHover = false;

    constructor(name: string, parent: Tile, topPercent= 0.5, leftPercent = 0.5) {
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

        this._ne = new RootTile("ne", this, 0, 0, 0, 0);
        this._nw = new RootTile("nw", this, 0, 0, 0, 0);
        this._se = new RootTile("se", this, 0, 0, 0, 0);
        this._sw = new RootTile("sw", this, 0, 0, 0, 0);

        this._hGutterInit(topPercent);
        this._vGutterInit(leftPercent);
        this._resize();
    }

    _resize() {
        this._neSize();
        this._seSize();
        this._nwSize();
        this._swSize();
    }

    _neSize() {
        this._ne.x = this._margins.left;
        this._ne.y = this._vGutter.y0;
        this._ne.w = this._vGutter.x0 - this.x0;
        this._ne.h = this._hGutter.y0 - this.y0;
    }

    _seSize() {
        this._se.x = this._margins.left;
        this._se.y = this._hGutter.y1;
        this._se.w = this._vGutter.x0 - this.x0;
        this._se.h = this._vGutter.x1 - this._margins.bottom;
    }
    _nwSize() {
        this._nw.x = this._vGutter.x1;
        this._nw.y = this._margins.top;
        this._nw.w = this.w - this._vGutter.x0 - this._margins.right;
        this._nw.h = this._hGutter.y0 - this.y0;
    }

    _swSize() {
        this._sw.x = this._vGutter.x1;
        this._sw.y = this._hGutter.y1;
        this._sw.w = this.w - this._vGutter.x0 - this._margins.right;
        this._sw.h = this.h - this._hGutter.y1 - this._margins.bottom;
    }

    _vGutterInit(leftPercent: number) {
        let x0 = this.w * leftPercent- this._gutter / 2;
        let y0 = this._margins.top;
        this._vGutter.Rect(x0, y0, this._gutter, this.h - this._margins.top - this._margins.bottom);
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
        if (this.children.length < 4) super.addChild(child);
        else throw new Error("You must use Splitter.north or Splitter.south");
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
        this._neSize();
        this._seSize();
        this._nwSize();
        this._swSize();
    }

    override draw() {

        this._drawGutter(this._hGutter, this._hGutterHover);
        this._drawGutter(this._vGutter, this._vGutterHover);

        this.gfx.gparms.borderColor = "black";
        this._drawChild(this.ne);
        this._drawChild(this.se);
        this._drawChild(this.nw);
        this._drawChild(this.sw);
    }

    // --- onActions --- //

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (this._hGutterHover || this._vGutterHover) {
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
            this._nw.onRelResize(dw, 0, pfEvent);
        }
        if (dh) {
            this._vGutter.rsize(0, dh);
            this._se.onRelResize(0, dh, pfEvent);
        }
        if (dw || dh) {
            this._sw.onRelResize(dw, dh, pfEvent);
        }
    }

    override onDrop(pfEvent: PlayfieldEvent) {
        this._hGutterHover = false;
        this._vGutterHover = false;
        super.onDrop(pfEvent);
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        console.log(this._hGutterHover, this._vGutterHover);
        if (this._hGutterHover) {
            this._hGutter.rmove(0, dy);
            this._ne.onRelResize(0, dy, pfEvent);
            this._nw.onRelResize(0, dy, pfEvent);
            this._se.rmove(0, dy);
            this._se.onRelResize(0, -dy, pfEvent);
            this._sw.rmove(0, dy);
            this._sw.onRelResize(0, -dy, pfEvent);
            pfEvent.isActive = false;
        }
        if (this._vGutterHover) {
            this._vGutter.rmove(dx, 0);
            this._ne.onRelResize(dx, 0, pfEvent);
            this._se.onRelResize(dx, 0, pfEvent);
            this._nw.rmove(dx, 0);
            this._nw.onRelResize(-dx, 0, pfEvent);
            this._sw.rmove(dx, 0);
            this._sw.onRelResize(-dx, 0, pfEvent);
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
        this._vGutterHover = this._hoverGutter(this._vGutter, pfEvent);
    }

    onExit(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        super.onExit(pfEvent);
    }

    // --- Accessors --- //

    public get ne(): RootTile {
        return this._ne;
    }
    public set ne(value: RootTile) {
        this._ne = value;
    }
    public get nw(): RootTile {
        return this._nw;
    }
    public set nw(value: RootTile) {
        this._nw = value;
    }
    public get se(): RootTile {
        return this._se;
    }
    public set se(value: RootTile) {
        this._se = value;
    }
    public get sw(): RootTile {
        return this._sw;
    }
    public set sw(value: RootTile) {
        this._sw = value;
    }
}