type Constructor = new (...args: any[]) => {};

function Base<TBase extends Constructor>(_base: TBase) {
    return class extends _base {
        _name = null as string;

        Base(name: string) {
            this._name = name;
        }
        name(s?: string): string {
            if (s !== undefined) this._name = s;
            return this._name;
        }
    };
}

