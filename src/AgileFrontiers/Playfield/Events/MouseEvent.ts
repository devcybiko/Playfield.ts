export class MouseEvent {
    _x: number;
    _y: number;
    _button: string;
    _type: string;
    _wheelDelta: number;
    _key: string;

    constructor(x: number, y: number, button?: number, type?: string, wheelDelta?: number, key?: string) {
        this._x = x;
        this._y = y;
        if (button === 0) this._button = "select";
        if (button === 1) this._button = "middle";
        if (button === 2) this._button = "menu";
        this._type = type;
        this._wheelDelta = wheelDelta;
        this._key = key;
    }
    get x(): number {
        return this._x;
    }
    get y(): number {
        return this._y;
    }
    get button(): string {
        return this._button;
    }
    get type(): string {
        return this._type;
    }
    get wheelDelta(): number {
        return this._wheelDelta;
    }
}