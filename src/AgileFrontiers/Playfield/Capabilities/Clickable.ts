import { Mixin, Base, iBase } from "../../Mixins";

export interface iClickable extends iBase {
    Clickable(): void;
    click(x: number, y: number): void;
}

export const ClickableBase = Clickable(Base);
export abstract class ClickableClass extends ClickableBase { };
export function Clickable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        any: any;
        Clickable() {
        }
        click(x: number, y: number) {
            this.any.info("CLICK! " + this.any.name + ": " + x + "," + y);
        }
    };
}
