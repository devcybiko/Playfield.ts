import { Mixin, Base } from "../../Mixins";
import {Playfield} from "../Playfield";

export interface iPlayable {
    Playable(playfield: Playfield): void;
    get playfield(): Playfield;
    set playfield(p: Playfield);
};

export const PlayableBase = Playable(Base);
export abstract class PlayableClass extends PlayableBase { };
export function Playable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        any: any;
        _playfield: Playfield;
        Playable(playfield: Playfield) {
            this.playfield = playfield;
        }
        get playfield() {
            return this._playfield;
        }
        set playfield(p: Playfield) {
            this._playfield = p;
        }
        
    };
}
