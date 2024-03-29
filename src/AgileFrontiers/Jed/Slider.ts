import { Tile } from "../Playfield/Tile";
import { Draggable, Slideable, Swipeable, Hoverable } from "../Playfield/Abilities";
import { applyMixins, Rect, Margins, Ratio, Tree, int, between, limit, Dimensions } from "../Utils";
import { PlayfieldEvent } from "../Playfield/PlayfieldEvent";
import { GfxParms } from "../Playfield/Graphics";
import { Item } from "./Item";

export class _Slider extends Item { };
export interface _Slider extends Swipeable, Draggable, Slideable, Hoverable { };
applyMixins(_Slider, [Swipeable, Draggable, Slideable, Hoverable]);

function inormalize(r: number, multiplier: number) {
    if (r <= 1.0) return int(r * multiplier);
    return int(r);
}

export class Slider extends _Slider {

    protected _margins = new Margins();
    protected _cursor = new Rect();
    protected _rcursor = new Rect();
    protected _ratio = new Ratio();
    protected _vslide = true;
    protected _hslide = true;
    protected _text = "";
    protected _minW = 10;
    protected _minH = 10;
    protected _cursorBorderRadius = 10;
    private _isEnabled = true;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value, label);
        this._hslide = !this.label.includes("vert");
        this._vslide = !this.label.includes("horiz");
        this._type += ".Slider";
        this._margins.Margins(4, 4, 4, 4); // top, right, bottom, left
        this.cursorSize(0.5, 0.5);
        this.cursorMove(0.5, 0.5);
        this.options.textBaseline = GfxParms.MIDDLE;
        this.options.textAlign = GfxParms.CENTER;
    }

    onChange(rx: number, ry: number, pfEvent: PlayfieldEvent) {
    }

    cursorMove(rx?: number, ry?: number) {
        if (rx === undefined || ry === undefined) return { rx: this._rcursor.x, ry: this._rcursor.y };
        let x = inormalize(rx, this.dw) + this._margins.left;
        let y = inormalize(ry, this.dh) + this._margins.top;
        this._cursor.move(x, y);
        this._rcursor.move(rx, ry);
        return { rx: this._rcursor.x, ry: this._rcursor.y }
    }

    cursorSize(rw?: number, rh?: number) {
        if (rw === undefined || rh === undefined) return { rw: this._rcursor.w, rh: this._rcursor.h };
        let dw = this.W - this._margins.left - this._margins.right;
        let dh = this.H - this._margins.top - this._margins.bottom;
        let w = inormalize(rw, dw) || this._cursor.w; // preserve old width if rw == 0
        let h = inormalize(rh, dh) || this._cursor.h; // preserve old height if rh == 0
        w = Math.max(w, this._minW);
        h = Math.max(h, this._minH);
        this._cursor.size(w, h);
        // this.cursorMove(this._rcursor.x, this._rcursor.y);
        this._rcursor.size(rw || this._rcursor.w, rh || this._rcursor.h);
        return { rw: this._rcursor.w, rh: this._rcursor.h }
    }

    _drawContainer() {
        this.gfx.gparms.fillColor = this.options.containerColor;
        this.gfx.rect(this.X, this.Y, this.W, this.H);
    }

    _drawCursor() {
        let c = this._cursor;
        if (this._isEnabled && this.isDragging) {
            this.gfx.gparms.fillColor = this.options.selectColor;
        } else if (this._isEnabled && this.isHovering) {
            this.gfx.gparms.fillColor = this.options.hoverColor;
        } else {
            this.gfx.gparms.fillColor = this.options.backgroundColor;
        }
        if (this._vslide && !this._hslide) {
            this.gfx.gparms.textBaseline = GfxParms.MIDDLE;
            this.gfx.gparms.textAlign = GfxParms.CENTER;
        }
        this.gfx.gparms.borderRadius = this._cursorBorderRadius;
        this.gfx.textRect(this._text, this.X + c.x, this.Y + c.y, c.w, c.h);
    }

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        this._drawContainer();
        this._drawCursor();
        this.gfx.restore();
        return this.dimensions;
    }

    override onSlideStart(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        if (!this._isEnabled) return;
        let c = this._cursor;
        if (between(c.x, dx, c.x + c.w) && between(c.y, dy, c.y + c.h)) {
            return super.onSlideStart(dx, dy, pfEvent);
        } else { // click!
            let vPage = c.h / this.h;
            if (this._hslide && (dx < c.x)) this.onSlide(-c.w / 2, 0, pfEvent);
            else if (this._hslide && (dx > c.x)) this.onSlide(c.w / 2, 0, pfEvent);
            if (this._vslide && (dy < c.y)) this.onSlide(0, -c.h / 2, pfEvent);
            else if (this._vslide && (dy > c.y)) this.onSlide(0, c.h / 2, pfEvent);
        }
    }

    override onSlide(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
        if (!this._isEnabled) return;
        let c = this._cursor;
        let xmax = this.dw + this._margins.left;
        let ymax = this.dh + this._margins.top;
        if (this._hslide) c.x = limit(this._margins.left, c.x + dx, xmax);
        if (this._vslide) c.y = limit(this._margins.top, c.y + dy, ymax);
        this._rcursor.move(this.rx, this.ry);
        this.onChange(this.rx, this.ry, pfEvent);
        pfEvent.isActive = false;
    }

    override onSlideEnd(pfEvent: PlayfieldEvent): void {
        if (!this._isEnabled) return;
        super.onSlideEnd(pfEvent);
        this.go();
    }

    override onSwipe(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
        if (!this._isEnabled) return;
        this.onSlide(dx, dy, pfEvent);
    }

    // --- Accessors --- //

    get text(): string {
        return this._text;
    }

    set text(s: string) {
        this._text = s;
    }

    get dw(): number {
        return this.w - this._margins.left - this._margins.right - this._cursor.w;
    }

    get dh(): number {
        return this.h - this._margins.top - this._margins.bottom - this._cursor.h;
    }

    get rx(): number {
        if (this.dw === 0) return this._rcursor.x;
        return (this._cursor.x - this._margins.left) / this.dw;
    }

    get ry(): number {
        if (this.dh === 0) return this._rcursor.y;
        return (this._cursor.y - this._margins.top) / this.dh;
    }

    get margins(): Margins {
        return this._margins
    }

    set margins(margins: Margins) {
        this._margins = margins;
    }

    get cursor(): Rect {
        return this._cursor;
    }

    set cursor(cursor: Rect) {
        this._cursor = cursor;
    }

    get rcursor(): Rect {
        return this._rcursor;
    }

    set rcursor(rcursor: Rect) {
        this._rcursor = rcursor;
    }

    get hslide(): boolean {
        return this._hslide;
    }

    set hslide(value: boolean) {
        this._hslide = value;
    }

    get vslide(): boolean {
        return this._vslide;
    }

    set vslide(value: boolean) {
        this._vslide = value;
    }
    public get isEnabled() {
        return this._isEnabled;
    }
    public set isEnabled(value) {
        this._isEnabled = value;
    }

}