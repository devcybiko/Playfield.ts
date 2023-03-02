import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Selectable } from "../Playfield/Abilities";
import {ItemOptions} from "./ItemOptions"

export class _Item extends Tile { };
export interface _Item extends Draggable, Selectable { };
applyMixins(_Item, [Draggable, Selectable]);

export class Item extends _Item {
    private _value: string;
    private _options: ItemOptions;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", text = "") {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Selectable();
        this._value = value;
        this._options = new ItemOptions;
        this._options.text = text || value;
        this._options.fontSize = h;
    }
    get value(): string {
        return this._value;
    }
    set value(_value: string) {
        this._value = _value;
    }
    public get options(): ItemOptions {
        return this._options;
    }
    public _updateGparms() {
        this.gparms.fillColor = this.options.fillColor;
        this.gparms.color = this.options.textColor;
        this.gparms.borderColor = this.options.borderColor;
        this.gparms.fontSize = this.options.fontSize;
        this.gparms.fontFace = this.options.fontFace;
        this.gparms.textAlign = this.options.textAlign;
        this.gparms.textBaseline = this.options.textBaseline;
    
    }
}