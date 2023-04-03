import { Editable } from "./Editable";
import { Tree } from "../../Utils";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Editable
 */
export interface EditController { };
export class EditController {
    protected _isEditControllerInitialized: boolean;
    protected _focusObj: Editable;
    public _asTile: Tile;

    EditController() {
        this._isEditControllerInitialized = true;
        this._focusObj = null;
        return this;
    }

    // --- Public Methods --- //

    editEvent(pfEvent: PlayfieldEvent, child: Editable) {
        console.log(this, pfEvent);
        if (pfEvent.isPress) return this._focusChild(pfEvent, child);
        else if (pfEvent.isKeyDown) return this._dispatchKey(pfEvent, child);
    }

    // --- Private Methods --- //
    
    _focusChild(pfEvent: PlayfieldEvent, child: Editable) {
        let tileChild = child as unknown as Tile;
        if (pfEvent.isKeyboardEvent || tileChild.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            this.unfocusAlLChildren(pfEvent, child);
            this._focusObj = child;
            child.isFocus = true;
            child.onFocus(pfEvent);
        }
    }

    _editerParent(): EditController {
        return (this as unknown as Tile).parent as unknown as EditController;
    }

    _unfocusChild(_child: Tree, pfEvent: PlayfieldEvent) {
        let child = _child as unknown as EditController;
        // this is a function called by Tree.dfs()
        if (child._isEditControllerInitialized) {
            if (child._focusObj) {
                child._focusObj.isFocus = false;
                child._focusObj.onUnfocus(pfEvent);
                child._focusObj = null;
            }
        }
    }

    unfocusAlLChildren(pfEvent: PlayfieldEvent, child: Editable) {
        // we have to unfocus ALL the children in the tree
        // otherwise, the keyboard events go to all currently inFocus items
        let root = this._asTile.root();
        root.dfs(this._unfocusChild, null, pfEvent);
    }

    _dispatchKey(pfEvent: PlayfieldEvent, child: Editable) {
        if (child.isFocus) {
            if (pfEvent.key.length === 1) child.onKey(pfEvent.key, pfEvent);
            else if (pfEvent.key === "ArrowLeft" && !pfEvent.isShift) child.onArrowLeft(pfEvent);
            else if (pfEvent.key === "ArrowRight" && !pfEvent.isShift) child.onArrowRight(pfEvent);
            else if (pfEvent.key === "ArrowLeft" && pfEvent.isShift) child.onBOL(pfEvent);
            else if (pfEvent.key === "ArrowRight" && pfEvent.isShift) child.onEOL(pfEvent);
            else if (pfEvent.key === "Backspace" && !pfEvent.isShift) child.onBackspace(pfEvent);
            else if (pfEvent.key === "Backspace" && pfEvent.isShift) child.onDelete(pfEvent);
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