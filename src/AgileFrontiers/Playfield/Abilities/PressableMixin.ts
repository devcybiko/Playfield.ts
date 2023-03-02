export interface Pressable { }
export class Pressable {
    private _isPressed: boolean;
    private _isPressable: boolean;

    Pressable() {
        this.isPressed = false;
        this.isPressable = true;
        return this;
    }

    public get isPressed(): boolean {
        return this._isPressed;
    }
    public set isPressed(value: boolean) {
        this._isPressed = value;
    }
    public get isPressable(): boolean {
        return this._isPressable;
    }
    public set isPressable(value: boolean) {
        this._isPressable = value;
    }

    onPress(event?: any): boolean {
        let that = this as any;
        this._isPressed = true;
        if (that.log) that.log("onPressDown", that.name);
        return true;
    }
    onRelease(event?: any): boolean {
        let that = this as any;
        this._isPressed = false;
        if (that.log) that.log("onPressUp", that.name);
        return true;
    }

}
