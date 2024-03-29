import { PlayfieldEvent, Tile } from "../Playfield";
import { Dimensions, applyMixins } from "../Utils";
import { Draggable, Clickable } from "../Playfield/Abilities";
import { ItemOptions } from "./ItemOptions"
import { GfxParms } from "../Playfield/Graphics";

export class _Item extends Tile { };
export interface _Item extends Draggable, Clickable { };
applyMixins(_Item, [Draggable, Clickable]);

export class Item extends _Item {
    protected _value: string;
    protected _label: string;
    protected _itemOptions: ItemOptions;
    protected _isBoxed: boolean;
    private _labelBB: Dimensions;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h);
        this._type += ".Item";
        this._value = value;
        this.label = label || value || name;
        this._itemOptions = new ItemOptions();
        if (w < 0) {
            // setting the width to a negative number forces right-aligned text
            this._itemOptions.textAlign = GfxParms.RIGHT;
            this.w = -w;
        }
        this.updateGparms();
        this._autoLabelWidthHeight();
    }

    public override updateGparms(enable = true) {
        super.updateGparms(enable);
        this.gfx.gparms.fillColor = this.options.backgroundColor;
        this.gfx.gparms.color = this.options.textColor;
        this.gfx.gparms.borderColor = this.options.borderColor;
        this.gfx.gparms.fontSize = this.options.fontSize;
        this.gfx.gparms.fontFace = this.options.fontFace;
        this.gfx.gparms.fontStyle = this.options.fontStyle;
        this.gfx.gparms.textAlign = this.options.textAlign;
        this.gfx.gparms.textBaseline = this.options.textBaseline;
        this.gfx.gparms.borderRadius = this.options.borderRadius;
    }

    public _autoLabelWidthHeight() {
        this.updateGparms();
        let bb = this.gfx.boundingBox(this.label);
        this.w = this.w || bb.w + 2;
        this.h = this.h || bb.h + 2;
    }
    public go() {
        // generic 'click' or 'press' functionality here
        // user function for whatever this thing is supposed to do
    }

    override onMenu(pfEvent: PlayfieldEvent) {
    }

    override objectify() {
        let obj = super.objectify();
        obj.label = this.label;
        obj.value = this.value;
        return obj;
    }
    // --- Accessors --- //

    get value(): string {
        return this._value;
    }
    set value(_value: string) {
        this._value = _value;
    }
    public get label(): string {
        return this._label;
    }
    public set label(value: string) {
        this._label = value;
        this._labelBB = this.gfx.boundingBox(this._label || "");
    }
    public override get options(): ItemOptions {
        return this._itemOptions;
    }
    override printMe() {
        console.log(" | ".repeat(this.depth()), this.name, this.isVisible, this.x, this.y, this.w, this.h, "(", this.X, this.Y, this.W, this.H, ")", this.isVisible);
    }
    public get isBoxed(): boolean {
        return this._isBoxed;
    }
    public set isBoxed(value: boolean) {
        this._isBoxed = value;
    }
    public get labelBB(): Dimensions {
        return this._labelBB;
    }
    public set labelBB(value: Dimensions) {
        this._labelBB = value;
    }

}