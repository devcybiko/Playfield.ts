import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Editable, Focusable } from "../Playfield/Abilities";

export class _TextItem extends Item { };
export interface _TextItem extends Draggable, Editable, Focusable { };
applyMixins(_TextItem, [Draggable, Editable, Focusable]);

export class TextItem extends _TextItem {
    _cursor = 0;
    _left = 0;
    _right = 0;
    _cursorOn = true;
    _timerId: any;
    _cursorBlinkRate = 500;
    _nchars = 0;
    _nchars2 = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Selectable();
        this.Editable();
        this.Focusable();
        this.Logger();
        this.gparms.fontFace = "monospace";
        this._nchars = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w);
        this._nchars2 = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w / 2);
        this._left = 0;
        this._right = this.computeRight();
        this._setIntervalTimer();
    }
    _setIntervalTimer() {
        this._cursorOn = true;
        if (this._timerId) clearInterval(this._timerId);
        this._timerId = setInterval(this.blink.bind(this), this._cursorBlinkRate);
    }
    blink() {
        this._cursorOn = !this._cursorOn;
    }
    drawCursor() {
        if (!this.isFocused) return;
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
    draw() {
        let gfx = this._playfield.gfx;
        if (this.isFocused) this.gparms.color = "red";
        else this.gparms.color = "black";
        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        let value = this.value.substring(this._left)
        if (this.isFocused) value = value.replaceAll(" ", '\uA788'); // \u00B7
        gfx.textRect(value, this.x, this.y, this.w, this.h, this.gparms);
        this.drawCursor();
        gfx.restore();
    }
    computeRight() {
        // let gfx = this._playfield.gfx;
        // let right = this._left;
        // for(let i=this._left; i<=this._value.length; i++) {
        //     let bb = gfx.boundingBox(this._value.substring(this._left, i));
        //     right = i;
        //     if (bb.w > this.w) break;
        // }
        let right = this._left + this._nchars2 * 2;
        if (right >= this._value.length) right = this._value.length - 1;
        return right;
    }
    computeLeft() {
        // let gfx = this._playfield.gfx;
        // let left = this._right;
        // for(let i=this._right; i>=0; i--) {
        //     let bb = gfx.boundingBox(this._value.substring(i, this._right));
        //     if (bb.w > this.w) break;
        //     left = i;
        // }
        let left = this._right - this._nchars2 * 2 + 1;
        if (left < 0) left = 0;
        return left;
    }
    cursorInc(delta: number) {
        this._cursor += delta;
        this._setIntervalTimer();
        this._cursorOn = true;
        if (this._cursor < 0) this._cursor = 0;
        if (this._cursor > this._value.length) this._cursor = this._value.length;
        this._left = this._cursor - this._nchars2;
        if (this._left < 0) this._left = 0;
        this._right = this._left + this._nchars;
        if (this._right > this._value.length) this._right = this._value.length;
        if (this._right === this._value.length) this._left = Math.max(this._right - this._nchars + 1, 0);
        this.log(this._left, this._cursor, this._right, this._nchars, this._nchars2);
    }
    onArrowLeft(): boolean {
        this.cursorInc(-1);
        return true;
    }
    onArrowRight(): boolean {
        this.cursorInc(+1);
        return true;
    }
    onBackspace(): boolean {
        if (this._cursor > 0) {
            let c = this._cursor;
            let left = this._value.substring(0, c - 1);
            let right = this._value.substring(c);
            this.value = left + right;
            this.cursorInc(-1);
            this.log(left, right, this._cursor, this._value);
            return true;
        }
        return false;
    }
    onKey(key: string): boolean {
        let c = this._cursor;
        this.value = this._value.substring(0, c) + key + this._value.substring(c);
        this.cursorInc(+1);
        return true;
    }
}