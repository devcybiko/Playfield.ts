import { Tile } from "..";

export class ShapeTile extends Tile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
    }
    // tick() {
    //     super.tick();
    //     if ((this as any).isSelected) (this as any).rmove(1,1);
    // }
}
