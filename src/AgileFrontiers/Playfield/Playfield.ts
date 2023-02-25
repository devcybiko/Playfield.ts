import { Tile, hasTile } from "./Tile";
import { Rect, hasRect, Logger, Tree } from "../Utils";
import { Gfx, hasGfx, GfxParms, hasGfxParms } from "../Graphics";
import { RootTile } from "./RootTile";
/**
 * Playfield is a graphic area for rendering
 * And it collects human inputs and dispatches them to tiles
 * A Playfield has a tree of Tiles (rectangles)
 */

export interface hasPlayfield {
    get playfield(): Playfield;
}

export class Playfield implements hasRect, hasTile, hasPlayfield, hasGfx, hasGfxParms {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _tile: Tile;
    _rect: Rect;
    _gfx: Gfx;
    _gparms: GfxParms;
    _logger: Logger;
    _lastTime = 0;
    _delay = 0;
    _count = 0;
    _busy = false;
    _timerId = 0 as any;

    constructor(canvasId: string) {
        this._canvas = document.querySelector(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._gfx = new Gfx(this._ctx);
        this._gparms = new GfxParms();
        this._rect = new Rect(0, 0, this._canvas.width, this._canvas.height);
        this._tile = new RootTile(0, 0, this.rect.w, this.rect.h, this);
        this._logger = new Logger();

        // const dpr = window.devicePixelRatio;
        // const rect = this._canvas.getBoundingClientRect();
        // // Set the "actual" size of the canvas
        // this._canvas.width = rect.width * dpr;
        // this._canvas.height = rect.height * dpr;

        // // Scale the context to ensure correct drawing operations
        // this._ctx.scale(dpr, dpr);

        // // Set the "drawn" size of the canvas
        // this._canvas.style.width = `${rect.width}px`;
        // this._canvas.style.height = `${rect.height}px`;

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
        this.tile.redraw();
    }
    tick() {
        // note: what if the time to process one 'tick' is greater than the delay?
        if (this._busy) console.error("INTERRUPTED WHILE BUSY!")
        clearTimeout(this._timerId);
        this._count = 0;
        this._busy = true;
        let now = Date.now();
        let extra = now - this._lastTime;
        this.tile.tick(); // process all ticks
        this.redraw(); // redraw the playfield
        this._lastTime = Date.now();
        let delta = this._lastTime - now;
        // if (delta > this._delay) console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
        // if (this._count >= 5000) {
        console.log(`NOTE: The tick() processing time is: (${delta}ms aka ${1000 / delta} fps) and the _delay is: (${this._delay}ms aka ${1000 / this._delay} fps). There is ${extra}ms between frames`);
        console.log(`NOTE: This is ${this._count/delta * 1000} objects per second`);
        //     this._count = 0;
        // }
        console.log(this._count);
        this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
        this._busy = false;
    }
    start(delay = 125) {
        this._delay = delay;
        this._lastTime = Date.now();
        this.redraw();
        // note: what if the time to process one 'tick' is greater than the delay?
        this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
    }
}