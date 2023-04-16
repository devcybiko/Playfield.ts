import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can be slided
 */
export interface Slideable { }
export class Slideable {
    public _isSlideableInitialized: boolean;
    protected _isSliding: boolean;
    public _asTile: Tile;

    Slideable() {
        this._isSlideableInitialized = true;
        this.isSliding = false;
        return this;
    }

    // --- onActions --- //

    onSlideStart(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        this.isSliding = true;
        pfEvent.isActive = false;
        return true;
    }
    
    onSlide(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
    }
    
    onSlideEnd(pfEvent: PlayfieldEvent): void {
        if (this.isSliding) {
            this.isSliding = false;
            pfEvent.isActive = false;
        }
    }

    // --- Accessors --- //

    public get isSliding(): boolean {
        return this._isSliding;
    }
    public set isSliding(value: boolean) {
        this._isSliding = value;
    }

}
