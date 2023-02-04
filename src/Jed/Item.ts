abstract class Item extends Actor {
    public _value: string;

    constructor(parent: Playfield | Actor, name: string, value: string, x: number, y: number, w: number, h: number) {
        super(parent, name, x, y, w, h);
        this.value(value);
        this.isDraggable = true;
    }
    value(newValue?: string) {
        if (newValue !== undefined) this._value = newValue;
        return this._value;
    }
}