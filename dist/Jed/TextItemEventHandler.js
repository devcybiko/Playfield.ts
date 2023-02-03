class TextItemEventHandler extends EventHandler {
    constructor(textItem) {
        super(textItem.playfield, textItem);
    }
    mouseDown(event, playfield, textItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.takeFocus();
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    mouseUp(event, playfield, textItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}
//# sourceMappingURL=TextItemEventHandler.js.map