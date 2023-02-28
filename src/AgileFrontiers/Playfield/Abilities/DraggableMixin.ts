export interface Draggable {}
export class Draggable {
    Draggable() {
    }

    onGrab(event?: any): boolean {
        let that = this as any;
        console.log("grab", that.name);
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
