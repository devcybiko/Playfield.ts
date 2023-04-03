import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can be hovered over
 */
export interface Hoverable { }
export class Hoverable {
    protected _isHoverableInitialized: boolean;
    protected _isHovering: boolean;
    public _asTile: Tile;

    Hoverable() {
        this._isHoverableInitialized = true;
        this.isHovering = false;
        return this;
    }

    // --- onActions --- //

    private onHover(pfEvent: PlayfieldEvent): void {
        // this is the wrong method
        // you should be using onHovering(), above
        // this is purposely mispelled with upper-case "S"
        // to force a compile-time error
        // if you attempt to override it.
    }
    onHovering(pfEvent: PlayfieldEvent): void {
    }
    onEnter(pfEvent: PlayfieldEvent): void {
    }
    onExit(pfEvent: PlayfieldEvent): void {
    }

    // --- Accessors --- //

    public get isHovering() {
        return this._isHovering;
    }
    public set isHovering(value: boolean) {
        this._isHovering = value;
    }
}
