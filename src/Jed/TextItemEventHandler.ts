class TextItemEventHandler extends EventHandler {
    private textItem : TextItem;
    constructor(textItem: TextItem) {
        super(textItem.playfield, textItem);
    }
    MouseDown(event:any, playfield: Playfield, textItem: TextItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.takeFocus();
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    MouseUp(event:any, playfield: Playfield, textItem: TextItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}