import { Selectable } from "./SelectableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * a child can be the "selected" child under the parent
 * only one child may be selected at a time
 * selecting a new child must unselect the currently selected child
 * issue: how do we unselect a child when the "background" parent tile is selected
 */
export interface Selecter { };
export class Selecter {
    private _selectedObj: Selectable;

    Selecter() {
        this._selectedObj = null;
        return this;
    }

    // --- Public Methods --- //

    selectEvent(pfEvent: PlayfieldEvent, child: Selectable) {
        let treeChild = child as unknown as Tile;
        if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
            if (pfEvent.isPress && this._selectedObj != child) this._selectChild(pfEvent, child);
        } 
    }

    // --- Private Methods --- //

    _selectChild(pfEvent: PlayfieldEvent, child: Selectable): boolean {
        this._unselectChild(pfEvent, child);
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect();
        return true;
    }

    _unselectChild(pfEvent: PlayfieldEvent, child: Selectable): boolean {
        if (this._selectedObj) {
            this._selectedObj.isSelected = false;
            this._selectedObj.onUnselect();
            this._selectedObj = null;
            return true;
        }
        return false;
    }

    // --- Accessors --- //

    get selectedObj(): Selectable {
        return this._selectedObj;
    }
}