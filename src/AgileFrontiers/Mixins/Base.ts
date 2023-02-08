export interface iBase {
    get any(): any;
    is(name: string): boolean;
    isa(name: string): boolean;
}

export class Base implements iBase {
    _any: any;
    constructor() {
        this._any = this;
    }
    get any(): any {
        return this._any;
    }
    is(name: string) {
        // synonym for isa()
        return this.isa(name);
    }
    isa(name: string) {
        if (typeof this.any[name] === "function") {
            return true;
        } else {
            return false;
        }
    }
}