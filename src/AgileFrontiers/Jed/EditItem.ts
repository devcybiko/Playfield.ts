import {Playfield, Actor} from "../Playfield";
import * as Utils from "../Utils";

import {Item} from "./Item";
import {EditItemEventHandler} from "./EditItemEventHandler";

export class EditItem extends Item {
    public cursor = 0;
    public left = 0;
    public right = 0;
    public cursorOn = true;
    public timerId: any;
    public cursorBlinkRate = 500;
    public nchars = 0;
    public nchars2 = 0;

    constructor(parent: Playfield | Actor, name: string, value: string, x: number, y: number, w = 100, h = 24) {
        super(parent, name, value, x, y, w, h);
        this.gparms.fontFace = "monospace";
        this.eventHandler = new EditItemEventHandler(this);
        this.nchars = Math.ceil(this.w() / this.playfield.gfx.boundingBox("m", this.gparms).w);
        this.nchars2 = Math.ceil(this.w() / this.playfield.gfx.boundingBox("m", this.gparms).w / 2);
        this.left = 0;
        this.right = this.computeRight();
        this._setIntervalTimer();
        this.logger = new Utils.Logger("EditItem", "none");
    }
    _setIntervalTimer() {
        this.cursorOn = true;
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = setInterval(this.blink.bind(this), this.cursorBlinkRate);
    }
    blink() {
        this.cursorOn = !this.cursorOn;
    }
    click(x: number, y: number) {
        this.playfield.focusObj(this);
    }
    drawCursor() {
        if (!this.hasFocus) return;
        if (!this.cursorOn) return;
        let gfx = this.playfield.gfx;
        let valueBB = gfx.boundingBox(this.value().substring(this.left, this.cursor), this.gparms);
        let dw = valueBB.w;
        if (dw <= 0) dw = 1;
        else if (dw >= this.w()) dw = this.w() - 1;
        let x0 = this.x() + dw;
        if (x0 <= this.x()) x0 = this.x() + 1;
        let x1 = x0;
        let y0 = this.y();
        let y1 = y0 + valueBB.h;
        gfx.line(x0, y0, x1, y1, this.gparms);
        gfx.line(x0 + 1, y0, x1 + 2, y1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        if (this.hasFocus) this.gparms.color = "red";
        else this.gparms.color = "black";
        gfx.clipRect(this.x(), this.y(), this.w(), this.h(), this.gparms)
        gfx.textRect(this.value().substring(this.left), this.x(), this.y(), this.w(), this.h(), this.gparms);
        this.drawCursor();
        gfx.restore();
    }
    computeRight() {
        // let gfx = this.playfield.gfx;
        // let right = this.left;
        // for(let i=this.left; i<=this._value.length; i++) {
        //     let bb = gfx.boundingBox(this._value.substring(this.left, i));
        //     right = i;
        //     if (bb.w > this.w()) break;
        // }
        let right = this.left + this.nchars2 * 2;
        if (right >= this._value.length) right = this._value.length - 1;
        return right;
    }
    computeLeft() {
        // let gfx = this.playfield.gfx;
        // let left = this.right;
        // for(let i=this.right; i>=0; i--) {
        //     let bb = gfx.boundingBox(this._value.substring(i, this.right));
        //     if (bb.w > this.w()) break;
        //     left = i;
        // }
        let left = this.right - this.nchars2 * 2 + 1;
        if (left < 0) left = 0;
        return left;
    }
    cursorInc(delta: number) {
        this.cursor += delta;
        this._setIntervalTimer();
        this.cursorOn = true;
        if (this.cursor < 0) this.cursor = 0;
        if (this.cursor > this._value.length) this.cursor = this._value.length;
        this.left = this.cursor - this.nchars2;
        if (this.left < 0) this.left = 0;
        this.right = this.left + this.nchars;
        if (this.right > this._value.length) this.right = this._value.length;
        if (this.right === this._value.length) this.left = Math.max(this.right - this.nchars + 1, 0);
        this.logger.log(this.left, this.cursor, this.right, this.nchars, this.nchars2);
    }
}
