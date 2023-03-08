import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Selectable } from "../Playfield/Abilities";
import { ItemOptions } from "./ItemOptions"
import { GfxParms } from "../Playfield/Graphics";

export class _Item extends Tile { };
export interface _Item extends Draggable { };
applyMixins(_Item, [Draggable]);

export class Item extends _Item {
    private _value: string;
    private _options: ItemOptions;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", text = "") {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this._value = value;
        this._options = new ItemOptions;
        this._options.text = text || value;
        this._options.fontSize = h;
        if (w < 0) {
            this._options.textAlign = GfxParms.RIGHT;
            this.w = -w;
        }
    }

    public _updateGparms() {
        this.gfx.gparms.fillColor = this.options.fillColor;
        this.gfx.gparms.color = this.options.textColor;
        this.gfx.gparms.borderColor = this.options.borderColor;
        this.gfx.gparms.fontSize = this.options.fontSize;
        this.gfx.gparms.fontFace = this.options.fontFace;
        this.gfx.gparms.fontStyle = this.options.fontStyle;
        this.gfx.gparms.textAlign = this.options.textAlign;
        this.gfx.gparms.textBaseline = this.options.textBaseline;
    }

    public go() {
        throw Error("Unimplemented feature: 'go()';");
    }

    _recompute() {
        if (this.parent) {
            this.gfx.gparms.dx = (this.parent as Tile).X + ((this.parent as any).xMargin || 0);
            this.gfx.gparms.dy = (this.parent as Tile).Y + ((this.parent as any).yMargin || 0);
        }
    }

    // --- Accessors --- //

    get value(): string {
        return this._value;
    }
    set value(_value: string) {
        this._value = _value;
    }
    public get options(): ItemOptions {
        return this._options;
    }
}