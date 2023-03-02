import { Editable } from "./EditableMixin";
import { MouseEvent, KeyEvent } from "../Events";
import { Tree } from "../../Utils";

export interface Editor { };
export class Editor {
    private _focusObj: Editable;

    Editor() {
        this._focusObj = null;
        return this;
    }

    get focusObj(): Editable {
        return this._focusObj;
    }
    _focusChild(child: Editable, event: MouseEvent): boolean {
        this._unfocusChild(event);
        this._focusObj = child;
        child.isFocused = true;
        child.onFocus();
        return true;
    }

    _unfocusChild(event: MouseEvent): boolean {
        if (this._focusObj) {
            this._focusObj.isFocused = false;
            this._focusObj.onUnfocus();
            this._focusObj = null;
            return true;
        }
        return false;
    }
    _nextChild(direction: number, event: MouseEvent): boolean {
        if (!this._focusObj) return true;
        let focusObj = this._focusObj as unknown as Tree;
        let children = focusObj.parent.children.sort((a: any, b: any) => direction * (a._tabOrder - b._tabOrder));
        let i = children.indexOf(focusObj);
        if (i === -1)  throw new Error("Focus Object Not Found"); 
        let safety = children.length;
        for(let j=i+1; children[j] !== focusObj; j+=1) {
            if (j >= children.length) j = 0;
            let sibling = children[j] as unknown as Editable;
            if (sibling.isFocusable) return this._focusChild(sibling, event);
            if (safety-- <= 0) break;
        }
        return false;
    }
}