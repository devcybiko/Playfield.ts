import * as Utils from "../Utils";
import {Actor} from "./Actor";

export class Draggable {
    public obj: Actor;
    public origX = 0; // original x
    public origY = 0; // original y
    public snap = 10;

    constructor(actor: Actor) {
        this.obj = actor;
    }
    drag(dx: number, dy: number) {
        let newX = Utils.snapTo(this.origX + dx, this.snap);
        let newY = Utils.snapTo(this.origY + dy, this.snap);
        this.obj.move(newX, newY);
    }
    grab() {
        this.origX = this.obj.x();
        this.origY = this.obj.y();
    }
    drop() {
    }
}
