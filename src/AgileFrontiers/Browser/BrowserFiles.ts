// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

export class BrowserFile {
    public static STATUS_ARRAY = ["uninitialized", "initialized", "loadstart", "load", "loadend", "progress", "error", "abort"];
    protected _key: string;
    protected _path: string;
    protected _status: string;
    protected _data: string;
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
}




export class BrowserFiles {
    protected _files: any;
    constructor() {
        this._files = {};
    }
    load(key: string, path: string) {
        let file = new BrowserFile(key, path);
        this._files[key] = file;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        this._addListeners(xhr, file);
        xhr.open("GET", path);
        xhr.send();
        file.status = "initialized";
        return xhr;
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
        console.log(event);
        let xhr = event.currentTarget;
        let file = xhr._file;
        console.log(file);
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
