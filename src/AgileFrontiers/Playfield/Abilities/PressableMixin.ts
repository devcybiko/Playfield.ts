import { PlayfieldEvent } from "../PlayfieldEvent";

/**
 * Pressable - can be pressed and released
 */
export interface Pressable { }
export class Pressable {
    protected _isPressable: boolean;
    protected _isPressed: boolean;

    Pressable() {
        this.isPressable = true;
        this.isPressed = false;
        return this;
    }

    // --- onActions --- //
    
    onPress(pfEvent: PlayfieldEvent): void {
    }
    onRelease(pfEvent: PlayfieldEvent): void {
    }

    // --- Accessors --- //

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

}
