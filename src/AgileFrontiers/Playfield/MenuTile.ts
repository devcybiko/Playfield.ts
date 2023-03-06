import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { applyMixins, Logger } from "../Utils";
import { GfxParms } from "../Graphics";

/**
 * The MenuTile has some special capabilities
 */

export class _MenuTile extends Tile { };
export interface _MenuTile extends Logger { };
applyMixins(_MenuTile, [Logger]);

export class MenuTile extends _MenuTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.gparms.fontSize = h;
        this.Logger();
    }
    draw() {
        let gparms = this.gparms.clone();
        gparms.textAlign = GfxParms.CENTER;
        gparms.fontFace = GfxParms.SANS_SERIF;
        gparms.fontStyle = GfxParms.BOLD;
        let x = this.x;
        let y = this.y;
        let w = this.w;
        let h = this.h;
        this.gfx.textRect("File", x, y, w, h, gparms);
        gparms.textAlign = GfxParms.LEFT;
        gparms.fontFace = GfxParms.SANS_SERIF;
        gparms.fontStyle = GfxParms.REGULAR;
        this.gfx.textRect("Open...", x, y+=14, w, h, gparms);
        this.gfx.textRect("Save", x, y+=14, w, h, gparms);
        this.gfx.textRect("Save As...", x, y+=14, w, h, gparms);
        gparms.color = "gray";
        gparms.fontStyle = GfxParms.ITALIC;
        this.gfx.textRect("Save All", x, y+=14, w, h, gparms);
        return true;
    }
}