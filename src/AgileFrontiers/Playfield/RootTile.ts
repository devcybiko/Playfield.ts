import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Dragger, Selecter, Clicker, Focuser, Editable } from "./Abilities";
import { Mouseable, Keyboardable, KeyEvent, MouseEvent } from "./Events";
import { applyMixins, Logger } from "../Utils";

/**
 * The RootTile has some special capabilities
 */

export class _RootTile extends Tile { };
export interface _RootTile extends Keyboardable, Mouseable, Clicker, Selecter, Dragger, Logger, Focuser { };
applyMixins(_RootTile, [Keyboardable, Mouseable, Clicker, Selecter, Dragger, Logger, Focuser]);

export class RootTile extends _RootTile implements Mouseable, Keyboardable {
    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null as unknown as Tile, x, y, w, h, playfield);
        this.Dragger();
        this.Selecter();
        this.Logger();
    }
    draw() {
        this.redrawChildren();
    }
    MouseMove(mouseEvent: MouseEvent) :boolean {
        this._dragChild(mouseEvent);
        return true;
    }
    MouseDown(mouseEvent: MouseEvent): boolean {
        this.warn(mouseEvent);
        let that = (this as any);
        let children = that.children.reverse();
        this.warn(children);
        for (let _child of that.children.reverse()) {
            let child = _child as any;
            if (child.inBounds && child.inBounds(mouseEvent.x, mouseEvent.y)) {
                this.log("Found...", child);
                let processed = false;
                if (child.onGrab) processed = this._grabChild(child, mouseEvent) || processed;
                if (child.onSelected) processed = this._selectChild(child, mouseEvent) || processed;
                if (child.onClick) processed = this._clickChild(child, mouseEvent) || processed;
                if (child.onFocus) processed = this._focusChild(child, mouseEvent) || processed;
                if (processed) return true;
            }
        }
        return false;
    }
    MouseUp(mouseEvent:MouseEvent): boolean {
        this._dropChild(mouseEvent);
        return true;
    }
    OrdinaryKey(keyEvent: KeyEvent): boolean {
        if (this._focusedObj && this._focusedObj._isEditable) {
            return (this._focusedObj as unknown as Editable).onKey(keyEvent.key); // questionable
        }
        return false;
    }
    ArrowLeft(keyEvent: KeyEvent): boolean {
        if (this._focusedObj && this._focusedObj._isEditable) {
            return (this._focusedObj as unknown as Editable).onArrowLeft(); // questionable
        }
        return false;
    }
    ArrowRight(keyEvent: KeyEvent): boolean {
        if (this._focusedObj && this._focusedObj._isEditable) {
            return (this._focusedObj as unknown as Editable).onArrowRight(); // questionable
        }
        return false;
    }
    Backspace(keyEvent: KeyEvent): boolean {
        if (this._focusedObj && this._focusedObj._isEditable) {
            return (this._focusedObj as unknown as Editable).onBackspace(); // questionable
        }
        return false;
    }
}
