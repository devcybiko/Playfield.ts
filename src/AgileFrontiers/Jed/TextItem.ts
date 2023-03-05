import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Editable, Repeatable } from "../Playfield/Abilities";

export class _TextItem extends Item { };
export interface _TextItem extends Draggable, Editable, Repeatable { };
applyMixins(_TextItem, [Draggable, Editable, Repeatable]);

export class TextItem extends _TextItem {
    _cursor = 0;
    _left = 0;
    _right = 0;
    _cursorOn = true;
    _cursorBlinkRate = 500;
    _nchars = 0;
    _nchars2 = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Editable();
        this.Logger();
        this.Repeatable(this._cursorBlinkRate);
        this.options.fontFace = "monospace";
        this.options.fontSize = h;
        this._updateGparms();
        this._nchars = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w);
        this._nchars2 = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w / 2);
        this._left = 0;
        this._right = this._computeRight();
    }

    // --- Overrides --- //

    draw() {
        let gfx = this._playfield.gfx;
        this._updateGparms();
        if (this.isFocus) this.gparms.color = this.options.selectColor;
        else this.gparms.color = this.options.textColor;
        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        let value = this.value.substring(this._left)
        if (this.isFocus) value = value.replaceAll(" ", '\uA788'); // \u00B7
        gfx.textRect(value, this.x, this.y, this.w, this.h, this.gparms);
        this._drawCursor();
        gfx.restore();
    }

    // --- onActions --- //

    onRepeat(): boolean {
        this._blink();
        return true;
    }
    onArrowLeft(): boolean {
        this._cursorInc(-1);
        return true;
    }
    onArrowRight(): boolean {
        this._cursorInc(+1);
        return true;
    }
    onBackspace(): boolean {
        if (this._cursor > 0) {
            let c = this._cursor;
            let left = this.value.substring(0, c - 1);
            let right = this.value.substring(c);
            this.value = left + right;
            this._cursorInc(-1);
            this.log(left, right, this._cursor, this.value);
            return true;
        }
        return false;
    }
    onKey(key: string): boolean {
        let c = this._cursor;
        this.value = this.value.substring(0, c) + key + this.value.substring(c);
        this._cursorInc(+1);
        return true;
    }
    onFocus(): boolean {
        super.onFocus();
        this.toFront();
        this._startCursorBlinking();
        return true;
    }
    onUnfocus(): boolean {
        this._stopCursorBlinking();
        return true;
    }

    // --- Private Methods --- //

    _blink() {
        this._cursorOn = !this._cursorOn;
    }

    _startCursorBlinking() {
        this._cursorOn = true;
        this.startRepeat(this._cursorBlinkRate);
    }
    _stopCursorBlinking() {
        this._cursorOn = false;
        this.stopRepeat();
    }

    _drawCursor() {
        if (!this.isFocus) return;
        if (!this._cursorOn) return;
        let gfx = this._playfield.gfx;
        let valueBB = gfx.boundingBox(this.value.substring(this._left, this._cursor), this.gparms);
        let dw = valueBB.w;
        if (dw <= 0) dw = 1;
        else if (dw >= this.w) dw = this.w - 1;
        let x0 = this.x + dw;
        if (x0 <= this.x) x0 = this.x + 1;
        let x1 = x0;
        let y0 = this.y;
        let y1 = y0 + valueBB.h;
        gfx.line(x0, y0, x1, y1, this.gparms);
        gfx.line(x0 + 1, y0, x1 + 2, y1, this.gparms);
    }

    _computeRight() {
        // let gfx = this._playfield.gfx;
        // let right = this._left;
        // for(let i=this._left; i<=this.value.length; i++) {
        //     let bb = gfx.boundingBox(this.value.substring(this._left, i));
        //     right = i;
        //     if (bb.w > this.w) break;
        // }
        let right = this._left + this._nchars2 * 2;
        if (right >= this.value.length) right = this.value.length - 1;
        return right;
    }
    _computeLeft() {
        // let gfx = this._playfield.gfx;
        // let left = this._right;
        // for(let i=this._right; i>=0; i--) {
        //     let bb = gfx.boundingBox(this.value.substring(i, this._right));
        //     if (bb.w > this.w) break;
        //     left = i;
        // }
        let left = this._right - this._nchars2 * 2 + 1;
        if (left < 0) left = 0;
        return left;
    }
    _cursorInc(delta: number) {
        this._cursor += delta;
        this._startCursorBlinking();
        this._cursorOn = true;
        if (this._cursor < 0) this._cursor = 0;
        if (this._cursor > this.value.length) this._cursor = this.value.length;
        this._left = this._cursor - this._nchars2;
        if (this._left < 0) this._left = 0;
        this._right = this._left + this._nchars;
        if (this._right > this.value.length) this._right = this.value.length;
        if (this._right === this.value.length) this._left = Math.max(this._right - this._nchars + 1, 0);
        this.log(this._left, this._cursor, this._right, this._nchars, this._nchars2);
    }
}