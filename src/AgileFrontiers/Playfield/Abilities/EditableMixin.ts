import { PlayfieldEvent } from "../PlayfieldEvent";

export interface Editable { }
export class Editable {
    private _isEditable: boolean;
    private _isFocus: boolean;
    private _isFocusable: boolean;

    Editable() {
        this.isEditable = true;
        this.isFocus = false;
        this.isFocusable = true;
        return this;
    }

    // --- onActons --- //

    onKey(key: string, pfEvent: PlayfieldEvent): void {
    }
    onArrowLeft(pfEvent: PlayfieldEvent): void {
    }
    onArrowRight(pfEvent: PlayfieldEvent): void {
    }
    onBackspace(pfEvent: PlayfieldEvent): void {
    }
    private onBackSpace(pfEvent: PlayfieldEvent): void {
        // this is the wrong method
        // you should be using onBackspace(), above
        // this is purposely mispelled with upper-case "S"
        // to force a compile-time error
        // if you attempt to override it.
    }
    onFocus(pfEvent: PlayfieldEvent): void {
    }
    onUnfocus(pfEvent: PlayfieldEvent): void {
    }

    // --- Accessors --- //

    public get isEditable(): boolean {
        return this._isEditable;
    }
    public set isEditable(value: boolean) {
        this._isEditable = value;
    }
    public get isFocusable(): boolean {
        return this._isFocusable;
    }
    public set isFocusable(value: boolean) {
        this._isFocusable = value;
    }
    public get isFocus(): boolean {
        return this._isFocus;
    }
    public set isFocus(value: boolean) {
        this._isFocus = value;
    }
}
