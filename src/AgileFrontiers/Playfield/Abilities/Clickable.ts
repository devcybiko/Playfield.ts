import { PlayfieldEvent } from "../PlayfieldEvent"
import { Tile } from "../Tile";

/**
 * can be clicked - but not released
 */
export interface Clickable { }
export class Clickable {
    protected _isClickableInitialized: boolean;
    public _asTile: Tile;

    Clickable() {
        this._isClickableInitialized = true;
    }

    // --- onActions --- //
    
    onClick(pfEvent: PlayfieldEvent): void {
    }
    onMenu(pfEvent: PlayfieldEvent): void {
    }
}
