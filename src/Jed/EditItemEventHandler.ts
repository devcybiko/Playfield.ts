class EditItemEventHandler extends EventHandler {
    constructor(editItem: EditItem) {
        super(editItem.playfield, editItem);
    }
    ArrowLeft(event: any, playfield: Playfield, obj: EditItem) {
        obj.cursorInc(-1);
    }
    ArrowRight(event: any, playfield: Playfield, obj: EditItem) {
        obj.cursorInc(+1);
    }
    Backspace(event: any, playfield: Playfield, obj: EditItem) {
        if (obj.cursor > 0) {
            let c = obj.cursor;
            obj.value(obj._value.substring(0, c-1) + obj._value.substring(c));
            obj.cursorInc(-1);
        }
    }
    OrdinaryKey(event: any, playfield: Playfield, obj: EditItem) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }

}