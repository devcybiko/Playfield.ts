export interface Editable { }
export class Editable {
    private _isEditable: boolean;
    private _isFocused: boolean;
    private _isFocusable: boolean;

    Editable() {
        this.isEditable = true;
        this.isFocused = false;
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
    public get isFocused(): boolean {
        return this._isFocused;
    }
    public set isFocused(value: boolean) {
        this._isFocused = value;
    }

    onKey(key: string, event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onKey", that.name);
        return true;
    }
    onArrowLeft(event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onArrowLeft", that.name);
        return true;
    }
    onArrowRight(event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onArrowRight", that.name);
        return true;
    }
    onBackspace(event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onBackspace", that.name);
        return true;
    }
    onBackSpace(event?: any): boolean {
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
