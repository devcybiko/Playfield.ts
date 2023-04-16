import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { Dimensions, applyMixins } from "../Utils";
import { Draggable, Editable, Timer } from "../Playfield/Abilities";

export class _Text extends Item { };
export interface _Text extends Draggable, Editable, Timer { };
applyMixins(_Text, [Draggable, Editable, Timer]);

export class Text extends _Text {
    protected _cursor = 0;
    protected _left = 0;
    protected _right = 0;
    protected _cursorOn = true;
    protected _cursorBlinkRate = 500;
    protected _nchars = 0;
    protected _nchars2 = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value, label);
        this._type += ".Text";
        this.options.fontFace = "monospace";
        this.options.fontSize = h;
        this.updateGparms();
        this._nchars = Math.ceil(this.w / this.gfx.boundingBox("m").w);
        this._nchars2 = Math.ceil(this.w / this.gfx.boundingBox("m").w / 2);
        this._left = 0;
        this._right = this._computeRight();
    }

    // --- Overrides --- //

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        this._blink();
        let gfx = this.gfx;
        if (this.isFocus) this.gfx.gparms.color = this.options.selectColor;
        else this.gfx.gparms.color = this.options.textColor;

        gfx.clipRect(this.X, this.Y, this.W, this.H);
        let value = this.value.substring(this._left)
        if (this.isFocus) value = value.replaceAll(" ", '\uA788'); // \u00B7
        gfx.rect(this.X, this.Y, this.W, this.H);
        gfx.text(value, this.X, this.Y, this.W, this.H);
        // gfx.textRect(value, this.X, this.Y, this.W, this.H);
        this._drawCursor();
        gfx.restore();
        return this.dimensions;
    }

    // --- onActions --- //

    override onArrowLeft(): void {
        this._cursorInc(-1);
    }
    override onArrowRight(): void {
        this._cursorInc(+1);
    }
    override onEOL(): void {
        this._cursor = this.value.length;
    }
    override onBOL(): void {
        this._cursor = 0;
    }
    override onDelete(): void {
        if (this._cursor === this.value.length) return;
        this.onArrowRight();
        this.onBackspace();
    }
    override onBackspace(): void {
        if (this._cursor > 0) {
            let c = this._cursor;
            let left = this.value.substring(0, c - 1);
            let right = this.value.substring(c);
            this.value = left + right;
            this._cursorInc(-1);
            this.log(left, right, this._cursor, this.value);
        }
    }
    override onKey(key: string): void {
        let c = this._cursor;
        this.value = this.value.substring(0, c) + key + this.value.substring(c);
        this._cursorInc(+1);
    }
    override onFocus(pfEvent: PlayfieldEvent): void {
        super.onFocus(pfEvent);
        this._startCursorBlinking();
        pfEvent.isActive = false;
    }
    override  onUnfocus(): void {
        this._stopCursorBlinking();
    }

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        this.onFocus(pfEvent);
        return super.onGrab(dx, dy, pfEvent);
    }
    // --- protected Methods --- //

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
        let charBB = gfx.boundingBox("M");
        let dw = valueBB.w;
        if (dw <= 0) dw = 1;
        else if (dw >= this.w) dw = this.w - 1;
        let x0 = this.x + dw;
        if (x0 <= this.x) x0 = this.x + 1;
        let x1 = x0;
        let y0 = this.y;
        let y1 = y0 + valueBB.h;
        // gfx.gparms.fillColor = "";
        gfx.rect(x0-1, y0+1, 3, charBB.h-2);
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