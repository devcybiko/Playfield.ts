import { PlayfieldEvent } from "../PlayfieldEvent";

export interface Hoverable { }
export class Hoverable {
    private _isHovering: boolean;
    private _isHoverable: boolean;

    Hoverable() {
        this.isHovering = false;
        this.isHoverable = true;
        return this;
    }

    // --- onActions --- //
    
    onHovering(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    onEnter(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    onExit(pfEvent: PlayfieldEvent): boolean {
        return false;
    }

    // --- Accessors --- //

    public get isHovering() {
        return this._isHovering;
    }
    public set isHovering(value: boolean) {
        this._isHovering = value;
    }
    public get isHoverable() {
        return this._isHoverable;
    }
    public set isHoverable(value: boolean) {
        this._isHoverable = value;
    }

}
