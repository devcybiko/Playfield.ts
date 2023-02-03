class Playfield {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public logger: Logger;
  public gfx!: Graphics;
  public objs: any[];
  public selectedObj: Actor;
  public dragObj: Actor;
  public grabDX: number;
  public grabDY: number;
  public body: any;
  public eventHandler: EventHandler;

  constructor(canvasId: string) {
    this.canvas = document.querySelector(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.logger = new Logger("Playfield");
    this.gfx = new Graphics(this.ctx);
    this.objs = [];
    this.selectedObj = null;
    this.eventHandler = new PlayfieldEventHandler(this, this.canvas);
    // this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    // this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    // this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    // document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.dragObj = null;
    this.grabDX = null;
    this.grabDY = null;
    this.body = document.querySelector('body');
    this.body.playfield = this;
  }

  add(obj: any) {
    obj.playfield = this;
    this.objs.push(obj);
    obj.addMeToPlayfield(this);
  }
  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let obj of this.objs) obj.draw(this.ctx);
  }
  findObjInBounds(x: number, y: number): any {
    for (let i = this.objs.length - 1; i >= 0; i--) {
      let obj = this.objs[i];
      if (obj.inBounds(x, y)) return obj;
    }
    return null;
  }
  toFront(obj: Actor) {
    let i = this.objs.indexOf(obj);
    if (i === -1) return;
    this.objs.splice(i, 1);
    this.objs.push(obj);
  }
  toBack(obj: Actor) {
    let i = this.objs.indexOf(obj);
    if (i === -1) return;
    this.objs.splice(i, 1);
    this.objs.splice(0, 0, obj);
  }
  handleKeyDown(event: any) {
    let playfield = event.srcElement.playfield as Playfield;
    if (!playfield)
      return this.logger.error(
        "ERROR: keydown not associated with a playfield"
      );
    if (playfield.selectedObj) playfield.selectedObj.keydown(event.key);
  }
  timer(playfield: Playfield) {
    playfield.goAll();
    playfield.redraw();
}
start() {
    this.redraw();
    setInterval(this.timer, 125, this);
}
goAll() {
    for (let obj of this.objs) obj.go();
}
collisions(theObj: Actor) {
    let results = [];
    for (let obj of this.objs) {
        if (theObj === obj) continue;
        if (obj.inBounds(theObj.x, theObj.y) ||
            obj.inBounds(theObj.x + theObj.w, theObj.y) ||
            obj.inBounds(theObj.x, theObj.y + theObj.h) ||
            obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
            results.push(obj);
    }
    return results;
}
}
