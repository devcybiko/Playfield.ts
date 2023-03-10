import {int} from "./Functions";

export class Ratio {
    _rmin: number;
    _rmax: number;
    _rdelta: number;
    _value: number;

    _imin: number;
    _imax: number;
    _idelta: number;
    _index: number;

    Ratio(rmin: number, rmax: number, value: number, imin: number, imax: number) {
        this._rmin = rmin;
        this._rmax = rmax;
        this._rdelta = this._rmax - this._rmin;
        this._imin = int(imin);
        this._imax = int(imax);
        this._idelta = this._imax - this._imin;
        this.value = value;
    }

    set index(index: number) {
        this._index = int(index);
        let percent = (this._index - this._imin) / this._idelta;
        this._value = percent * this._rdelta + this._rmin;
    }

    get index(): number {
        return this._index;
    }

    set value(value: number) {
        this._value = value;
        let percent = (this._value - this._rmin) / this._rdelta;
        this._index = int(percent * this._idelta + this._imin);
        console.log(this._value, percent, this._index);
    }

    get value(): number {
        return this._value;
    }
}
