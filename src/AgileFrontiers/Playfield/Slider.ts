import { Tile } from "./Tile";
import { Draggable, Hoverable } from "./Abilities";
import { applyMixins, Rect, Margins, Ratio, Tree, int, between, limit } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { GfxParms } from "./Graphics";

export class _Slider extends Tile { };
export interface _Slider extends Draggable, Hoverable { };
applyMixins(_Slider, [Draggable, Hoverable]);

function inormalize(r: number, multiplier: number) {
    if (r <= 1.0) return int(r * multiplier);
    return int(r);
}

export class Slider extends _Slider {

    _margins = new Margins();
    _cursor = new Rect();
    _rcursor = new Rect();
    _ratio = new Ratio();
    _vslide = true;
    _hslide = true;
    _text = "";
    _minW = 10;
    _minH = 10;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Hoverable();
        this._margins.Margins(4, 4, 4, 4); // top, right, bottom, left
        this.cursorSize(0.5, 0.5);
        this.cursorMove(0.5, 0.5);
        this.gfx.gparms.textBaseline = GfxParms.MIDDLE;
        this.gfx.gparms.textAlign = GfxParms.CENTER;
        this.gfx.gparms.fontSize = 12;
    }

    onChange(x: number, y: number, pfEvent: PlayfieldEvent) {
        console.log("OnChange", x, y);
    }

    cursorMove(rx: number, ry: number) {
        let x = inormalize(rx, this.dw) + this._margins.top;
        let y = inormalize(ry, this.dh) + this._margins.left;
        this._cursor.move(x, y);
        this._rcursor.move(rx, ry);
    }

    cursorSize(rw: number, rh: number) {
        let dw = this.w - this._margins.left - this._margins.right;
        let dh = this.h - this._margins.top - this._margins.bottom;
        let w = inormalize(rw, dw) || this._cursor.w; // preserve old width if rw == 0
        let h = inormalize(rh, dh) || this._cursor.h; // preserve old height if rh == 0
        w = Math.max(w, this._minW);
        h = Math.max(h, this._minH);
        this._cursor.size(w, h);
        this.cursorMove(this._rcursor.x, this._rcursor.y);
        this._rcursor.size(rw || this._rcursor.w, rh || this._rcursor.h);
    }

    draw() {
        let c = this._cursor;
        this.gfx.clipRect(this.x, this.y, this.w, this.h);
        this.gfx.gparms.fillColor = "#ccc";
        this.gfx.rect(this.x, this.y, this.w, this.h);
        if (this.isDragging) {
            this.gfx.gparms.fillColor = "red";
        } else if (this.isHovering) {
            this.gfx.gparms.fillColor = "#c88";
        } else {
            this.gfx.gparms.fillColor = "white";
        }
        this.gfx.textRect(this._text, this.x + c.x, this.y + c.y, c.w, c.h);
        this.gfx.restore();
    }

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        let c = this._cursor;
        if (between(c.x, dx, c.x + c.w) && between(c.y, dy, c.y + c.h)) {
            super.onGrab(dx, dy, pfEvent);
            return true;
        }
        return false;
    }

    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
        let c = this._cursor;
        let xmax = this.dw + this._margins.left;
        let ymax = this.dh + this._margins.top;
        if (this._hslide) c.x = limit(this._margins.left, c.x + dx, xmax);
        if (this._vslide) c.y = limit(this._margins.top, c.y + dy, ymax);
        this._rcursor.move(this.rx, this.ry);
        this.onChange(this.rx, this.ry, pfEvent);
        pfEvent.isActive = false;
    }

    onDrop(pfEvent: PlayfieldEvent): void {
        super.onDrop(pfEvent);
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

}