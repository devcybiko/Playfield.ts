export interface Clickable { }
export class Clickable {
    private _isClickable: boolean;

    Clickable() {
        this.isClickable = true;
        return this;
    }

    public get isClickable(): boolean {
        return this._isClickable;
    }
    public set isClickable(value: boolean) {
        this._isClickable = value;
    }

    onClick(event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onClick", that.name);
        return true;
    }
}
