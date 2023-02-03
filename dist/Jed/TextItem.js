class TextItem extends Item {
    constructor(parent, name, label, value, x, y, w = 0, h = 0, ww = 0, hh = 0) {
        super(parent, name, value, x, y, w, h);
        this.cursorOn = true;
        this.label = new LabelItem(this, name + "-label", label, 0, 0, ww, hh);
        this.editor = new EditItem(this, name + "-editor", value, this.label.w + 2, 0, w, h);
    }
    click(x, y) {
        this.playfield.focusObj(this.editor);
    }
}
//# sourceMappingURL=TextItem.js.map