export class Null {
    _me: any;
    constructor() {
        this._me = this;
    }
    isa(name: string) {
        if (typeof this._me[name] === "function") {
            return true;
        } else {
            return false;
        }
    }
}