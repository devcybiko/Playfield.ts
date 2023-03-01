import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Selectable } from "../Playfield/Abilities";

export class _Item extends Tile { };
export interface _Item extends Draggable, Selectable { };
applyMixins(_Item, [Draggable, Selectable]);

export class Item extends _Item {
    _value: string;
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Selectable();
        this._value = value;
    }
    get value(): string {
        return this._value;
    }

    set value(_value: string) {
        this._value = _value;
    }
}