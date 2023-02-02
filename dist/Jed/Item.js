class Item extends Actor {
    constructor(name, label, value, x, y, w, h) {
        super(name, x, y, w, h);
        this._label = label;
        this._value = value;
    }
    label(newLabel) {
        if (newLabel)
            this._label = newLabel;
        return this._label;
    }
    value(newValue) {
        if (newValue)
            this._value = newValue;
        return this._value;
    }
}
//# sourceMappingURL=Item.js.map