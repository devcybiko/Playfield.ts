import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Dragger, Selecter, Clicker, Presser, Editor, Editable, Hoverer } from "./Abilities";
import { Mouseable, Keyboardable, KeyEvent, MouseEvent } from "./Events";
import { applyMixins, Logger } from "../Utils";

/**
 * The RootTile has some special capabilities
 */

export class _RootTile extends Tile { };
export interface _RootTile extends Keyboardable, Mouseable, Clicker, Presser, Selecter, Dragger, Logger, Editor, Hoverer{ };
applyMixins(_RootTile, [Keyboardable, Mouseable, Clicker, Selecter, Presser, Dragger, Logger, Editor, Hoverer]);

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
    MouseMove(mouseEvent: MouseEvent): boolean {
        let processed = false;
        processed = this._dragChild(mouseEvent) || processed;
        this.info(mouseEvent);
        let that = (this as any);
        let children = that.children.reverse();
        this.info(children);
        for (let _child of children) {
            let child = _child as any;
            if (child.inBounds && child.inBounds(mouseEvent.x, mouseEvent.y)) {
                if (child.isHoverable) this._hoverChild(child, mouseEvent) || processed;
            } else {
                if (child.isHoverable) this._hoverExitChild(child, mouseEvent) || processed;
            }
        }
        return processed;
    }
    MouseDown(mouseEvent: MouseEvent): boolean {
        this.warn(mouseEvent);
        let that = (this as any);
        let children = that.children.reverse();
        this.warn(children);
        let processed = false;
        for (let _child of children) {
            let child = _child as any;
            if (child.inBounds && child.inBounds(mouseEvent.x, mouseEvent.y)) {
                if (child.isDraggable) processed = this._grabChild(child, mouseEvent) || processed;
                if (child.isSelectable) processed = this._selectChild(child, mouseEvent) || processed;
                if (child.isClickable) processed = this._clickChild(child, mouseEvent) || processed;
                if (child.isPressable) processed = this._pressDownChild(child, mouseEvent) || processed;
                if (child.isFocusable) processed = this._focusChild(child, mouseEvent) || processed;
            }
        }
        return processed;
    }
    MouseUp(mouseEvent: MouseEvent): boolean {
        this._dropChild(mouseEvent);
        this.warn(mouseEvent);
        let that = (this as any);
        let children = that.children.reverse();
        this.warn(children);
        let processed = false;
        for (let _child of that.children.reverse()) {
            let child = _child as any;
            if (child.isPressed) processed = this._pressUpChild(child, mouseEvent) || processed;
        }
        return processed;
    }
    OrdinaryKey(keyEvent: KeyEvent): boolean {
        if (this.focusObj && this.focusObj.isEditable) {
            return (this.focusObj as unknown as Editable).onKey(keyEvent.key); // questionable
        }
        return false;
    }
    ArrowLeft(keyEvent: KeyEvent): boolean {
        if (this.focusObj && this.focusObj.isEditable) {
            return (this.focusObj as unknown as Editable).onArrowLeft(); // questionable
        }
        return false;
    }
    ArrowRight(keyEvent: KeyEvent): boolean {
        if (this.focusObj && this.focusObj.isEditable) {
            return (this.focusObj as unknown as Editable).onArrowRight(); // questionable
        }
        return false;
    }
    Backspace(keyEvent: KeyEvent): boolean {
        if (this.focusObj && this.focusObj.isEditable) {
            return (this.focusObj as unknown as Editable).onBackspace(); // questionable
        }
        return false;
    }
    TabKey(keyEvent: KeyEvent): boolean {
        console.log("TabKey");
        if (this.focusObj) {
            if (!keyEvent._isShift) return this._nextChild(+1, null);
            return this._nextChild(-1, null);
        }
        return false;
    }
}
