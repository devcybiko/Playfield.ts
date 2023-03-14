import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Resizable, Draggable, Hoverable } from "./Abilities";
import { applyMixins, Logger, Margins, Rect, int, between, round } from "../Utils";
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
    protected _gutter: number;
    protected _margins: Margins;
    protected _hGutter: Rect;
    protected _vGutter: Rect;
    protected _hGutterHover: boolean;
    protected _vGutterHover: boolean;
    protected _topPercent: number;
    protected _leftPercent: number;

    constructor(name: string, parent: Tile, topPercent = 0.5, leftPercent = 0.5) {
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
        this._margins = new Margins().Margins(2, 2, 2, 2);
        this._gutter = 7;
        this._topPercent = topPercent;
        this._leftPercent = leftPercent;
    }

    _initOnFirstCall() {
        if (!this._ne) {
            this._hGutterHover = false;
            this._vGutterHover = false;
            this._hGutterInit(this._topPercent);
            this._vGutterInit(this._leftPercent);
                this._ne = new RootTile("ne", this, 0, 0, 0, 0);
            this._nw = new RootTile("nw", this, 0, 0, 0, 0);
            this._se = new RootTile("se", this, 0, 0, 0, 0);
            this._sw = new RootTile("sw", this, 0, 0, 0, 0);
            this._resize();
        }
    }
    _resize() {
        this._neSize();
        this._seSize();
        this._nwSize();
        this._swSize();
    }

    _neSize() {
        this._ne.x0 = this._margins.left;
        this._ne.y0 = this._margins.top;
        this._ne.x1 = this._vGutter.x0 - 1;
        this._ne.y1 = this._hGutter.y0 - 1;
    }

    _seSize() {
        this._se.x0 = this._margins.left;
        this._se.y0 = this._hGutter.y1 + 1;
        this._se.x1 = this._vGutter.x0 - 1;
        this._se.y1 = this.y1 - this._margins.bottom;
    }
    _nwSize() {
        this._nw.x0 = this._vGutter.x1 + 1;
        this._nw.y0 = this._margins.top;
        this._nw.x1 = this.x1 - this._margins.right;
        this._nw.y1 = this._hGutter.y0 - 1;
    }

    _swSize() {
        this._sw.x0 = this._vGutter.x1 + 1;
        this._sw.y0 = this._hGutter.y1 + 1;
        this._sw.x1 = this.x1 - this._margins.right;
        this._sw.y1 = this.y1 - this._margins.bottom;
    }

    _vGutterInit(leftPercent: number) {
        let x0 = int(this.w * leftPercent) - int(this._gutter / 2);
        let y0 = this._margins.top;
        this._vGutter = (new Rect()).Rect(x0, y0, this._gutter, this.h - this._margins.top - this._margins.bottom);
    }

    _hGutterInit(topPercent: number) {
        let x0 = 0;
        let y0 = int(this.h * topPercent) - int(this._gutter / 2);
        this._hGutter = (new Rect()).Rect(x0, y0, this.w, this._gutter);
    }

    _hoverGutter(gutter: Rect, pfEvent: PlayfieldEvent): boolean {
        if (!gutter) return;
        return between(gutter.x0, pfEvent.x - this.X, gutter.x1) && between(gutter.y0, pfEvent.y - this.Y, gutter.y1);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 4) super.addChild(child);
        else throw new Error("You must use Splitter.north or Splitter.south");
    }

    _drawChild(child: RootTile) {
        child.redraw();
    }

    _drawGutter(gutterRect: Rect, hover: boolean) {
        let gparms = this.gfx.gparms.clone();
        gparms.borderColor = "";
        if (hover) {
            gparms.fillColor = "black";
            this.gfx.rect(gutterRect.x0, gutterRect.y0, gutterRect.w, gutterRect.h, gparms);
        } else {
            gparms.fillColor = "";
            gparms.borderColor = "green";
            if (gutterRect.w > gutterRect.h) {
                // horizontal
                this.gfx.line(gutterRect.x0, gutterRect.y0 + int(gutterRect.h / 2), gutterRect.x0 + gutterRect.w, int(gutterRect.y0 + gutterRect.h / 2), gparms);
            } else {
                // vertical
                this.gfx.line(gutterRect.x0 + int(gutterRect.w / 2), gutterRect.y0, gutterRect.x0 + (gutterRect.w / 2), gutterRect.y0 + gutterRect.h, gparms);
            }
        }
    }

    // --- Overrides --- //

    override relResize(dw: number, dh: number) {
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
        this._initOnFirstCall();
        return this._ne;
    }
    public set ne(value: RootTile) {
        this._ne = value;
    }
    public get nw(): RootTile {
        this._initOnFirstCall();
        return this._nw;
    }
    public set nw(value: RootTile) {
        this._nw = value;
    }
    public get se(): RootTile {
        this._initOnFirstCall();
        return this._se;
    }
    public set se(value: RootTile) {
        this._se = value;
    }
    public get sw(): RootTile {
        this._initOnFirstCall();
        return this._sw;
    }
    public set sw(value: RootTile) {
        this._sw = value;
    }
}