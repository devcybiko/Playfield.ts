import { Playfield, PlayfieldEvent, Tile, Splitter } from "../Playfield";
import * as Browser from "../Browser";
import { Text, Label, Button, Slider, Checkbox, Group, Radio } from "../Jed";
import { int, random } from "../Utils";

/**
 * Test File I/O
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 */


export class TestClass {
    _files: Browser.BrowserFiles;
    _key = "mario";
    _fname = "/static/images/mario_walking.png";
    // _fname = "http://devcybiko.s3-website-us-east-1.amazonaws.com/images/covid-vax.jpeg";
    _timerID: any;
    _pollInterval = 1;

    constructor() {
        this._files = new Browser.BrowserFiles();
    }
    _checkFileProgress() {
        let file = this._files.get(this._key);
        let keepPolling = false;
        if (!file) {
            console.error("could not locate " + this._key);
        } else if (file.isError) {
            console.error("error in loading " + this._key, "error=" + file._error);
        } else if (file.isDone) {
            console.log("done loading " + this._key, "bytes loaded: " + file._length);
            let blob = new Blob([file._data]);
            let blobURL = URL.createObjectURL(blob);
            console.log(blobURL);
            let img = new Image(); // Create new img element
            img.src = blobURL;
            file._img = img;
            setTimeout(this.showImage.bind(this), 1);
        } else if (file.isInProgress) {
            console.log("still loading " + this._key, "bytes loaded: " + file._length);
            keepPolling = true;
        } else {
            console.error("error... unknown file status " + file.status);
        }
        if (!keepPolling) clearInterval(this._timerID);
    }
    showImage() {
        let canvas = document.getElementById("playfield") as any;
        console.log(canvas);
        let ctx = canvas.getContext("2d");
        console.log(ctx);
        console.log(canvas.width, canvas.height);
        // ctx.drawImage(this._files.get(this._key)._img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(this._files.get(this._key)._img, 0, 0);
    }
    loadImage() {
        this._files.load(this._key, this._fname);
        this._timerID = setInterval(this._checkFileProgress.bind(this), this._pollInterval);
    }
    run() {
        this.loadImage();
    }
}
