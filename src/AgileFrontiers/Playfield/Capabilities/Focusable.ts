import { Mixin, Base, iBase } from "../../Mixins";

export interface iFocusable extends iBase {
    Focusable(): void;
    get hasFocus(): boolean;
    set hasFocus(n: boolean);
    focus(): void;
    defocus(): void;
}

export const FocusableBase = Focusable(Base);
export abstract class FocusableClass extends FocusableBase { };
export function Focusable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _hasFocus = false;

        Focusable() {
        }
        get hasFocus(): boolean {
            return this._hasFocus;
        }
        set hasFocus(n: boolean) {
            this._hasFocus = n;
        }
        focus(): void {
            this.hasFocus = true;
        }
        defocus(): void {
            this.hasFocus = false;
        }
    };
}
