import { GfxBrowser } from "../Playfield/Graphics";
import { Playfield, EventQueue } from "../Playfield";
import { BrowserEventPump } from "./BrowserEventPump";

export class BrowserPlayfieldApp {
    private _playfield: Playfield;
    private _gfx: GfxBrowser;
    private _eventQueue: EventQueue;
    private _canvasEventPump: BrowserEventPump;

    constructor(canvasId = "#playfield") {
        this._gfx = new GfxBrowser(canvasId);
        this._eventQueue = new EventQueue();
        this._canvasEventPump = new BrowserEventPump(this._gfx.canvas, this._eventQueue);
        this._playfield = new Playfield(this._gfx, this._eventQueue);
    }

    // --- Accessors --- //

    public get playfield(): Playfield {
        return this._playfield;
    }
    public set playfield(value: Playfield) {
        this._playfield = value;
    }
    public get gfx(): GfxBrowser {
        return this._gfx;
    }
    public set gfx(value: GfxBrowser) {
        this._gfx = value;
    }
    public get eventQueue(): EventQueue {
        return this._eventQueue;
    }
    public set eventQueue(value: EventQueue) {
        this._eventQueue = value;
    }
    public get canvasEventPump(): BrowserEventPump {
        return this._canvasEventPump;
    }
    public set canvasEventPump(value: BrowserEventPump) {
        this._canvasEventPump = value;
    }

}