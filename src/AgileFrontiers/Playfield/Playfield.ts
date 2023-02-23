import { Tile, hasTile } from "./Tile";
import { Rect, hasRect, Logger, Tree } from "../Utils";
import { Gfx, GfxParms } from "../Graphics";
import { RootTile } from "./RootTile";
/**
 * Playfield is a graphic area for rendering
 * And it collects human inputs and dispatches them to tiles
 * A Playfield has a tree of Tiles (rectangles)
 */

export interface hasPlayfield {
    get playfield(): Playfield;
}

export class Playfield implements hasRect, hasTile, hasPlayfield {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _tile: Tile;
    _rect: Rect;
    _gfx: Gfx;
    _gparms: GfxParms;
    _logger: Logger;

    constructor(canvasId: string) {
        this._canvas = document.querySelector(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._gfx = new Gfx(this._ctx);
        this._gparms = new GfxParms();
        this._rect = new Rect(0, 0, this._canvas.width, this._canvas.height);
        this._tile = new RootTile( 0, 0, this.rect.w, this.rect.h, this);
        this._logger = new Logger();
    }
    get playfield(): Playfield {
        return this;
    }
    get tile(): Tile {
        return this._tile;
    }
    get rect(): Rect {
        return this._rect;
    }
    get gparms(): GfxParms {
        return this._gparms;
    }
    get gfx(): Gfx {
        return this._gfx;
    }
    clear() {
        this.gfx.rect(0, 0, this._canvas.width, this._canvas.height, this.gparms);
    }
    redraw() {
        this.clear();
        this.tile.drawAll();
    }
    start() {
    }
}