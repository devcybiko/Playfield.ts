import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { EventDispatcher, Dragger, Selecter, Clicker, Presser, Editor, Hoverer } from "./Abilities";
import { Draggable, Hoverable } from "./Abilities";
import { applyMixins, Rect, Margins, Ratio, Tree, int, between } from "./Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";
import { GfxParms } from "./Graphics";

export class _Slider extends Tile { };
export interface _Slider extends Draggable, Hoverable { };
applyMixins(_Slider, [Draggable, Hoverable]);

export class Slider extends _Slider {

    _value: number;
    _cursorSize = 20;
    _margins = new Margins();
    _cursor = new Rect();
    _limit = new Rect();
    _isVertical: boolean;
    _ratio = new Ratio();

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, isVertical = false, min = 0, max = 100, value = 0) {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Hoverable();
        this._cursor.Rect(0, 0, 0, 0);
        this._margins.Margins(4, 4, 4, 4); // top, right, bottom, left
        this._isVertical = isVertical;
        this._limit.RectXY(this._margins.left, this._margins.top, this.w - this._cursorSize - this._margins.right, this.h - this._cursorSize - this._margins.bottom);

        let c = this._cursor;
        if (this._isVertical) {
            c.x = this._margins.left;
            c.h = this._cursorSize;
            c.w = this.w - this._margins.left - this._margins.right;    
            this._ratio.Ratio(min, max, value, this._limit.y0, this._limit.y1);
        } else {
            c.y = this._margins.top;
            c.w = this._cursorSize;
            c.h = this.h - this._margins.top - this._margins.bottom;    
            this._ratio.Ratio(min, max, value, this._limit.x0, this._limit.x1);
        }
        this.value = value;
        this._updateCursor();
    }

    set value(v: number) {
        this._value = v;
        console.log(this._ratio);
        this._ratio.value = v;
        this._updateCursor();
    }

    _updateValue() {
        if (this._isVertical) this._ratio.index = this._cursor.y;
        else this._ratio.index = this._cursor.x;
        this._value = this._ratio.value;
    }

    _updateCursor() {
        if (this._isVertical) this._cursor.y = this._ratio.index;
        else this._cursor.x = this._ratio.index;
        console.log(this._cursor);
    }

    draw() {
        let c = this._cursor;
        this.gfx.clipRect(this.x, this.y, this.w, this.h);
        let oldColor = this.gfx.gparms.fillColor;
        this.gfx.gparms.fillColor = "white";
        this.gfx.rect(this.x, this.y, this.w, this.h);
        if (this.isDragging) {
            this.gfx.gparms.fillColor = "red";
        } else if (this.isHovering) {
            this.gfx.gparms.fillColor = "#c88";
        }else {
            this.gfx.gparms.fillColor = oldColor;
        }
        this.gfx.gparms.textBaseline = GfxParms.MIDDLE;
        this.gfx.gparms.textAlign = GfxParms.CENTER;
        this.gfx.gparms.fontSize = 12;
        this.gfx.textRect("" + int(this._value), this.x + c.x, this.y + c.y, c.w, c.h);
        this.gfx.restore();
        this.gfx.gparms.fillColor = oldColor;
    }

    onChange(value: number) {
        console.log(value);
    }

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        let c = this._cursor;
        if (between(c.x, dx, c.x + c.w) && between(c.y, dy, c.y + c.h)) {
            super.onGrab(dx, dy, pfEvent);
            return true;
        }
        return false;
    }

    forceRange(min: number, value: number, max: number) {
        if (value < min) value = min;
        if (value > max) value = max;
        return value;
    }

    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
        let c = this._cursor;
        let limit = this._limit;
        let oldValue = this._value;
        if (this._isVertical) c.y = this.forceRange(limit.y0, c.y + dy, limit.y1);
        else c.x = this.forceRange(limit.x0, c.x + dx, limit.x1);
        this._updateValue();
        pfEvent.isActive = false;
        if (this._value !== oldValue) this.onChange(this._value);
    }
    onDrop(pfEvent: PlayfieldEvent): void {
        super.onDrop(pfEvent);
    }
}