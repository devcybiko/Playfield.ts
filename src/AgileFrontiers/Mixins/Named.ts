import {Mixin} from "./Mixin";

export function Named<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _name = null as string;

        Named(name: string) {
            this._name = name;
        }
        name(s?: string): string {
            if (s !== undefined) this._name = s;
            return this._name;
        }
    };
}

