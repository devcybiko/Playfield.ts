export interface Focusable { }
export class Focusable {
    _isFocused: boolean;
    _isEditable: boolean;

    Focusable(isEditable = true) {
        this._isEditable = isEditable;
        return this;
    }

    onFocus(): boolean {
        return true;
    }

    onUnfocus(): boolean {
        return true;
    }
    get isFocused(): boolean {
        return this._isFocused;
    }
}
