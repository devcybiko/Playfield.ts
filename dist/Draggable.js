class Draggable {
    constructor(actor) {
        this.origX = 0; // original x
        this.origY = 0; // original y
        this.snap = 10;
        this.obj = actor;
    }
    drag(dx, dy) {
        let newX = Utils.snapTo(this.origX + dx, this.snap);
        let newY = Utils.snapTo(this.origY + dy, this.snap);
        this.obj.move(newX, newY);
    }
    grab() {
        this.origX = this.obj.rect.x;
        this.origY = this.obj.rect.y;
    }
    drop() {
    }
}
//# sourceMappingURL=Draggable.js.map