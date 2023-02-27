import {Playfield} from "./Playfield";
import {Tile} from "./Tile";
import {Dragger, hasDragger} from "./Dragger";
import {Mouseable} from "./Events/Mouseable";
import {Keyboardable} from "./Events/Keyboardable";

/**
 * The RootTile has some special capabilities
 */

export class RootTile extends Tile implements hasDragger, Mouseable, Keyboardable {
    _dragger: Dragger;

    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null, x, y, w, h, playfield);
        this._dragger = new Dragger(this);
    }
    KeyDown(event: any): boolean {
        return false;
    }
    KeyUp(event: any): boolean {
        return false;
    }
    OrdinaryKey(event: any): boolean {
        return false;
    }
    SpecialKey(event: any): boolean {
        return false;
    }
    Shift(event: any): boolean {
        return false;
    }
    Meta(event: any): boolean {
        return false;
    }
    MetaKey(event: any): boolean {
        return false;
    }
    Alt(event: any): boolean {
        return false;
    }
    AltKey(event: any): boolean {
        return false;
    }
    Control(event: any): boolean {
        return false;
    }
    ControlKey(event: any): boolean {
        return false;
    }
    Backspace(event: any): boolean {
        return false;
    }
    UpperCase(event: any): boolean {
        return false;
    }
    LowerCase(event: any): boolean {
        return false;
    }
    Digit(event: any): boolean {
        return false;
    }
    Punctuation(event: any): boolean {
        return false;
    }
    FunctionKey(event: any): boolean {
        return false;
    }
    ArrowUp(event: any): boolean {
        return false;
    }
    ArrowDown(event: any): boolean {
        return false;
    }
    ArrowLeft(event: any): boolean {
        return false;
    }
    ArrowRight(event: any): boolean {
        return false;
    }
    defaultKey(event: any): boolean {
        return false;
    }
    MouseUp(event: any): boolean {
        return this._dragger.MouseUp(event);
    }
    MouseDown(event: any): boolean {
        return this._dragger.MouseDown(event);
    }
    MenuUp(event: any): boolean {
        return false;
    }
    MenuDown(event: any): boolean {
        return false;
    }
    MiddleUp(event: any): boolean {
        return false;
    }
    MiddleDown(event: any): boolean {
        return false;
    }
    WheelUp(event: any, delta: number): boolean {
        return false;
    }
    WheelDown(event: any, delta: number): boolean {
        return false;
    }
    MouseMove(event: any): boolean {
        return this._dragger.MouseMove(event);
    }
    get dragger(): Dragger {
        return this._dragger;
    }
    draw() {
        this.redrawChildren();
    }
}
