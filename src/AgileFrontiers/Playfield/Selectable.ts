import * as Utils from "../Utils";
import { Mixin, Null } from "../Mixins";

export function Selectable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _selected = false;

        Selectable() {
        }
        get selected(): boolean {
            return this._selected;
        }
        set selected(n: boolean) {
            this._selected = n;
        }
        select(): void {
            this.selected = true;
        }
        deselect(): void {
            this.selected = false;
        }
    };
}

export const __Selectable = Selectable(Null);
export class _Selectable extends __Selectable {
    costructor() {
    }
}