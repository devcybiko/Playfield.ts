import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Dimensions } from "../Utils";
import { Eventable, Draggable, Pressable, Hoverable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Button extends Item { };
export interface _Button extends Eventable, Draggable, Pressable, Hoverable { };
applyMixins(_Button, [Eventable, Draggable, Pressable, Hoverable]);

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
        let bb = this.gfx.boundingBox(this.label);
        let w = this.W || bb.w;
        let h = this.H || bb.h;
        if (this.isHovering && this.isPressed) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering && !this.isPressed) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = this.options.backgroundColor;

        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this.label, x, y, w, h);
        this.gfx.restore();
        return this.dimensions;
    }

    // --- onActions --- //
    override onEnter(pfEvent: PlayfieldEvent) {
    }
    override onExit(pfEvent: PlayfieldEvent) {
    }
    override onHovering(pfEvent: PlayfieldEvent) {
    }
    override onPress(pfEvent: PlayfieldEvent) {
    }
    override onRelease(pfEvent: PlayfieldEvent) {
        if (this.isHovering) this.go();
    }
}