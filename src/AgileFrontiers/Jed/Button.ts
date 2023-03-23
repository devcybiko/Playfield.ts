import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Pressable, Hoverable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Button extends Item { };
export interface _Button extends Draggable, Pressable, Hoverable { };
applyMixins(_Button, [Draggable, Pressable, Hoverable]);

export class Button extends _Button {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.label = label || value || name;
        this.gfx.gparms.borderRadius = 10;
        this.options.textAlign = GfxParms.CENTER;
        this.options.textBaseline = GfxParms.MIDDLE;
        this.options.fontSize = 14;
        this.options.borderRadius = 10;
        let bb = this.gfx.boundingBox(label);
        this.w = this.w || bb.w;
        this.h = this.h || bb.h;

        this.isDraggable = false;
    }

    // --- Overrides --- //

    go(): boolean {
        return false;
    }

    override draw() {
        let gparms = this.gfx.gparms;
        this._updateGparms();
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
    }

    // --- onActions --- //
    log(msg: string) {
        console.log(msg, this.name, this.isHovering ? "isHovering" : "not isHovering", this.isPressed ? "isPressed" : "not isPressed");
    }
    onEnter() {
    }
    onExit() {
    }
    onHovering() {
    }
    onPress() {
    }
    onRelease() {
        if (this.isHovering) this.go();
    }
}