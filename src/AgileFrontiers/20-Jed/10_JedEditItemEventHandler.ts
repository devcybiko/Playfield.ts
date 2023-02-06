class JedEditItemEventHandler extends EventHandler {
    constructor(editItem: JedEditItem) {
        super(editItem.playfield, editItem);
        this.logger = new Logger("EditItemEventHandler", "info");
    }
    ArrowLeft(event: any, playfield: Playfield, obj: JedEditItem) {
        obj.cursorInc(-1);
    }
    ArrowRight(event: any, playfield: Playfield, obj: JedEditItem) {
        obj.cursorInc(+1);
    }
    Backspace(event: any, playfield: Playfield, obj: JedEditItem) {
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
    OrdinaryKey(event: any, playfield: Playfield, obj: JedEditItem) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }

}
