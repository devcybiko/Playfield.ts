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
        // GLS - doing a check of all children is questionable
        // GLS - I thought each individual object passed events to children via OnEvent()
        let tileChild = child as unknown as Tile;
        if (pfEvent.isPress) {
            let foundChild = tileChild.inBoundsChildren(pfEvent.x, pfEvent.y, pfEvent) as any;
            if (foundChild && foundChild._isSelectableInitialized) this._selectChild(pfEvent, foundChild);
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