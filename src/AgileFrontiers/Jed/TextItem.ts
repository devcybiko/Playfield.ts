import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Editable, Timer } from "../Playfield/Abilities";

export class _TextItem extends Item { };
export interface _TextItem extends Draggable, Editable, Timer { };
applyMixins(_TextItem, [Draggable, Editable, Timer]);

export class TextItem extends _TextItem {
    private _cursor = 0;
    private _left = 0;
    private _right = 0;
    private _cursorOn = true;
    private _cursorBlinkRate = 500;
    private _nchars = 0;
    private _nchars2 = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Editable();
        this.Logger();
        this.Timer(this._cursorBlinkRate);
        this.options.fontFace = "monospace";
        this.options.fontSize = h;
        this._updateGparms();
        this._nchars = Math.ceil(this.w / this.playfield.gfx.boundingBox("m").w);
        this._nchars2 = Math.ceil(this.w / this.playfield.gfx.boundingBox("m").w / 2);
        this._left = 0;
        this._right = this._computeRight();
        
    }

    // --- Overrides --- //

    draw() {
        this._blink();
        let gfx = this.gfx;
        this._updateGparms();
        if (this.isFocus) this.gfx.gparms.color = this.options.selectColor;
        else this.gfx.gparms.color = this.options.textColor;
        gfx.clipRect(this.x, this.y, this.w, this.h);
        let value = this.value.substring(this._left)
        if (this.isFocus) value = value.replaceAll(" ", '\uA788'); // \u00B7
        gfx.textRect(value, this.x, this.y, this.w, this.h);
        this._drawCursor();
        gfx.restore();
    }

    // --- onActions --- //

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
        if (!this.isTimedOut) return;
        this._cursorOn = !this._cursorOn;
        this.startTimer(this._cursorBlinkRate);
    }

    _startCursorBlinking() {
        this._cursorOn = true;
        this.startTimer(this._cursorBlinkRate);
    }
    _stopCursorBlinking() {
        this._cursorOn = false;
    }

    _drawCursor() {
        if (!this.isFocus) return;
        if (!this._cursorOn) return;
        let gfx = this.gfx;
        let valueBB = gfx.boundingBox(this.value.substring(this._left, this._cursor));
        let dw = valueBB.w;
        if (dw <= 0) dw = 1;
        else if (dw >= this.w) dw = this.w - 1;
        let x0 = this.x + dw;
        if (x0 <= this.x) x0 = this.x + 1;
        let x1 = x0;
        let y0 = this.y;
        let y1 = y0 + valueBB.h;
        gfx.line(x0, y0, x1, y1);
        gfx.line(x0 + 1, y0, x1 + 1, y1);
    }

    _computeRight() {
        // let gfx = this.playfield.gfx;
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
        // let gfx = this.playfield.gfx;
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