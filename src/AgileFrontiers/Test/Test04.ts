import { Playfield } from "../Playfield";
import { CircleTile, BoxTile } from "../Playfield/Shapes"
import { BrowserPlayfieldApp } from "../Browser";

/**
 * Speed test
 */
import { random, int } from "../Utils";

function bounce() {
    let oldX = this.x;
    let oldY = this.y;
    let newX = this.x + this.DX;
    let newY = this.y + this.DY;
    if (newX + this.w > this.playfield.w || newX < 0) {
        this.DX = -this.DX;
        newX = oldX;
    }
    if (newY + this.h > this.playfield.h || newY < 0) {
        this.DY = -this.DY;
        newY = oldY;
    }
    this.x = newX;
    this.y = newY;
}

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp(undefined, 0.5);
        this._playfield = this._playfieldApp.playfield;
    }
    tenthousandTestTile() {
        let parent = this._playfield.rootTile;
        let max = 10;
        for (let i = 0; i < max; i++) {
            for (let j = 0; j < 10; j++) {
                let x = random(0, this._playfield.w);
                let y = random(0, this._playfield.h);
                let r = random(10, 50);
                let DX = random(-10, 10);
                let DY = random(-10, 10);
                let box = new BoxTile("box", parent, x, y, r, r);
                box.onTick = bounce.bind(box);
                box.isSelected = true;
                (box as any).DX = DX;
                (box as any).DY = DY;
            }
        }
        let fps = 30;
        let delay = Math.floor(1000 / fps);
        this._playfield.start(delay);
        // note: processing 10,000 Circles stressed the app at 55 FPS
        // note: processing 10,000 Boxes stressed the app at 142 FPS
        // note: processing 10,000 Empty Boxes stressed the app at 250 FPS

        // note: at 30FPS, about 18,500 circles could be processed
        // note: at 30FPS, about 20,000 boxes could be processed
        // note: at 30FPS, about 45,000 empty boxes could be processed

        // note: at 60FPS, about 8700 circles could be processed
        // note: at 60FPS, about 20,000 boxes could be processed
        // note: at 60FPS, about 28,000 empty boxes could be processed

        // 5,000,000 empty boxes per second
        // 2,000,000 filled boxes per second
        // 1,428,571 empty circles per second
        // 714,000 filled circles per second

        // 1 fps: 16ms/62.5fps
        // 2 fps: 16ms/62.5fps
        // 4 fps: 16ms/62.5fps
        // 8 fps: 13ms/77fps
        // 15 fps: 7ms/143fps
    }
    run() {
        this.tenthousandTestTile();
    }
}