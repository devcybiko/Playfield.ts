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
    public get isHoverable() {
        return this._isHoverable;
    }
    public set isHoverable(value: boolean) {
        this._isHoverable = value;
    }

}
