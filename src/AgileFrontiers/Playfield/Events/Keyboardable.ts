
export interface Keyboardable {    
    KeyDown(event: any): boolean;
    KeyUp(event: any): boolean;
    OrdinaryKey(event: any): boolean;
    SpecialKey(event: any): boolean;
    Shift(event: any): boolean;
    Meta(event: any): boolean;
    MetaKey(event: any): boolean;
    Alt(event: any): boolean;
    AltKey(event: any): boolean;
    Control(event: any): boolean;
    ControlKey(event: any): boolean;
    Backspace(event: any): boolean;
    UpperCase(event: any): boolean;
    LowerCase(event: any): boolean;
    Digit(event: any): boolean;
    Punctuation(event: any): boolean;
    FunctionKey(event: any): boolean;
    ArrowUp(event: any): boolean;
    ArrowDown(event: any): boolean;
    ArrowLeft(event: any): boolean;
    ArrowRight(event: any): boolean;
    defaultKey(event: any): boolean;
}