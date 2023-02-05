class TextItem extends Item {
    constructor(parent, name, label, value, x, y, w = 0, h = 0, ww = 0, hh = 0) {
        super(parent, name, value, x, y, 0, 0);
        this.cursorOn = true;
        this.labelItem = new LabelItem(this, name + "-label", label, 0, 0, ww, hh);
        this.editItem = new EditItem(this, name + "-editor", value, this.labelItem.rect.w + 2, 0, w, h);
    }
    click(x, y) {
        this.playfield.focusObj(this.editItem);
    }
    labelBB() {
        return this.labelItem.bb;
    }
}
//# sourceMappingURL=TextItem.js.map