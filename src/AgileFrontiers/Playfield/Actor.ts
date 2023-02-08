import * as Utils from "../Utils";
import {Named, Tree, Rect, Null} from "../Mixins";
import {Gfx, GfxParms} from "../Graphics";
import {Movable} from "./Movable";
import {Draggable} from "./Draggable";
import {Selectable} from "./Selectable";
import {EventHandler} from "./EventHandler";
import {Playfield} from "./Playfield";

const _Actor = Named(Tree(Rect(Movable(Draggable(Selectable(Null))))));
export class Actor extends _Actor {
    public eventHandler: EventHandler;
    public _isSelected: boolean;
    public hasFocus: boolean;
    public logger: Utils.Logger;
    public playfield: Playfield;
    public gparms = new GfxParms();
    public gfx: Gfx;

    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w: number, h: number) {
        super();
        this.Named(name);
        this.Rect(x, y, w, h);
        this.Tree(null);
        this.Movable(x, y);
        this.Dragabble();
        parent.add(this);
        this.playfield = parent.playfield;
        this.logger = new Utils.Logger("log");
        this.eventHandler = null;
    }
    X(): number {
        return this.x + this.gparms.xOffset;
    }
    Y(): number {
        return this.y + this.gparms.yOffset;
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
    deselect() {
        this.isSelected(false);
        this.logger.warn("Selected", this.name(), this.isSelected());
    }
    focus() {
        this.hasFocus = true;
    }
    defocus() {
        this.hasFocus = false;
    }
    inBounds(x: number, y: number): Actor {
        let result =
            Utils.between(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
            Utils.between(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
        if (result) return this;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let obj = this._children[i];
            let found = obj.inBounds(x, y);
            if (found) return found;
        }
        return null;
    }
    click(x: number, y: number) {
        this.logger.log("CLICK! " + this.name() + ": " + x + "," + y);
    }
    keydown(key: string) {
        if (key === "ArrowUp") this.y = this.y - 10;
        if (key === "ArrowDown") this.y = this.y + 10;
        if (key === "ArrowLeft") this.x = this.x - 10;
        if (key === "ArrowRight") this.x = this.x + 10;
    }
    go(): void {
    }
    recompute() {
        let parentGparms = this.parent().gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent().x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent().y + parentGparms.yOffset;
        }
    }
    drawAll(): void {
        this.draw();
        for (let obj of this._children) obj.drawAll();
    }
    draw(): void {
    }
}

