import { Tile } from "./Tile";
import { Dispatcher, Dragger, Selecter, Clicker, Presser, Editer, Hoverer } from "./Abilities";
import { Resizable, Draggable, Hoverable } from "./Abilities";
import { applyMixins, Logger, Margins, Rect, int, between, round, Dimensions } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";

export class _Splitter extends Tile { };
export interface _Splitter extends Resizable, Hoverable, Draggable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer { };
applyMixins(_Splitter, [Resizable, Hoverable, Draggable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer]);

export class Splitter extends _Splitter {

    protected _ne: RootTile;
    protected _nw: RootTile;
    protected _se: RootTile;
    protected _sw: RootTile;
    protected _hGutterSize: number;
    protected _vGutterSize: number;
    protected _margins: Margins;
    protected _hGutterRect: Rect;
    protected _vGutterRect: Rect;
    protected _isHGutterHovering: boolean;
    protected _isVGutterHovering: boolean;
    protected _topPercent: number;
    protected _leftPercent: number;

    constructor(name: string, parent: Tile, topPercent = 0.5, leftPercent = 0.5, hGutterSize = 15, vGutterSize = 15) {
        super(name, parent, 0, 0, parent.w, parent.h);
        this.Logger();
        this._margins = new Margins().Margins(2, 2, 2, 2);
        this._hGutterSize = hGutterSize;
        this._vGutterSize = vGutterSize;
        if (topPercent === 0 || topPercent === 1) this._hGutterSize = 0;
        if (leftPercent === 0 || leftPercent === 1) this._vGutterSize = 0;
        this._topPercent = topPercent;
        this._leftPercent = leftPercent;
        this._initOnFirstCall();
        this.isDraggable = true;
    }

    _initOnFirstCall() {
        if (!this._ne) {
            this._isHGutterHovering = false;
            this._isVGutterHovering = false;
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
        this._ne.x1 = this._vGutterRect.x - this._margins.right;
        this._ne.y1 = Math.max(0, this._hGutterRect.y - this._margins.bottom);
    }

    _seSize() {
        this._se.x0 = this._margins.left;
        this._se.y0 = this._hGutterRect.y + this._hGutterRect.h + 1;
        this._se.x1 = this._vGutterRect.x - this._margins.right;
        this._se.y1 = this.y1 - this._margins.bottom;
    }
    _nwSize() {
        this._nw.x0 = this._vGutterRect.x + this._vGutterRect.w + this._margins.right;
        this._nw.y0 = this._margins.top;
        this._nw.x1 = Math.max(0, this.x1 - this._margins.right);
        this._nw.y1 = Math.max(0, this._hGutterRect.y - this._margins.bottom);
    }

    _swSize() {
        this._sw.x0 = this._vGutterRect.x + this._vGutterRect.w + this._margins.right;
        this._sw.y0 = this._hGutterRect.y + this._hGutterRect.h + 1;
        this._sw.x1 = Math.max(0, this.x1 - this._margins.right);
        this._sw.y1 = Math.max(0, this.y1 - this._margins.bottom);
    }

    _vGutterInit(leftPercent: number) {
        if (this._vGutterSize === 0) {
            this._vGutterRect = (new Rect()).Rect(this.w * leftPercent, 0, 0, this.h);
        } else {
            let x0 = int(this.w * leftPercent) - int(this._hGutterSize / 2);
            let y0 = this._margins.top;
            this._vGutterRect = (new Rect()).Rect(x0, y0, this._vGutterSize, this.h - this._margins.top - this._margins.bottom);
        }
    }

    _hGutterInit(topPercent: number) {
        if (this._hGutterSize === 0) {
            this._hGutterRect = (new Rect().Rect(0, this.h * topPercent, this.w, 0));
        }
        let x0 = 0;
        let y0 = int(this.h * topPercent) - int(this._hGutterSize / 2);
        this._hGutterRect = (new Rect()).Rect(x0, y0, this.w, this._hGutterSize);
    }

    _hoverGutter(gutter: Rect, pfEvent: PlayfieldEvent): boolean {
        if (!gutter) return;
        return between(gutter.x, pfEvent.x - this.X, gutter.x + gutter.w) && between(gutter.y, pfEvent.y - this.Y, gutter.y + gutter.h);
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 4) super.addChild(child);
        else throw new Error("You must use Splitter.ne, Splitter.nw, Splitter.se or Splitter.sw");
    }

    _drawGutter(gutterRect: Rect, hover: boolean) {
        if (gutterRect.x < 0) return;
        if (gutterRect.y < 0) return;
        let gparms = this.gfx.gparms;
        gparms.borderColor = "";
        if (hover) {
            gparms.fillColor = "black";
            this.gfx.rect(this.X + gutterRect.x, this.Y + gutterRect.y, gutterRect.w, gutterRect.h);
        } else {
            gparms.fillColor = "";
            gparms.borderColor = "green";
            if (gutterRect.w > gutterRect.h) {
                // horizontal
                this.gfx.line(this.X + gutterRect.x, this.Y + gutterRect.y + int(gutterRect.h / 2), this.X + gutterRect.x + gutterRect.w, this.Y + int(gutterRect.y + gutterRect.h / 2));
            } else {
                // vertical
                this.gfx.line(this.X + gutterRect.x + int(gutterRect.w / 2), this.Y + gutterRect.y, this.X + gutterRect.x + (gutterRect.w / 2), this.Y + gutterRect.y + gutterRect.h);
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

    override draw(): Dimensions {

        this._drawGutter(this._hGutterRect, this._isHGutterHovering);
        this._drawGutter(this._vGutterRect, this._isVGutterHovering);

        this.gfx.gparms.borderColor = "black";
        this.gfx.gparms.fillColor = "";
        this.ne.draw();
        this.se.draw();
        this.nw.draw();
        this.sw.draw();
        return this.dimensions;
    }

    // --- onActions --- //

    override onRelResize(dw: number, dh: number, pfEvent: PlayfieldEvent) {
        let thisTile = Tile.cast(this);
        if (dw) {
            this._hGutterRect.rsize(dw, 0);
            this._nw.onRelResize(dw, 0, pfEvent);
        }
        if (dh) {
            this._vGutterRect.rsize(0, dh);
            this._se.onRelResize(0, dh, pfEvent);
        }
        if (dw || dh) {
            this._sw.onRelResize(dw, dh, pfEvent);
        }
    }

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        this.log("onGrab")
        if (this._isHGutterHovering || this._isVGutterHovering) {
            this.isDragging = true;
            pfEvent.isActive = false;
            return true;
        }
        return false;
    }

    override onDrop(pfEvent: PlayfieldEvent) {
        this.log("onDrop")
        this._isHGutterHovering = false;
        this._isVGutterHovering = false;
        super.onDrop(pfEvent);
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._isHGutterHovering) {
            this._hGutterRect.rmove(0, dy);
            this._ne.onRelResize(0, dy, pfEvent);
            this._nw.onRelResize(0, dy, pfEvent);
            this._se.rmove(0, dy);
            this._se.onRelResize(0, -dy, pfEvent);
            this._sw.rmove(0, dy);
            this._sw.onRelResize(0, -dy, pfEvent);
            pfEvent.isActive = false;
        }
        if (this._isVGutterHovering) {
            this._vGutterRect.rmove(dx, 0);
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
        this.dispatchEvent(pfEvent, this.parent);
        if (pfEvent.isActive) this.dispatchEventToChildren(pfEvent);
    }

    override onHovering(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        this._isHGutterHovering = this._hoverGutter(this._hGutterRect, pfEvent);
        this._isVGutterHovering = this._hoverGutter(this._vGutterRect, pfEvent);
    }

    override onExit(pfEvent: PlayfieldEvent) {
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