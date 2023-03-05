import { Editable } from "./EditableMixin";
import { Tree } from "../Utils";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Editor { };
export class Editor {
    private _focusObj: Editable;

    Editor() {
        this._focusObj = null;
        return this;
    }

    editorEvent(pfEvent: PlayfieldEvent, child: Editable) {
        if (pfEvent.type === "mousedown") return this._focusChild(pfEvent, child);
        else if (pfEvent.type === "keydown") return this._dispatchKey(pfEvent, child);
    }

    _focusChild(pfEvent: PlayfieldEvent, child: Editable): boolean {
        let tileChild = child as unknown as Tile;
        if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
            this._unfocusChild(pfEvent, child);
            this._focusObj = child;
            child.isFocus = true;
            child.onFocus();
            return true;
        }
    }

    _unfocusChild(pfEvent: PlayfieldEvent, child: Editable): boolean {
        if (this._focusObj) {
            this._focusObj.isFocus = false;
            this._focusObj.onUnfocus();
            this._focusObj = null;
            return true;
        }
        return false;
    }

    _dispatchKey(pfEvent: PlayfieldEvent, child: Editable): boolean {
        if (child.isFocus) {
            if (pfEvent.key.length === 1) child.onKey(pfEvent.key, pfEvent);
            else if (pfEvent.key === "ArrowLeft") child.onArrowLeft(pfEvent);
            else if (pfEvent.key === "ArrowRight") child.onArrowRight(pfEvent);
            else if (pfEvent.key === "Backspace") child.onBackspace(pfEvent);
            else if (pfEvent.key === "Tab" && !pfEvent.isShift) this._nextChild(1, pfEvent);
            else if (pfEvent.key === "Tab" && pfEvent.isShift) this._nextChild(-1, pfEvent);
            return true;
        }
        return false;
    }

    _nextChild(direction: number, pfEvent: PlayfieldEvent): boolean {
        if (!this._focusObj) return true;
        let focusObj = this._focusObj as unknown as Tree;
        let children = focusObj.parent.children.sort((a: any, b: any) => direction * (a._tabOrder - b._tabOrder));
        let i = children.indexOf(focusObj);
        if (i === -1) throw new Error("Focus Object Not Found");
        let safety = children.length;
        for (let j = i + 1; children[j] !== focusObj; j += 1) {
            if (j >= children.length) j = 0;
            let sibling = children[j] as unknown as Editable;
            if (sibling.isFocusable) return this._focusChild(pfEvent, sibling);
            if (safety-- <= 0) break;
        }
        return false;
    }

    // -- Accessors --- //

    get focusObj(): Editable {
        return this._focusObj;
    }

}