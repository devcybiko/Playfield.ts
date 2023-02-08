import { iBase, Base, Mixin } from "../../../Mixins";
import { inclusive } from "../../../Utils";

export interface iKeyboardEnabled extends iBase {
    KeyboardEnabled(): void;
}


export const KeyboardEnabledBase = KeyboardEnabled(Base);
export abstract class KeyboardEnabledClass extends KeyboardEnabledBase { };
export function KeyboardEnabled<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        any: any;

        KeyboardEnabled() {
        }
        KeyDown(event: any) {
        }
        KeyUp(event: any) {
        }
        OrdinaryKey(event: any) {
        }
        SpecialKey(event: any) {
            this.any.log("SpecialKey:", event);
        }
        Shift(event: any) {
            this.any.log("Shift:", event);
        }
        Meta(event: any) {
            this.any.log("Meta:", event);
        }
        MetaKey(event: any) {
            this.any.log("MetaKey:", event);
        }
        Alt(event: any) {
            this.any.log("Alt:", event);
        }
        AltKey(event: any) {
            this.any.log("AltKey:", event);
        }
        Control(event: any) {
            this.any.log("Control:", event);
        }
        ControlKey(event: any) {
            this.any.log("ControlKey:", event);
        }
        Backspace(event: any) {
            this.any.log("Backspace:", event);
        }
        UpperCase(event: any) {
            this.any.log("UpperCase:", event);
        }
        LowerCase(event: any) {
            this.any.log("LowerCase:", event);
        }
        Digit(event: any) {
            this.any.log("Digit:", event);
        }
        Punctuation(event: any) {
            this.any.log("Punctuation:", event);
        }
        FunctionKey(event: any) {
            this.any.log("FunctionKey:", event);
        }
        ArrowUp(event: any) {
            this.any.log("ArrowUp:", event);
        }
        ArrowDown(event: any) {
            this.any.log("ArrowDown:", event);
        }
        ArrowLeft(event: any) {
            this.any.log("ArrowLeft:", event);
        }
        ArrowRight(event: any) {
            this.any.log("ArrowRight:", event);
        }
        defaultKey(event: any) {
            this.any.log("unknown keypress:", event.key, event);
        }
    };
}
