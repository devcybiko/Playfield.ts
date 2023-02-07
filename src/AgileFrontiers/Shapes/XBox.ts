import { Playfield, Actor, Draggable } from "../Playfield";
import { Box } from "./Box";

export class XBox extends Box {
    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w = 0, h = 0, borderColor = "black", fillColor = "white", color = "black") {
        super(parent, name, x, y, w, h, borderColor, fillColor);
        this.gparms.color = color;
    }
    draw() {
        super.draw();
        if (this.isSelected()) {
            this.gfx.line(
                this.x(), this.y(),
                this.x() + this.w(), this.y() + this.h(),
                this.gparms);
            this.gfx.line(
                this.x()+this.w(), this.y(),
                this.x(), this.y() + this.h(),
                this.gparms);    
        }
    }
}