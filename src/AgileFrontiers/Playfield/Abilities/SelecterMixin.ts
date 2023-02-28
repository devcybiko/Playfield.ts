import { Selectable } from "./SelectableMixin";
import { MyEvent } from "../Events";

export interface Selecter { };
export class Selecter {
    _selectedObj: Selectable;

    Selecter() {
        return this;
    }

    _selectChild(child: Selectable, myEvent: MyEvent): boolean {
        this._unselectChild( myEvent);
        this._selectedObj = child;
        child._isSelected = true;
        child.onSelected(myEvent);
        return true;
    }

    _unselectChild(myEvent: MyEvent): boolean {
        if (this._selectedObj) {
            this._selectedObj._isSelected = false;
            this._selectedObj.onUnselected(myEvent);
            return true;
        }
        return false;
    }
}