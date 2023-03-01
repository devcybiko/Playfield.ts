import { Focusable } from "./FocusableMixin";
import { MouseEvent } from "../Events";

export interface Focuser { };
export class Focuser {
    _focusedObj: Focusable;

    Focuser() {
        return this;
    }

    _focusChild(child: Focusable, event: any): boolean {
        this._unfocusChild(event);
        this._focusedObj = child;
        child._isFocused = true;
        child.onFocus();
        return true;
    }

    _unfocusChild(event: any): boolean {
        if (this._focusedObj) {
            this._focusedObj._isFocused = false;
            this._focusedObj.onUnfocus();
            return true;
        }
        return false;
    }
}