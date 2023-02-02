abstract class Item extends Actor {
    private _value: string;
    private _label: string;

    constructor(name: string, label: string, value: string, x: number, y:number, w:number, h:number) {
        super(name, x, y, w, h);
        this._label = label;
        this._value = value;
    }
    label(newLabel: string) {
        if (newLabel) this._label = newLabel;
        return this._label;
    }
    value(newValue?: string) {
        if (newValue) this._value = newValue;
        return this._value;
    }
}