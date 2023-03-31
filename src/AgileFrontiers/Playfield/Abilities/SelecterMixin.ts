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
        let tileChild = child as unknown as Tile;
        let selectedObj = this._selectedObj as unknown as Selectable;
        if (pfEvent.isPress) {
            let foundChild = tileChild.inBoundsChildren(pfEvent.x, pfEvent.y) as unknown as Selectable;
            if (foundChild && foundChild.isSelectable) this._selectChild(pfEvent, foundChild);
        }
    }

    selectChild(child: Selectable) {
        this._selectChild(null, child);
    }
    unselectChild(child: Selectable) {
        this._unselectChild(null, child);
    }
    // --- Private Methods --- //

    _selectChild(pfEvent: PlayfieldEvent | null, child: Selectable) {
        this._unselectChild(pfEvent, child);
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect(pfEvent);
    }

    _unselectChild(pfEvent: PlayfieldEvent | null, child: Selectable) {
        if (this._selectedObj) {
            this._selectedObj.isSelected = false;
            this._selectedObj.onUnselect(pfEvent);
            this._selectedObj = null;
        }
    }

    // --- Accessors --- //

    get selectedObj(): Selectable {
        return this._selectedObj;
    }
}