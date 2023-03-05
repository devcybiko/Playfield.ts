import { Selectable } from "./SelectableMixin";
import { PlayfieldEvent } from "../PlayfieldEvents";

export interface Selecter { };
export class Selecter {
    _selectedObj: Selectable;

    Selecter() {
        this._selectedObj = null;
        return this;
    }

    _selectChild(child: Selectable, pfEvent: PlayfieldEvent): boolean {
        this._unselectChild( pfEvent);
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect();
        return true;
    }

    _unselectChild(pfEvent: PlayfieldEvent): boolean {
        if (this._selectedObj) {
            this._selectedObj.isSelected = false;
            this._selectedObj.onUnselect();
            return true;
        }
        return false;
    }
}