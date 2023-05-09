import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Dimensions } from "../Utils";
import { DispatchController, Draggable, Pressable, Hoverable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Button extends Item { };
export interface _Button extends DispatchController, Draggable, Pressable, Hoverable { };
applyMixins(_Button, [DispatchController, Draggable, Pressable, Hoverable]);

export class Button extends _Button {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this._type += ".Button";
        this.label = label || value || name;
        this.gfx.gparms.borderRadius = 10;
        this.options.textAlign = GfxParms.CENTER;
        this.options.textBaseline = GfxParms.MIDDLE;
        this.options.borderRadius = 10;
    }

    // --- Overrides --- //

    override draw(enable = true): Dimensions {
        let gparms = this.gfx.gparms;
        this.updateGparms(enable);
        this.updateRect();
        let x = this.X;
        let y = this.Y;
        let w = this.W || this.labelBB.w;
        let h = this.H || this.labelBB.h;
        if (this.isHovering && this.isPressed) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering && !this.isPressed) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = this.options.backgroundColor;

        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this.label, x, y, w, h);
        this.gfx.restore();
        return this.dimensions;
    }

    // --- onActions --- //
    override onRelease(pfEvent: PlayfieldEvent) {
        if (this.isHovering) this.go();
        return super.onRelease(pfEvent);
    }
}