export interface Draggable { }
export class Draggable {
    _isDraggable: boolean;

    Draggable() {
        this.isDraggable = true;
        return this;
    }

    public get isDraggable() {
        return this._isDraggable;
    }
    public set isDraggable(value) {
        this._isDraggable = value;
    }


    onGrab(event?: any): boolean {
        let that = this as any;
        return true;
    }
    onDrag(dx: number, dy: number, event?: any): boolean {
        let that = this as any;
        if (that.rmove) that.rmove(dx, dy);
        return true;
    }
    onDrop(event?: any): boolean {
        return true;
    }
}
