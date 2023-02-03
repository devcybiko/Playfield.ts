class EditItemEventHandler extends EventHandler {
    private textItem : EditItem;
    constructor(textItem: EditItem) {
        super(textItem.playfield, textItem);
    }
    MouseDown(event:any, playfield: Playfield, textItem: EditItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.playfield.focusObj(textItem);
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    MouseUp(event:any, playfield: Playfield, textItem: EditItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}