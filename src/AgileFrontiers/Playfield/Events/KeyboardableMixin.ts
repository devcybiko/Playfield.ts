
import { MyEvent } from "./MyEvent";

export interface Keyboardable { }
export class Keyboardable {
    KeyDown(myEvent: MyEvent): boolean {
        return false;
    }
    KeyUp(myEvent: MyEvent): boolean {
        return false;
    }
    OrdinaryKey(myEvent: MyEvent): boolean {
        return false;
    }
    SpecialKey(myEvent: MyEvent): boolean {
        return false;
    }
    Shift(myEvent: MyEvent): boolean {
        return false;
    }
    Meta(myEvent: MyEvent): boolean {
        return false;
    }
    MetaKey(myEvent: MyEvent): boolean {
        return false;
    }
    Alt(myEvent: MyEvent): boolean {
        return false;
    }
    AltKey(myEvent: MyEvent): boolean {
        return false;
    }
    Control(myEvent: MyEvent): boolean {
        return false;
    }
    ControlKey(myEvent: MyEvent): boolean {
        return false;
    }
    Backspace(myEvent: MyEvent): boolean {
        return false;
    }
    UpperCase(myEvent: MyEvent): boolean {
        return false;
    }
    LowerCase(myEvent: MyEvent): boolean {
        return false;
    }
    Digit(myEvent: MyEvent): boolean {
        return false;
    }
    Punctuation(myEvent: MyEvent): boolean {
        return false;
    }
    FunctionKey(myEvent: MyEvent): boolean {
        return false;
    }
    ArrowUp(myEvent: MyEvent): boolean {
        return false;
    }
    ArrowDown(myEvent: MyEvent): boolean {
        return false;
    }
    ArrowLeft(myEvent: MyEvent): boolean {
        return false;
    }
    ArrowRight(myEvent: MyEvent): boolean {
        return false;
    }
    defaultKey(myEvent: MyEvent): boolean {
        return false;
    }
}