
import { KeyEvent } from "./KeyEvent";

export interface Keyboardable { }
export class Keyboardable {
    KeyDown(keyEvent: KeyEvent): boolean {
        return false;
    }
    KeyUp(keyEvent: KeyEvent): boolean {
        return false;
    }
    OrdinaryKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    SpecialKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    Shift(keyEvent: KeyEvent): boolean {
        return false;
    }
    Meta(keyEvent: KeyEvent): boolean {
        return false;
    }
    MetaKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    Alt(keyEvent: KeyEvent): boolean {
        return false;
    }
    AltKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    Control(keyEvent: KeyEvent): boolean {
        return false;
    }
    ControlKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    Backspace(keyEvent: KeyEvent): boolean {
        return false;
    }
    UpperCase(keyEvent: KeyEvent): boolean {
        return false;
    }
    LowerCase(keyEvent: KeyEvent): boolean {
        return false;
    }
    Digit(keyEvent: KeyEvent): boolean {
        return false;
    }
    Punctuation(keyEvent: KeyEvent): boolean {
        return false;
    }
    FunctionKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    ArrowUp(keyEvent: KeyEvent): boolean {
        return false;
    }
    ArrowDown(keyEvent: KeyEvent): boolean {
        return false;
    }
    ArrowLeft(keyEvent: KeyEvent): boolean {
        return false;
    }
    ArrowRight(keyEvent: KeyEvent): boolean {
        return false;
    }
    defaultKey(keyEvent: KeyEvent): boolean {
        return false;
    }
    private BackSpace(keyEvent: KeyEvent): boolean {
        // this is the wrong method
        // you should be using Backspace(), above
        // this is purposely mispelled with upper-case "S"
        // to force a compile-time error
        // if you attempt to override it.
        return false;
    }
}