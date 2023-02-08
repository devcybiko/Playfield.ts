import {Mixin} from "./Mixin";
import {Base} from "./Base";

export interface iNamed {
    Named(name: string): void;
    get name(): string;
    set name(s: string);
}

export const NamedBase = Named(Base);
export abstract class NamedClass extends NamedBase { };
export function Named<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _name = null as string;

        Named(name: string) {
            this._name = name;
        }
        get name() {
            return this._name;
        }
        set name(s: string) {
            this._name = s;
        }
    };
}
