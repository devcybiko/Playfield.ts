export interface Selectable { }
export class Selectable {
    _isSelected: boolean;
    Selectable() {
        return this;
    }

    onSelected(event?: any): boolean {
        let that = this as any;
        this._isSelected = true;
        return true;
    }

    onUnselected(event?: any): boolean {
        let that = this as any;
        this._isSelected = false;
        return true;
    }
    get isSelected(): boolean {
        return this._isSelected;
    }
}
