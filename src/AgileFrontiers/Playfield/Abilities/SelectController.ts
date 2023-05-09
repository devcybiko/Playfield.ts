import { Selectable } from "./Selectable";
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
export interface SelectController { };
export class SelectController {
    protected _isSelectController: boolean;
    protected _selectedObj: Selectable;
    public _asTile: Tile;

    SelectController() {
        this._isSelectController = true;
        this._selectedObj = null;
        return this;
    }

    // --- Public Methods --- //

    selectEvent(pfEvent: PlayfieldEvent, child: Selectable) {
        // child has been clicked on
        // now, unselect all the children and select the child
        if (pfEvent.isPress) {
            this._selectChild(pfEvent, child);        
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
        for(let _immediateChild of this._asTile.children) {
            let immediateChild = _immediateChild as unknown as Selectable;
            console.log("_unselectChild", this._asTile.fullName, _immediateChild.fullName, child.isSelected);
            if (immediateChild.isSelected) this._unselectChild(pfEvent, immediateChild);
        }
        this._selectedObj = child;
        child.isSelected = true;
        child.onSelect(pfEvent);
    }

    _unselectChild(pfEvent: PlayfieldEvent | null, child: Selectable) {
        if (this._selectedObj === child) this._selectedObj = null;
        child.isSelected = false;
        child.onUnselect(pfEvent);
    }

    // --- Accessors --- //

    get selectedObj(): Selectable {
        return this._selectedObj;
    }
}