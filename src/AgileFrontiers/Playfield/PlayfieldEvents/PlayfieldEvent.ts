export class PlayfieldEvent {
    private _event: any;
    private _type: string;
    private _key: string;
    private _x: number;
    private _y: number;
    private _isShift: boolean;
    private _isControl: boolean;
    private _isAlt: boolean;
    private _isOption: boolean;
    private _isMeta: boolean;
    private _isCommand: boolean;
    private _button: string;
    private _wheelDelta: number;

    constructor(event: any) {
    }
}