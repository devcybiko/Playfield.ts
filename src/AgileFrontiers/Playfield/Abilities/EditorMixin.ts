import { Editable } from "./EditableMixin";
import { Tree } from "../../Utils";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Editor { };
export class Editor {
    private _focusObj: Editable;

    Editor() {
        this._focusObj = null;
        return this;
    }

    // --- Public Methods --- //

    editorEvent(pfEvent: PlayfieldEvent, child: Editable) {
        if (pfEvent.isPress) return this._focusChild(pfEvent, child);
        else if (pfEvent.isKeyDown) return this._dispatchKey(pfEvent, child);
    }

    // --- Private Methods --- //
    
    _focusChild(pfEvent: PlayfieldEvent, child: Editable) {
        let tileChild = child as unknown as Tile;
        if (pfEvent.isKeyboardEvent || tileChild.inBounds(pfEvent.x, pfEvent.y)) {
            this._unfocusChildren(pfEvent, child);
            this._focusObj = child;
            child.isFocus = true;
            child.onFocus(pfEvent);
        }
    }

    _editorParent(): Editor {
        return (this as unknown as Tile).parent as unknown as Editor;
    }

    _unfocusChild(child: any, ctx: any) {
        // this is a function called by Tree.dfs()
        if (child._focusObj) {
            // we're PRETTY sure this is Editable...
            child._focusObj.isFocus = false;
            child._focusObj.onUnfocus();
        }
    }

    _unfocusChildren(pfEvent: PlayfieldEvent, child: Editable) {
        // we have to unfocus ALL the children in the tree
        // otherwise, the keyboard events go to all currently inFocus items
        let root = (this as unknown as Tree).root();
        root.dfs(this._unfocusChild);
    }

    _dispatchKey(pfEvent: PlayfieldEvent, child: Editable) {
        if (child.isFocus) {
            if (pfEvent.key.length === 1) child.onKey(pfEvent.key, pfEvent);
            else if (pfEvent.key === "ArrowLeft") child.onArrowLeft(pfEvent);
            else if (pfEvent.key === "ArrowRight") child.onArrowRight(pfEvent);
            else if (pfEvent.key === "Backspace") child.onBackspace(pfEvent);
            else if (pfEvent.key === "Tab" && !pfEvent.isShift) this._nextChild(1, pfEvent);
            else if (pfEvent.key === "Tab" && pfEvent.isShift) this._nextChild(-1, pfEvent);
        }
    }

    _nextChild(direction: number, pfEvent: PlayfieldEvent) {
        if (!this._focusObj) return;
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
    }

    // -- Accessors --- //

    get focusObj(): Editable {
        return this._focusObj;
    }

}