import { PlayfieldEvent, Tile } from "../Playfield";
import { Clickable, Hoverable } from "../Playfield/Abilities";
import { Dimensions, Rect, applyMixins } from "../Utils";
import { Button } from "./Button";
import { Group } from "./Group";
import { Label } from "./Label";

export class _MenuItem extends Button { };
export interface _MenuItem extends Hoverable, Clickable { };
applyMixins(_MenuItem, [Clickable, Hoverable]);

export class MenuItem extends _MenuItem {
    constructor(name: string, parent: Menu, x: number, y: number, label?: string, value?: string) {
        super(name, parent, x, y, 0, 0, label, value);
        this._type += ".MenuItem";
        this.options.borderRadius = 0;
    }
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
}

export class Menu extends Group {
    private _isVertical = false;
    private _margin = 5;
    private _lastX = 0;
    private _lastY = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label?: string) {
        super(name, parent, x, y, w, h, label);
        this._type += ".Menu";
        this.isBoxed = true;
    }

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        console.log(this.w, this.h);
        this.drawChildren(enable);
        this.gfx.gparms.fillColor = "";
        if (this.isBoxed) this.gfx.rect(this.X, this.Y, this.W, this.H);
        return new Dimensions(this.w, this.h);
    }
    setMenuItemWidths() {
        const max = this.children.map((child) => (child as unknown as Rect).w).reduce((a, b) => Math.max(a, b), -Infinity);
        this.children.forEach((child:any) => child.w = max);
    }
    setMenuItemHeights() {
        const max = this.children.map((child) => (child as unknown as Rect).h).reduce((a, b) => Math.max(a, b), -Infinity);
        this.children.forEach((child:any) => child.h = max);
    }
    addMenuItem(name: string, label?: string, value?: string): MenuItem {
        let menuItem = new MenuItem(name, this, this._lastX, this._lastY, label, value);
        if (this.isVertical) {
            this.setMenuItemWidths();
            this._lastY += menuItem.h;
        }
        else {
            this.setMenuItemHeights();
            this._lastX += menuItem.w;
        }
        this.updateWidthHeight(true);
        return menuItem;
    }
    public get isVertical() {
        return this._isVertical;
    }
    public set isVertical(value) {
        this._isVertical = value;
    }
}

