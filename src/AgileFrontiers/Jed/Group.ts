import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Logger, Rect, between, Tree } from "../Utils";
import { Draggable, EventDispatcher, Clicker, Presser, Selecter, Dragger, Editer, Hoverer } from "../Playfield/Abilities";

export class _Group extends Item { };
export interface _Group extends Draggable, EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer { };
applyMixins(_Group, [EventDispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer]);

export class Group extends _Group {
    private _isGroupItem: boolean;
    private _isBoxed: boolean;
    private _xMargin: number;
    private _yMargin: number;
    private _isResizing: boolean;

    constructor(name: string, parent: Tile, x: number, y: number, w = 0, h = 0, label?: string) {
        super(name, parent, x, y, w, h, label);
        this.EventDispatcher();
        this._isBoxed = true;
        this._xMargin = 10;
        this._yMargin = 10;
        this.label = label;
        this._isResizing = false;
    }

    // --- Overrides --- //

    inBounds(dx: number, dy: number): Tile {
        for (let _child of this.children.reverse()) {
            let tileChild = _child as unknown as Tile;
            if (tileChild.inBounds(dx, dy)) return Tile.cast(this);
        }
        if (this.isBoxed) {
            let wh = this._computeWidthHeight();
            let result =
                between(this.X, dx, this.X + wh.w) &&
                between(this.Y - this.gfx.gparms.fontSize / 2, dy, this.Y + wh.h);
            if (result) return Tile.cast(this);
        }
        return super.inBounds(dx, dy);
    }

    onEvent(pfEvent: PlayfieldEvent) {
        this.dispatchEventToChildren(pfEvent);
    }

    onGrab(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        super.onGrab(dx, dy, pfEvent);
        if (this.isBoxed && between(this.w - 10, dx, this.w + 10) && between(this.h - 10, dy, this.h + 10)) {
            this._isResizing = true;
        }
        return true;
    }

    onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._isResizing) {
            super.w = this.w + dx;
            super.h = this.h + dy;
        } else {
            return super.onDrag(dx, dy, pfEvent);
        }
    }

    onDrop(pfEvent: PlayfieldEvent): boolean {
        super.onDrop(pfEvent);
        this._isResizing = false;
        return true;
    }

    updateWidthHeight() {
        let wh = this._computeWidthHeight();
        super.w = wh.w;
        super.h = wh.h;
    }

    _computeWidthHeight() {
        let w = super.w;
        let h = super.h;

        if (w || h) return { w, h };

        for (let child of this.children) {
            let rectChild = (child as unknown as Rect);
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

    draw() {
        if (this.isBoxed) {
            let wh = this._computeWidthHeight();
            this.gfx.clipRect(this.x, this.y, wh.w, wh.h);
            this.gfx.rect(this.x, this.y, wh.w, wh.h);
            if (this.label) {
                this.gfx.restore();
                this.gfx.gparms.fontSize = 12;
                let labelX = this.x + this.xMargin / 2;
                let labelY = this.y - this.gfx.gparms.fontSize / 2;
                let labelW = Math.min(this.gfx.boundingBox(this.label).w, wh.w - this.xMargin);
                let labelH = this.gfx.gparms.fontSize;
                let gfx = this.gfx.clone();
                gfx.gparms.borderColor = "";
                this.gfx.clipRect(labelX, labelY, wh.w - this.xMargin / 2, wh.h + this.gfx.gparms.fontSize / 2)
                gfx.rect(labelX, labelY, labelW, labelH);
                gfx.text(this.label, labelX, labelY, labelW);
            }
            this.drawChildren();
            this.gfx.restore();
        } else {
            this.drawChildren();
        }
    }

    // --- Accessors --- //

    public get isGroupItem(): boolean {
        return this._isGroupItem;
    }
    public set isGroupItem(value: boolean) {
        this._isGroupItem = value;
    }
    public get isBoxed(): boolean {
        return this._isBoxed;
    }
    public set isBoxed(value: boolean) {
        this._isBoxed = value;
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

    public get w(): number {
        if (!super.w) return this._computeWidthHeight().w;
        else return super.w;
    }
    public set w(n: number) {
        super.w = n;
    }
    public get h(): number {
        if (!super.h) return this._computeWidthHeight().h;
        else return super.h;
    }
    public set h(n: number) {
        super.h = n;
    }
    public get value(): string {
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
}