import { PlayfieldEvent } from "../PlayfieldEvent"

/**
 * can be clicked - but not released
 */
export interface Clickable { }
export class Clickable {
    protected _isClickable: boolean;

    Clickable() {
        this.isClickable = true;
    }

    // --- onActions --- //
    
    onClick(pfEvent: PlayfieldEvent): void {
    }
    onMenu(pfEvent: PlayfieldEvent): void {
    }

    // --- Accessors --- //

    public get isClickable(): boolean {
        return this._isClickable;
    }
    public set isClickable(value: boolean) {
        this._isClickable = value;
    }

}
