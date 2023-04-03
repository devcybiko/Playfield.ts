import { PlayfieldEvent } from "../PlayfieldEvent";
import {Tile} from "../Tile";

/**
 * can be Selected (mutually exclusively with other Selectables)
 */
export interface Selectable { }
export class Selectable {
    protected _isSelectableInitialized: boolean;
    protected _isSelected: boolean;
    public _asTile: Tile;

    Selectable() {
        this._isSelectableInitialized = true;
        this._isSelected = false;
        return this;
    }

    // --- static methods --- //
    static cast(obj: any): Selectable {
        return obj as Selectable;
    }

    // --- onActions --- //
    onSelect(pfEvent: PlayfieldEvent): void {
    }

    onUnselect(pfEvent: PlayfieldEvent): void {
    }

    // --- Accessors --- //
    
    public get isSelected(): boolean {
        return this._isSelected;
    }
    public set isSelected(value: boolean) {
        this._isSelected = value;
    }
}
