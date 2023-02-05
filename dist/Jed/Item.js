class Item extends Actor {
    constructor(parent, name, value, x, y, w, h) {
        super(parent, name, x, y, w, h);
        this.value(value);
        this.draggable = new Draggable(this);
    }
    value(newValue) {
        if (newValue !== undefined)
            this._value = newValue;
        return this._value;
    }
}
//# sourceMappingURL=Item.js.map