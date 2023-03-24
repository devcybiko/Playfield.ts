import { PlayfieldEvent } from "../PlayfieldEvent";
import {Tile} from "../Tile";

/**
 * can be Selected (mutually exclusively with other Selectables)
 */
export interface Selectable { }
export class Selectable {
    protected _isSelectable: boolean;
    protected _isSelected: boolean;

    Selectable() {
        this._isSelectable = true;
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

    public get isSelectable(): boolean {
        return this._isSelectable;
    }
    public set isSelectable(value: boolean) {
        this._isSelectable = value;
    }
}
