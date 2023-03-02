export class KeyEvent {
    _key: string;
    _isShift: boolean;
    _isControl: boolean;
    _isAlt: boolean;
    _isOption: boolean;
    _isMeta: boolean;
    _isCommand: boolean;
    _event: any;

    constructor(event: any) {
        this._key = event.key;
        this._isShift = event.shiftKey;
        this._isControl = event.ctrlKey;
        this._isAlt = event.altKey;
        this._isOption = event.altKey;
        this._isMeta = event.metaKey;
        this._isCommand = event.metaKey;
        this._event = event;
    }
    get key(): string {
        return this._key;
    }
}