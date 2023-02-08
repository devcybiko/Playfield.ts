import { Item } from "./Item";
import { LabelItem } from "./LabelItem";
import { Playfield, Actor } from "../Playfield";
import { XBoxItem } from "./XBoxItem";

export class CheckBoxItem extends Item {
    private labelItem: LabelItem;
    private xboxItem: XBoxItem;
    private _values = ["on", "off"];

    constructor(parent: Playfield | Actor, name: string, label: string, values: string | string[], x: number, y: number, w = 0, h = 0, ww = 0, hh = 0, borderColor = "black", fillColor = "white", color = "black") {
        super(parent, name, null, x, y, 0, 0);
        this.labelItem = new LabelItem(parent, name + "-label", label, 0, 0, ww, hh);
        this.xboxItem = new XBoxItem(parent, name + "-checkbox", values, this.labelItem.bb.w, 0, w, h, borderColor, fillColor, color);
        this.values(values);
        this.logger.log(this.w, this.h)
        this.w = 0;
        this.h = 0;
    }
    click(x: number, y: number) {
        super.click(x, y);
        this.xboxItem.click(x, y);
    }
    isChecked(checked?: boolean) {
        return this.xboxItem.isChecked(checked);
    }
    values(values?: string | string[]): string[] {
        if (values === undefined) return this._values;
        if (typeof values === "string") this._values = [values, null];
        else this._values = values;
    }
    value(value?: string) {
        return this.xboxItem.value(value);
    }
}
