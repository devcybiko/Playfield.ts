import * as Utils from "../../Utils";
import { iBase, Base, Named, NamedClass, Mixin } from "../../Mixins";

export interface iSelectable extends iBase {
    Selectable(): void;
    get isSelected(): boolean;
    set isSelected(n: boolean);
    select(): void;
    deselect(): void;
}


export const SelectableBase = Selectable(Base);
export abstract class SelectableClass extends SelectableBase { };
export function Selectable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _isSelected = false;

        Selectable() {
        }
        get isSelected(): boolean {
            return this._isSelected;
        }
        set isSelected(n: boolean) {
            this._isSelected = n;
        }
        select(): void {
            this.isSelected = true;
        }
        deselect(): void {
            this.isSelected = false;
        }
    };
}
