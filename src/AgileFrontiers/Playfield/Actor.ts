import {Loggable, between} from "../Utils";
import {Named, Tree, Rect, Base} from "../Mixins";
import {Focusable, Movable, Drawable, Draggable, Selectable, Clickable, Playable} from "./Capabilities";
import {EventDispatcher} from "./EventHandlers/EventDispatcher";
import {Playfield} from "./Playfield";

const ActorBase = Focusable(Playable(Clickable(Drawable(Loggable(Named(Tree(Rect(Movable(Draggable(Selectable(Base)))))))))));
export class Actor extends ActorBase {
    public eventHandler: EventDispatcher;

    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w: number, h: number) {
        super();
        this.Named(name);
        this.Rect(x, y, w, h);
        this.Tree(null);
        this.Movable(x, y);
        this.Dragabble();
        this.Selectable();
        this.Focusable();
        this.Loggable();
        this.Playable(parent.playfield);
        this.eventHandler = null;
        this.Drawable(this.playfield._ctx);
        parent.add(this);
    }
    X(): number {
        return this.x + this.gparms.xOffset;
    }
    Y(): number {
        return this.y + this.gparms.yOffset;
    }
    inBounds(x: number, y: number): Actor {
        let result =
            between(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
            between(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
        if (result) return this;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let obj = this._children[i];
            let found = obj.inBounds(x, y);
            if (found) return found;
        }
        return null;
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

