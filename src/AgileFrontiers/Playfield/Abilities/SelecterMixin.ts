import { Selectable } from "./SelectableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * controls all Selectables
 * 
 * a child can be the "selected" child under the parent
 * only one child may be selected at a time
 * selecting a new child must unselect the currently selected child
 * issue: how do we unselect a child when the "background" parent tile is selected
 */
export interface Selecter { };
export class Selecter {
    protected isSelecter: boolean;
    protected _selectedObj: Selectable;

    Selecter() {
        this.isSelecter = true;
        this._selectedObj = null;
        return this;
    }

    // --- Public Methods --- //

    selectEvent(pfEvent: PlayfieldEvent, child: Selectable) {
        let tileChild = Tile.cast(child);
        let selectedObj = Selectable.cast(this._selectedObj);
        if (pfEvent.isPress) {
            let foundChild = Selectable.cast(tileChild.inBoundsChildren(pfEvent.x, pfEvent.y));
            if (foundChild && foundChild.isSelectable) this._selectChild(pfEvent, foundChild);
        }
    }

    // --- Private Methods --- //

    _selectChild(pfEvent: PlayfieldEvent, child: Selectable) {
        this._unselectChild(pfEvent, child);
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect();
    }

    _unselectChild(pfEvent: PlayfieldEvent, child: Selectable) {
        if (this._selectedObj) {
            this._selectedObj.isSelected = false;
            this._selectedObj.onUnselect();
            this._selectedObj = null;
        }
    }

    // --- Accessors --- //

    get selectedObj(): Selectable {
        return this._selectedObj;
    }
}