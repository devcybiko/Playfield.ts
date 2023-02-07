import * as Utils from "../Utils";
import * as Mixins from "../Mixins";
import {Gfx, GfxParms} from "../Graphics";
import {Draggable} from "./Draggable";
import {EventHandler} from "./EventHandler";
import {Playfield} from "./Playfield";

export class Actor extends Mixins.BaseRectTree {
    public draggable: Draggable;
    public eventHandler: EventHandler;
    public _isSelected: boolean;
    public hasFocus: boolean;
    public logger: Utils.Logger;
    public playfield: Playfield;
    public gparms = new GfxParms();
    public gfx: Gfx;

    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w: number, h: number) {
        super();
        this.Base(name);
        this.Rect(x, y, w, h);
        this.Tree(null);
        parent.add(this);
        this.playfield = parent.playfield;
        this.logger = new Utils.Logger("Actor", "warn");
        this.eventHandler = null;
    }
    X(): number {
        return this.x() + this.gparms.xOffset;
    }
    Y(): number {
        return this.y() + this.gparms.yOffset;
    }
    isSelected(selected? : boolean) {
        if (selected !== undefined) this._isSelected = selected;
        return this._isSelected;
    }
    add(obj: Actor) {
        super.add(obj);
        obj.playfield = this.parent().playfield;
        obj.gfx = this.parent().gfx;
    }
    move(x: number, y: number, w = this.w(), h = this.h()): void {
        this.x(x);
        this.y(y);
        this.w(w);
        this.h(h);
    }
    rmove(dx: number, dy: number, dw = 0, dh = 0): void {
        this.x(this.x() + dx);
        this.y(this.y() + dy);
        this.w(this.w() + dw);
        this.h(this.h() + dh);
    }
    select() {
        this.isSelected(true);
    }
    deselect() {
        this.isSelected(false);
    }
    focus() {
        this.hasFocus = true;
    }
    defocus() {
        this.hasFocus = false;
    }
    inBounds(x: number, y: number): Actor {
        let result =
            Utils.between(this.gparms.xOffset + this.x(), x, this.gparms.xOffset + this.x() + this.w()) &&
            Utils.between(this.gparms.yOffset + this.y(), y, this.gparms.yOffset + this.y() + this.h());
        if (result) return this;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let obj = this._children[i];
            let found = obj.inBounds(x, y);
            if (found) return this;
        }
        return null;
    }
    click(x: number, y: number) {
        this.logger.log("CLICK! " + this.name() + ": " + x + "," + y);
    }
    keydown(key: string) {
        if (key === "ArrowUp") this.y(this.y() - 10);
        if (key === "ArrowDown") this.y(this.y() + 10);
        if (key === "ArrowLeft") this.x(this.x() - 10);
        if (key === "ArrowRight") this.x(this.x() + 10);
    }
    go(): void {
    }
    recompute() {
        let parentGparms = this.parent().gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent().x() + parentGparms.xOffset;
            this.gparms.yOffset = this.parent().y() + parentGparms.yOffset;
        }
    }
    drawAll(): void {
        this.draw();
        for (let obj of this._children) obj.drawAll();
    }
    draw(): void {
    }
}
