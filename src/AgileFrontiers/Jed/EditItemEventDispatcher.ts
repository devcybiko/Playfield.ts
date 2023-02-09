import {Loggable} from "../Utils";
import {EditItem} from "./EditItem";
import {Playfield, EventDispatcher} from "../Playfield";
import {MouseEnabled, KeyboardEnabled} from "../Playfield/EventHandlers/Capabilities";
import {Base} from "../Mixins";

export class EditItemEventDispatcher extends DispatcherBase {
    constructor(editItem: EditItem) {
        super(editItem.playfield, editItem);
        this.Loggable("log");
        this.MouseEnabled();
    }
    ArrowLeft(event: any, playfield: Playfield, obj: EditItem) {
        obj.cursorInc(-1);
    }
    ArrowRight(event: any, playfield: Playfield, obj: EditItem) {
        obj.cursorInc(+1);
    }
    Backspace(event: any, playfield: Playfield, obj: EditItem) {
        this._logger.log(obj.cursor, obj._value);
        if (obj.cursor > 0) {
            let c = obj.cursor;
            let left = obj._value.substring(0, c - 1);
            let right = obj._value.substring(c);
            obj.value(left + right);
            obj.cursorInc(-1);
            this._logger.log(left, right, obj.cursor, obj._value);
        }
    }
    OrdinaryKey(event: any, playfield: Playfield, obj: EditItem) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }

}
