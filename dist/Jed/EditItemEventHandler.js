class EditItemEventHandler extends EventHandler {
    constructor(textItem) {
        super(textItem.playfield, textItem);
    }
    MouseDown(event, playfield, textItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.playfield.focusObj(textItem);
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    MouseUp(event, playfield, textItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}
//# sourceMappingURL=EditItemEventHandler.js.map