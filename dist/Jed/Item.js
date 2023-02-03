class Item extends Actor {
    constructor(name, label, value, x, y, w, h) {
        super(name, x, y, w, h);
        this.hasFocus = false;
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
    loseFocus() {
        this.hasFocus = false;
        Actor.focusItem = null;
    }
    takeFocus() {
        if (Actor.focusItem) {
            Actor.focusItem.loseFocus();
        }
        Actor.focusItem = this;
        this.hasFocus = true;
    }
}
//# sourceMappingURL=Item.js.map