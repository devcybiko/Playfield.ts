import { PlayfieldEvent } from "../PlayfieldEvents";

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

    onKey(key: string, pfEvent: PlayfieldEvent): boolean {
        return true;
    }
    onArrowLeft(pfEvent: PlayfieldEvent): boolean {
        return true;
    }
    onArrowRight(pfEvent: PlayfieldEvent): boolean {
        return true;
    }
    onBackspace(pfEvent: PlayfieldEvent): boolean {
        return true;
    }
    private onBackSpace(pfEvent: PlayfieldEvent): boolean {
        // this is the wrong method
        // you should be using onBackspace(), above
        // this is purposely mispelled with upper-case "S"
        // to force a compile-time error
        // if you attempt to override it.
        return true;
    }

    onFocus(): boolean {
        return true;
    }

    onUnfocus(): boolean {
        return true;
    }

}
