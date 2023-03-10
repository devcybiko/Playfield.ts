export interface Selectable { }
export class Selectable {
    private _isSelected: boolean;
    private _isSelectable: boolean;

    Selectable() {
        this._isSelected = false;
        this._isSelectable = true;
        return this;
    }

    // --- onActions --- //
    
    onSelect() {
    }

    onUnselect() {
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
