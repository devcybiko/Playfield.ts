import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Logger, Rect, between, Dimensions } from "../Utils";
import { Swipeable, Draggable, DispatchController, ClickController, PressController, SelectController, DragController, EditController, HoverController } from "../Playfield/Abilities";

export class _Group extends Item { };
export interface _Group extends Swipeable, Draggable, DispatchController, Logger, ClickController, PressController, SelectController, DragController, EditController, HoverController { };
applyMixins(_Group, [Swipeable, DispatchController, Logger, ClickController, PressController, SelectController, DragController, EditController, HoverController]);

export class Group extends _Group {
    protected _isGroupItem: boolean;
    protected _xMargin: number;
    protected _yMargin: number;
    protected _isResizing: boolean;
    protected _autoResize: boolean;

    constructor(name: string, parent: Tile, x: number, y: number, w = 0, h = 0, label?: string) {
        super(name, parent, x, y, w, h, label, label);
        this._type += ".Group";
        this._isBoxed = !!this.label;
        this._xMargin = 2;
        this._yMargin = 2;
        this._isResizing = false;
        this._autoResize = false;
        this.options.fontSize -= 1;
        this.label = this.label; // reset the bounding box
        // this.updateWidthHeight();
    }

    // --- Overrides --- //

    override inBounds(dx: number, dy: number, pfEvent?: PlayfieldEvent): Tile {
        if (this.isVisible) {
            if (this.label &&
                between(this.X - 2, dx, this.X + this.w + 2) &&
                between(this.Y - this.labelBB.h / 2, dy, this.Y + this.h + 2))
                return this;
        } else {
            return super.inBounds(dx, dy, pfEvent);
        }
    }

    override onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
    if (between(-2, dx, this.w) && between(-4, dy, 4) ||
        between(-2, dx, this.w) && between(this.h - 4, dy, this.h + 4)) {
        // console.log(dx, dy, this.labelBB);
        super.onGrab(dx, dy, pfEvent);
        pfEvent.isActive = true;
        if (this.isBoxed && between(this.w - 10, dx, this.w + 10) && between(this.h - 10, dy, this.h + 10)) {
            this._isResizing = true;
        }
        return true;
    }
    return false;
}

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
    if (this._isResizing) {
        super.w = this.w + dx;
        super.h = this.h + dy;
    } else {
        return super.onDrag(dx, dy, pfEvent);
    }
}

    override onDrop(pfEvent: PlayfieldEvent): boolean {
    super.onDrop(pfEvent);
    this._isResizing = false;
    return true;
}

updateWidthHeight(force = false) {
    let wh = this._computeWidthHeight(force);
    super.w = wh.w;
    super.h = wh.h;
}

_computeWidthHeight(force = false) {
    let w = super.w;
    let h = super.h;

    if (!force && (w || h)) return { w, h };

    for (let child of this.children) {
        let rectChild = child as unknown as Rect;
        let cx = rectChild.x;
        let cy = rectChild.y;
        let cw = rectChild.w;
        let ch = rectChild.h;
        let newW = cx + cw + this.xMargin * 2;
        let newH = cy + ch + this.yMargin * 2;
        if (newW > w) w = newW;
        if (newH > h) h = newH;
    }
    return { w, h };
}

_drawLabel() {
    if (this.label) {
        let labelX = this.X + this.xMargin;
        let labelY = this.Y - this.gfx.gparms.fontSize / 2;
        let labelW = Math.min(this.labelBB.w, this.W - this.xMargin);
        let labelH = this.gfx.gparms.fontSize;
        let gfx = this.gfx.clone();
        gfx.gparms.borderColor = "";
        gfx.gparms.fillColor = this.options.backgroundColor;
        gfx.clipRect(labelX, labelY, this.W - this.xMargin / 2, this.H + this.gfx.gparms.fontSize / 2)
        gfx.rect(labelX, labelY, labelW, labelH);
        gfx.text(this.label, labelX, labelY, labelW);
        gfx.restore();
    }
}
    override draw(enable = true): Dimensions {
    this.updateGparms(enable);
    this.updateRect();
    this.updateWidthHeight(true);
    if (this.isBoxed) {
        this.gfx.rect(this.X, this.Y, this.W, this.H);
        this._drawLabel();
    }
    this.gfx.clipRect(this.X, this.Y, this.W, this.H);
    let dims = this.drawChildren(enable);
    this.gfx.restore();
    if (this.autoResize) {
        this.w = dims.w;
        this.h = dims.h;
    }
    return this.dimensions;
}

    // --- Accessors --- //

    public get isGroupItem(): boolean {
    return this._isGroupItem;
}
    public set isGroupItem(value: boolean) {
    this._isGroupItem = value;
}
    public get xMargin(): number {
    return this._xMargin;
}
    public set xMargin(value: number) {
    this._xMargin = value;
}
    public get yMargin(): number {
    return this._yMargin;
}
    public set yMargin(value: number) {
    this._yMargin = value;
}

    public override get w(): number {
    if (!super.w) return this._computeWidthHeight().w;
    else return super.w;
}
    public override set w(n: number) {
    super.w = n;
}
    public override get h(): number {
    if (!super.h) return this._computeWidthHeight().h;
    else return super.h;
}
    public override set h(n: number) {
    super.h = n;
}
    public override get value(): string {
    let result = "";
    let comma = "";
    for (let child of this.children) {
        let itemChild = (child as unknown as Item);
        if (itemChild.value) {
            result += comma + itemChild.value
            comma = ",";
        }
    }
    return result;
}

    public get autoResize(): boolean {
    return this._autoResize;
}
    public set autoResize(value: boolean) {
    this._autoResize = value;
}

}