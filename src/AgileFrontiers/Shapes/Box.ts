import {Playfield, Actor, Draggable} from "../Playfield";

export class Box extends Actor {
    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w = 0, h = 0, borderColor = "black", fillColor = "white") {
        super(parent, name, x, y, w, h);
        this.gparms.borderColor = borderColor;
        this.gparms.fillColor = fillColor;
    }
    draw() {
        super.draw();
        this.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
    }
}