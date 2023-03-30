// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

import { Files, File } from "../Playfield"

export class BrowserFile implements File {
    public static STATUS_ARRAY = ["uninitialized", "initialized", "loadstart", "load", "loadend", "progress", "error", "abort"];
    protected _key: string;
    protected _path: string;
    protected _status: string;
    protected _data: any;
    protected _length: number;
    protected _statusText: string;
    protected _img: any; // _data interpretted as an image

    constructor(key: string, path: string) {
        this._key = key;
        this._path = path;
        this._status = BrowserFile.STATUS_ARRAY[0];
        this._length = 0;
    }
    public get status(): string {
        return this._status;
    }
    public set status(s: string) {
        this._status = s;
    }
    public get isError(): boolean {
        return ["unintialized", "error", "abort"].includes(this._status);
    }
    public get isDone(): boolean {
        return ["loadend", "error", "abort"].includes(this._status);
    }
    public get isInProgress(): boolean {
        return ["initialized", "loadstart", "load", "progress"].includes(this._status);
    }
    public get data(): any {
        return this._data;
    }
    public set data(s: any) {
        this._data = s;
    }
    public get string(): string {
        var encoding = {
            "ascii": "ascii",
            'utf8.bin': 'utf-8',
            'utf16le.bin': 'utf-16le',
            'macintosh.bin': 'macintosh'
        };    
        var dataView = new DataView(this._data as unknown as ArrayBuffer);
        var decoder = new TextDecoder(encoding["ascii"]);
        var decodedString = decoder.decode(dataView);
        return decodedString;
    }
    public set string(str: string) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        this._data = buf as any;
    }
    public get json(): any {
        return JSON.parse(this.string);
    }
    public set json(obj: any) {
        this._data = JSON.stringify(obj);
    }
    public async wait(timeout = 1000000): Promise<File> {
        let that = this;
        function waitForFoo(resolve: any, reject: any) {
            if (that.isDone) resolve(that);
            else if (timeout && (Date.now() - start) >= timeout) reject(new Error("timeout"));
            else setTimeout(waitForFoo.bind(that, resolve, reject), 30);
        }
        var start = Date.now();
        return new Promise(waitForFoo);
    }
}

export class BrowserFiles implements Files {
    protected _files: any;
    constructor() {
        this._files = {};
    }
    load(key: string, path: string): File {
        let file = new BrowserFile(key, path);
        this._files[key] = file;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        this._addListeners(xhr, file);
        xhr.open("GET", path);
        xhr.send();
        file.status = "initialized";
        return file;
    }
    get(key: string) {
        return this._files[key];
    }
    _addListeners(xhr: any, file: BrowserFile) {
        xhr._file = file;
        xhr.addEventListener('loadstart', this._handleEvent.bind(this));
        xhr.addEventListener('load', this._handleEvent.bind(this));
        xhr.addEventListener('loadend', this._handleEvent.bind(this));
        xhr.addEventListener('progress', this._handleEvent.bind(this));
        xhr.addEventListener('error', this._handleEvent.bind(this));
        xhr.addEventListener('abort', this._handleEvent.bind(this));
    }
    _handleEvent(event: any) {
        let xhr = event.currentTarget;
        let file = xhr._file;
        if (xhr.status !== 200) {
            file.status = "error";
            file._error = xhr.statusText;
        } else {
            file.status = event.type;
            file._error = xhr.statusText;
            file._data = xhr.response;
            if (event.total) file._length = event.total;
        }
    }
}
