import { PlayfieldEvent } from "../PlayfieldEvent"

export interface Clickable { }
export class Clickable {
    private _isClickable: boolean;

    Clickable() {
        this.isClickable = true;
    }

    // --- onActions --- //
    
    onClick(pfEvent: PlayfieldEvent) {
    }

    // --- Accessors --- //

    public get isClickable(): boolean {
        return this._isClickable;
    }
    public set isClickable(value: boolean) {
        this._isClickable = value;
    }

}
