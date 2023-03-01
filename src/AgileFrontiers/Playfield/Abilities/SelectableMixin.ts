export interface Selectable { }
export class Selectable {
    _isSelected: boolean;
    Selectable() {
        return this;
    }

    onSelect(): boolean {
        return true;
    }

    onUnselect(): boolean {
        return true;
    }
    get isSelected(): boolean {
        return this._isSelected;
    }
}
