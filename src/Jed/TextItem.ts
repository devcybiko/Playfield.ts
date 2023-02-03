class TextItem extends Item {
    public cursor: number;
    public cursorOn = true;
    public timerId: any;
    public label: LabelItem;
    public editor: EditItem;

    constructor(parent: Playfield | Actor, name: string, label: string, value: string, x: number, y: number, w = 0, h = 0, ww=0, hh=0) {
        super(parent, name, value, x, y, w, h);
        this.label = new LabelItem(this, name+"-label", label, 0, 0, ww, hh);
        this.editor = new EditItem(this, name+"-editor", value, this.label.w + 2, 0, w, h);
    }
    click(x: number, y: number) {
        this.playfield.focusObj(this.editor);
    }

}