import {Item} from "./Item";
import {LabelItem} from "./LabelItem";
import {EditItem} from "./EditItem";
import {Playfield, Actor} from "../Playfield";

export class TextItem extends Item {
    public cursor: number;
    public cursorOn = true;
    public timerId: any;
    public labelItem: LabelItem;
    public editItem: EditItem;

    constructor(parent: Playfield | Actor, name: string, label: string, value: string, x: number, y: number, w = 0, h = 0, ww = 0, hh = 0) {
        super(parent, name, value, x, y, 0, 0);
        this.labelItem = new LabelItem(this, name + "-label", label, 0, 0, ww, hh);
        this.editItem = new EditItem(this, name + "-editor", value, this.labelItem.w() + 2, 0, w, h);
    }
    click(x: number, y: number) {
        this.playfield.focusObj(this.editItem);
    }
    labelBB(): any {
        return this.labelItem.bb;
    }
}
