import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * Pressable - can be pressed and released
 */
export interface Pressable { }
export class Pressable {
    public _isPressableInitialized: boolean;
    protected _isPressed: boolean;
    public _asTile: Tile;

    Pressable() {
        this._isPressableInitialized = true;
        this.isPressed = false;
        return this;
    }

    // --- onActions --- //
    
    onPress(pfEvent: PlayfieldEvent): void {
    }
    onRelease(pfEvent: PlayfieldEvent): void {
        pfEvent.isActive = false;
    }

    // --- Accessors --- //

    public get isPressed(): boolean {
        return this._isPressed;
    }
    public set isPressed(value: boolean) {
        this._isPressed = value;
    }
}
