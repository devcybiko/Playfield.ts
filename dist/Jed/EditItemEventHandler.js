class EditItemEventHandler extends EventHandler {
    constructor(editItem) {
        super(editItem.playfield, editItem);
        this.logger = new Logger("EditItemEventHandler", "info");
    }
    ArrowLeft(event, playfield, obj) {
        obj.cursorInc(-1);
    }
    ArrowRight(event, playfield, obj) {
        obj.cursorInc(+1);
    }
    Backspace(event, playfield, obj) {
        this.logger.log(obj.cursor, obj._value);
        if (obj.cursor > 0) {
            let c = obj.cursor;
            let left = obj._value.substring(0, c - 1);
            let right = obj._value.substring(c);
            obj.value(left + right);
            obj.cursorInc(-1);
            this.logger.log(left, right, obj.cursor, obj._value);
        }
    }
    OrdinaryKey(event, playfield, obj) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }
}
//# sourceMappingURL=EditItemEventHandler.js.map