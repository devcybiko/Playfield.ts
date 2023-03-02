import { MouseEvent } from "../Events/MouseEvent";

export interface Hoverable { }
export class Hoverable {
    private _isHovering: boolean;
    private _isHoverable: boolean;

    Hoverable() {
        this.isHovering = false;
        this.isHoverable = true;
        return this;
    }

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

    onHovering(event?: MouseEvent): boolean {
        return true;
    }
    onEnter(event?: MouseEvent): boolean {
        return true;
    }
    onExit(event?: MouseEvent): boolean {
        return true;
    }
}
