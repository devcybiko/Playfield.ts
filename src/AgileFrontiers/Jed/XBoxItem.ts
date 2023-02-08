import { Item } from "./Item";
import { LabelItem } from "./LabelItem";
import { Playfield, Actor } from "../Playfield";
import { XBox } from "../Shapes";
import * as Utils from "../Utils";

export class XBoxItem extends Item {
    private xbox: XBox;
    private _values = ["on", "off"];
    private _isChecked = false;

    constructor(parent: Playfield | Actor, name: string, values: string | string[], x: number, y: number, w = 0, h = 0, borderColor = "black", fillColor = "white", color = "black") {
        super(parent, name, null, x, y, 0, 0);
        this.values(values);
        this.xbox = new XBox(parent, name, x, y, w, h, borderColor, fillColor, color);
    }
    click(x: number, y: number) {
        super.click(x, y);
        this._isChecked = !this._isChecked;
        this.log(this.value());
    }
    isChecked(checked?: boolean) {
        return this.isSelected;
    }
    values(values?: string | string[]): string[]{
        if (values === undefined) return this._values;
        if (typeof values === "string") this._values = [values, null];
        else this._values = values;
    }
    value(value?: string) {
        if (value !== undefined) this._values = [value, null];
        return this.isChecked() ? this._values[0] : this._values[1];
    }
    draw() {
        if (this.isChecked()) {
            this.gfx.line(
                this.x, this.y,
                this.x + this.w, this.y + this.h,
                this.gparms);
            this.gfx.line(
                this.x+this.w, this.y,
                this.x, this.y + this.h,
                this.gparms);    
        }
    }

}
