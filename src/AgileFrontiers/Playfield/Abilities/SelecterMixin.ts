import { Selectable } from "./SelectableMixin";
import { MouseEvent } from "../Events";

export interface Selecter { };
export class Selecter {
    _selectedObj: Selectable;

    Selecter() {
        this._selectedObj = null;
        return this;
    }

    _selectChild(child: Selectable, mouseEvent: MouseEvent): boolean {
        this._unselectChild( mouseEvent);
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect();
        return true;
    }

    _unselectChild(mouseEvent: MouseEvent): boolean {
        if (this._selectedObj) {
            this._selectedObj.isSelected = false;
            this._selectedObj.onUnselect();
            return true;
        }
        return false;
    }
}