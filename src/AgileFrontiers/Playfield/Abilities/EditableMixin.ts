export interface Editable { }
export class Editable {
    _isEditable: boolean;

    Editable() {
        this._isEditable = true;
        return this;
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
}
