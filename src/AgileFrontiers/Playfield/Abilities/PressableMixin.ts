import { PlayfieldEvent } from "../PlayfieldEvents";

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

    onPress(pfEvent: PlayfieldEvent): boolean {
        this._isPressed = true;
        return true;
    }
    onRelease(pfEvent: PlayfieldEvent): boolean {
        this._isPressed = false;
        return true;
    }

}
