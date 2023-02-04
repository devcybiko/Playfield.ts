class EditItemEventHandler extends EventHandler {
    constructor(editItem) {
        super(editItem.playfield, editItem);
    }
    ArrowLeft(event, playfield, obj) {
        obj.cursorInc(-1);
    }
    ArrowRight(event, playfield, obj) {
        obj.cursorInc(+1);
    }
    Backspace(event, playfield, obj) {
        if (obj.cursor > 0) {
            let c = obj.cursor;
            obj.value(obj._value.substring(0, c - 1) + obj._value.substring(c));
            obj.cursorInc(-1);
        }
    }
    OrdinaryKey(event, playfield, obj) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }
}
//# sourceMappingURL=EditItemEventHandler.js.map