var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define("Graphics/GfxParms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxParms = void 0;
    class GfxParms {
        constructor() {
            this.color = "black";
            this.borderColor = "black";
            this.fillColor = "white";
            this.dx = 0;
            this.dy = 0;
            this.textAlign = "left";
            this.textBaseline = "top";
            this.fontSize = 24;
            this.fontFace = "sans-serif";
        }
        clone() {
            return Object.assign({}, this);
        }
        _updateFont() {
            this._font = "" + this._fontSize + "px " + this._fontFace;
        }
        get font() {
            return this._font;
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(n) {
            this._fontSize = n;
            this._updateFont();
        }
        get fontFace() {
            return this._fontFace;
        }
        set fontFace(n) {
            this._fontFace = n;
            this._updateFont();
        }
    }
    exports.GfxParms = GfxParms;
});
define("Utils/Logger", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    class Logger {
        // INFO ==> INFO, LOG, WARN, ERROR
        // LOG  ==> LOG, WARN, ERROR
        // WARN ==> WARN, ERROR
        // ERROR==> ERROR
        constructor(logLevel = "error", uselink = true) {
            this._level = logLevel;
            this._uselink = uselink;
        }
        _source(depth = 0) {
            let err = new Error("error");
            let stack = err.stack.split("\n");
            let source = stack[depth];
            return source;
        }
        _module() {
            let source = this._source(4).trim();
            let words = source.split(" ");
            let module = words[1];
            this._link = words[2];
            if (module === "new") {
                module = words[2] + ".new";
                this._link = words[3];
            }
            return module;
        }
        get logLevel() {
            return this._level;
        }
        set logLevel(level) {
            this._level = level;
        }
        format(level, module, ...args) {
            let format = `${level}: ${module}: ${args.join(", ")}`;
            if (this._uselink)
                format += "\n" + " ".repeat(level.length + 2) + this._link;
            return format;
        }
        info(...args) {
            // most verbose
            if (["info"].includes(this._level))
                console.log(this.format("INFO", this._module()), ...args);
        }
        log(...args) {
            // less verbose
            if (["info", "log"].includes(this._level))
                console.log(this.format("LOG", this._module()), ...args);
        }
        warn(...args) {
            // less verbose
            if (["info", "log", "warn"].includes(this._level))
                console.log(this.format("WARN", this._module()), ...args);
        }
        error(...args) {
            // always show errors
            console.error(this.format("ERROR", this._module(), ...args));
        }
    }
    exports.Logger = Logger;
});
define("Utils/Functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.snapTo = exports.random = exports.inclusive = exports.between = void 0;
    function between(a, b, c) {
        let result = a < b && b < c;
        return result;
    }
    exports.between = between;
    function inclusive(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    exports.inclusive = inclusive;
    function random(low, high) {
        let result = Math.random() * (high - low) + low;
        return result;
    }
    exports.random = random;
    function snapTo(n, snap) {
        let x = n % snap;
        if (x === 0)
            return n;
        return Math.floor(n / snap) * snap;
    }
    exports.snapTo = snapTo;
});
define("Utils/Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = void 0;
    class Rect {
        constructor(x, y, w, h) {
            this._x = 0;
            this._y = 0;
            this._w = 0;
            this._h = 0;
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;
        }
        get x() {
            return this._x;
        }
        set x(n) {
            this._x = n;
        }
        get y() {
            return this._y;
        }
        set y(n) {
            this._y = n;
        }
        get w() {
            return this._w;
        }
        set w(n) {
            this._w = n;
        }
        get h() {
            return this._h;
        }
        set h(n) {
            this._h = n;
        }
    }
    exports.Rect = Rect;
});
define("Utils/Tree", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
    class Tree {
        constructor(name, obj, parent) {
            this._children = Array();
            this._name = name;
            this._obj = obj;
            if (parent)
                parent.add(this);
        }
        get parent() {
            return this._parent;
        }
        get parentObj() {
            if (this.parent)
                return this.parent.obj;
            return null;
        }
        get name() {
            return this._name;
        }
        get obj() {
            return this._obj;
        }
        get children() {
            // return a shallow copy
            return [...this._children];
        }
        add(child) {
            child._parent = this;
            this._children.push(child);
        }
        dfs(visit, ctx) {
            let stop = visit(this, ctx);
            if (stop)
                return stop;
            for (let child of this._children) {
                stop = child.dfs(visit, ctx);
                if (stop)
                    return stop;
            }
            return null;
        }
        toFront(obj) {
            let i = this._children.indexOf(obj);
            if (i === -1)
                return;
            this._children.splice(i, 1);
            this._children.push(obj);
        }
        toBack(obj) {
            let i = this._children.indexOf(obj);
            if (i === -1)
                return;
            this._children.splice(i, 1);
            this._children.splice(0, 0, obj);
        }
    }
    exports.Tree = Tree;
});
define("Utils/index", ["require", "exports", "Utils/Logger", "Utils/Functions", "Utils/Rect", "Utils/Tree"], function (require, exports, Logger_1, Functions_1, Rect_1, Tree_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = exports.Rect = exports.snapTo = exports.random = exports.inclusive = exports.between = exports.Logger = void 0;
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_1.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_1.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_1.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_1.snapTo; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_1.Rect; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return Tree_1.Tree; } });
});
define("Graphics/Gfx", ["require", "exports", "Graphics/GfxParms", "Utils/index"], function (require, exports, GfxParms_1, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Gfx = void 0;
    Utils = __importStar(Utils);
    class Gfx {
        constructor(ctx) {
            this.logger = new Utils.Logger("log");
            this.ctx = ctx;
            this.gparms = new GfxParms_1.GfxParms();
            this.ctx.fontKerning = "none";
            this.ctx.letterSpacing = "1px";
            this.ctx.textRendering = "geometricPrecision";
        }
        rect(x, y, w, h, gparms = this.gparms) {
            if (gparms.fillColor) {
                this.ctx.fillStyle = gparms.fillColor;
                this.ctx.fillRect(gparms.dx + x, gparms.dy + y, w, h);
            }
            if (gparms.borderColor) {
                this.ctx.strokeStyle = gparms.borderColor;
                this.ctx.strokeRect(gparms.dx + x, gparms.dy + y, w, h);
            }
        }
        ellipse(x, y, w, h, gparms = this.gparms) {
            if (gparms.fillColor) {
                this.ctx.beginPath();
                this.ctx.ellipse(gparms.dx + x + w / 2, gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this.ctx.fillStyle = gparms.fillColor;
                this.ctx.fill();
            }
            if (gparms.borderColor) {
                this.ctx.beginPath();
                this.ctx.ellipse(gparms.dx + x + w / 2, gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this.ctx.strokeStyle = gparms.borderColor;
                this.ctx.stroke();
            }
        }
        circle(x, y, r, gparms = this.gparms) {
            this.ellipse(x - r, y - r, r * 2, r * 2, gparms);
        }
        line(x0, y0, x1, y1, gparms0 = this.gparms, gparms1 = gparms0) {
            this.logger.info("line", x0, y0, x1, y1);
            this.ctx.beginPath();
            this.ctx.strokeStyle = gparms0.color;
            this.ctx.moveTo(gparms0.dx + x0, gparms0.dy + y0);
            this.ctx.lineTo(gparms1.dx + x1, gparms1.dy + y1);
            this.ctx.stroke();
        }
        text(msg, x = 0, y = 0, gparms = this.gparms) {
            this.ctx.fillStyle = gparms.color;
            this.ctx.font = gparms.font;
            this.ctx.textAlign = gparms.textAlign;
            this.ctx.textBaseline = gparms.textBaseline;
            this.ctx.fillText(msg, gparms.dx + x, gparms.dy + y);
        }
        textRect(msg, x = 0, y = 0, w, h, gparms = this.gparms) {
            this.ctx.font = gparms.font;
            let boundingBox = this.boundingBox(msg, gparms);
            if (!w)
                w = boundingBox.w;
            if (!h)
                h = boundingBox.h;
            this.rect(x, y, w, h, gparms);
            this.text(msg, x, y, gparms);
        }
        boundingBox(msg, gparms = this.gparms) {
            this.ctx.font = gparms.font;
            let boundingBox = this.ctx.measureText(msg);
            return { w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize };
        }
        clipRect(x = 0, y = 0, w = this.ctx.canvas.width, h = this.ctx.canvas.height, gparms = this.gparms) {
            this.save();
            let region = new Path2D();
            region.rect(x + gparms.dx, y + gparms.dy, w, h);
            this.ctx.clip(region);
        }
        save() {
            this.ctx.save();
        }
        restore() {
            this.ctx.restore();
        }
    }
    exports.Gfx = Gfx;
});
define("Graphics/index", ["require", "exports", "Graphics/Gfx", "Graphics/GfxParms"], function (require, exports, Gfx_1, GfxParms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxParms = exports.Gfx = void 0;
    Object.defineProperty(exports, "Gfx", { enumerable: true, get: function () { return Gfx_1.Gfx; } });
    Object.defineProperty(exports, "GfxParms", { enumerable: true, get: function () { return GfxParms_2.GfxParms; } });
});
define("Playfield/Tile", ["require", "exports", "Utils/index", "Graphics/index"], function (require, exports, Utils_1, Graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = void 0;
    class Tile {
        constructor(name, parent, x, y, w, h, playfield = parent._playfield) {
            this._tree = new Utils_1.Tree(name, this);
            this._rect = new Utils_1.Rect(x, y, w, h);
            this._gparms = new Graphics_1.GfxParms();
            if (parent)
                parent.add(this);
            this._playfield = playfield;
        }
        get gfx() {
            return this._playfield.gfx;
        }
        get gparms() {
            return this._gparms;
        }
        get name() {
            return this.tree.name;
        }
        get rect() {
            return this._rect;
        }
        get tree() {
            return this._tree;
        }
        get x() {
            return this.rect.x;
        }
        get y() {
            return this.rect.y;
        }
        get w() {
            return this.rect.w;
        }
        get h() {
            return this.rect.h;
        }
        get X() {
            return this.rect.x + this.gparms.dx;
        }
        get Y() {
            return this.rect.y + this.gparms.dy;
        }
        get children() {
            return this.tree.children.map(child => child.obj);
        }
        get parent() {
            return this.tree.parentObj;
        }
        add(child) {
            this.tree.add(child.tree);
            child._playfield = this._playfield;
        }
        inBounds(x, y) {
            let result = (0, Utils_1.between)(this.X, x, this.Y + this.w) &&
                (0, Utils_1.between)(this.Y, y, this.Y + this.h);
            if (result)
                return this;
            for (let child of this.children.reverse()) {
                let found = child.inBounds(x, y);
                if (found)
                    return found;
            }
            return null;
        }
        _recompute() {
            if (this.parent) {
                this.gparms.dx = this.parent.X;
                this.gparms.dy = this.parent.Y;
            }
        }
        move(x, y) {
            this.rect.x = x;
            this.rect.y = y;
        }
        rmove(dx, dy) {
            this.rect.x += dx;
            this.rect.y += dy;
        }
        size(w, h) {
            this.rect.w = w;
            this.rect.h = h;
        }
        rsize(dw, dh) {
            this.rect.w += dw;
            this.rect.h += dh;
        }
        drawAll() {
            this.redraw();
            for (let child of this.tree.children) {
                child.obj.drawAll();
            }
        }
        redraw() {
            this._recompute();
            this.draw();
        }
        redrawChildren() {
            this.children.forEach(child => child.redraw());
        }
        draw() {
            this.redrawChildren();
        }
        tick() {
            this.tree.children.forEach(child => child.obj.tick());
        }
        go() {
            throw new Error("Method not implemented.");
        }
    }
    exports.Tile = Tile;
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = void 0;
    /**
     * The RootTile has some special capabilities
     */
    class RootTile extends Tile_1.Tile {
        constructor(x, y, w, h, playfield) {
            super("_root", null, x, y, w, h, playfield);
        }
        draw() {
            this.redrawChildren();
        }
    }
    exports.RootTile = RootTile;
});
define("Playfield/Playfield", ["require", "exports", "Utils/index", "Graphics/index", "Playfield/RootTile"], function (require, exports, Utils_2, Graphics_2, RootTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playfield = void 0;
    class Playfield {
        constructor(canvasId) {
            this._lastTime = 0;
            this._delay = 0;
            this._count = 0;
            this._busy = false;
            this._timerId = 0;
            this._canvas = document.querySelector(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this._gfx = new Graphics_2.Gfx(this._ctx);
            this._gparms = new Graphics_2.GfxParms();
            this._rect = new Utils_2.Rect(0, 0, this._canvas.width, this._canvas.height);
            this._tile = new RootTile_1.RootTile(0, 0, this.rect.w, this.rect.h, this);
            this._logger = new Utils_2.Logger();
            // const dpr = window.devicePixelRatio;
            // const rect = this._canvas.getBoundingClientRect();
            // // Set the "actual" size of the canvas
            // this._canvas.width = rect.width * dpr;
            // this._canvas.height = rect.height * dpr;
            // // Scale the context to ensure correct drawing operations
            // this._ctx.scale(dpr, dpr);
            // // Set the "drawn" size of the canvas
            // this._canvas.style.width = `${rect.width}px`;
            // this._canvas.style.height = `${rect.height}px`;
        }
        get playfield() {
            return this;
        }
        get tile() {
            return this._tile;
        }
        get rect() {
            return this._rect;
        }
        get gparms() {
            return this._gparms;
        }
        get gfx() {
            return this._gfx;
        }
        clear() {
            this.gfx.rect(0, 0, this._canvas.width, this._canvas.height, this.gparms);
        }
        redraw() {
            this.clear();
            this.tile.redraw();
        }
        tick() {
            // note: what if the time to process one 'tick' is greater than the delay?
            if (this._busy)
                console.error("INTERRUPTED WHILE BUSY!");
            clearTimeout(this._timerId);
            this._count = 0;
            this._busy = true;
            let now = Date.now();
            let extra = now - this._lastTime;
            this.tile.tick(); // process all ticks
            this.redraw(); // redraw the playfield
            this._lastTime = Date.now();
            let delta = this._lastTime - now;
            // if (delta > this._delay) console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
            // if (this._count >= 5000) {
            console.log(`NOTE: The tick() processing time is: (${delta}ms aka ${1000 / delta} fps) and the _delay is: (${this._delay}ms aka ${1000 / this._delay} fps). There is ${extra}ms between frames`);
            console.log(`NOTE: This is ${this._count / delta * 1000} objects per second`);
            //     this._count = 0;
            // }
            console.log(this._count);
            this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
            this._busy = false;
        }
        start(delay = 125) {
            this._delay = delay;
            this._lastTime = Date.now();
            this.redraw();
            // note: what if the time to process one 'tick' is greater than the delay?
            this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile"], function (require, exports, Playfield_1, Tile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_2.Tile; } });
});
define("Test/BoxTestTile", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTestTile = void 0;
    class BoxTestTile extends Playfield_2.Tile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
            this.gparms.borderColor = "red";
            this.gparms.color = "blue";
            this.gparms.fillColor = "green";
        }
        draw() {
            this._playfield.gfx.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h, this.gparms);
            this._playfield._count++;
        }
        tick() {
            let obj = this;
            this.rmove(obj.DX || 10, obj.DY || 10);
            if (this.X > this._playfield.rect.w || this.X <= 0) {
                if (obj.DX === undefined)
                    this.rmove(-this.x, 0);
                else
                    obj.DX = -obj.DX;
            }
            if (this.Y > this._playfield.rect.h || this.Y <= 0) {
                if (obj.DY === undefined)
                    this.rmove(0, -this.y);
                else
                    obj.DY = -obj.DY;
            }
            // notice - does not move children
        }
        go() {
            throw new Error("Method not implemented.");
        }
    }
    exports.BoxTestTile = BoxTestTile;
});
define("Test/CircleTestTile", ["require", "exports", "Test/BoxTestTile"], function (require, exports, BoxTestTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTestTile = void 0;
    class CircleTestTile extends BoxTestTile_1.BoxTestTile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
            this.gparms.borderColor = "red";
            this.gparms.color = "blue";
            this.gparms.fillColor = "green";
        }
        draw() {
            this._playfield.gfx.circle(this.rect.x, this.rect.y, this.rect.w, this.gparms);
            this._playfield._count++;
        }
    }
    exports.CircleTestTile = CircleTestTile;
});
define("Test/PlayfieldTest", ["require", "exports", "Playfield/index", "Test/CircleTestTile", "Test/BoxTestTile", "Utils/index"], function (require, exports, Playfield_3, CircleTestTile_1, BoxTestTile_2, Utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldTest = void 0;
    class PlayfieldTest {
        constructor() {
            this._playfield = new Playfield_3.Playfield("#my_canvas");
        }
        boxTest() {
            this._playfield._gfx.rect(10, 10, 100, 100, this._playfield.gparms);
        }
        circleTestTile() {
            let parent = this._playfield.tile;
            let circleTile = new CircleTestTile_1.CircleTestTile("circle", parent, parent.rect.w / 2, parent.rect.h / 2, 50, 50);
            this._playfield.start();
        }
        groupTestTile() {
            let parent = this._playfield.tile;
            let lcircle = new CircleTestTile_1.CircleTestTile("left", parent, -75, +75, 50);
            let rcircle = new CircleTestTile_1.CircleTestTile("right", parent, +75, +75, 50);
            lcircle.gparms.fillColor = "red";
            rcircle.gparms.fillColor = "red";
            let llcircle = new CircleTestTile_1.CircleTestTile("left", lcircle, -50, 50, 50, 50);
            let lrcircle = new CircleTestTile_1.CircleTestTile("right", lcircle, +50, 50, 50, 50);
            llcircle.gparms.fillColor = "blue";
            lrcircle.gparms.fillColor = "blue";
            let rlcircle = new CircleTestTile_1.CircleTestTile("left", rcircle, -50, 50, 50, 50);
            let rrcircle = new CircleTestTile_1.CircleTestTile("right", rcircle, +50, 50, 50, 50);
            rlcircle.gparms.fillColor = "green";
            rrcircle.gparms.fillColor = "green";
            this._playfield.start();
        }
        tenthousandTestTile() {
            let parent = this._playfield.tile;
            let max = 100;
            for (let i = 0; i < max; i++) {
                for (let j = 0; j < 1000; j++) {
                    let x = (0, Utils_3.random)(0, this._playfield.rect.w);
                    let y = (0, Utils_3.random)(0, this._playfield.rect.h);
                    let r = (0, Utils_3.random)(10, 50);
                    let DX = (0, Utils_3.random)(-10, 10);
                    let DY = (0, Utils_3.random)(-10, 10);
                    let circle = new BoxTestTile_2.BoxTestTile("circle", parent, x, y, r, r);
                    // circle.gparms.fillColor = null;
                    circle.DX = DX;
                    circle.DY = DY;
                }
            }
            max *= 1000;
            // let fps = 1;
            // let delay = Math.floor(1000/fps);
            let delay = 0;
            let fps = 1000 / delay;
            console.log({ fps, delay, max });
            this._playfield.start(delay);
            // note: processing 10,000 Circles stressed the app at 55 FPS
            // note: processing 10,000 Boxes stressed the app at 142 FPS
            // note: processing 10,000 Empty Boxes stressed the app at 250 FPS
            // note: at 30FPS, about 18,500 circles could be processed
            // note: at 30FPS, about 20,000 boxes could be processed
            // note: at 30FPS, about 45,000 empty boxes could be processed
            // note: at 60FPS, about 8700 circles could be processed
            // note: at 60FPS, about 20,000 boxes could be processed
            // note: at 60FPS, about 28,000 empty boxes could be processed
            // 5,000,000 empty boxes per second
            // 2,000,000 filled boxes per second
            // 1,428,571 empty circles per second
            // 714,000 filled circles per second
            // 1 fps: 16ms/62.5fps
            // 2 fps: 16ms/62.5fps
            // 4 fps: 16ms/62.5fps
            // 8 fps: 13ms/77fps
            // 15 fps: 7ms/143fps
        }
    }
    exports.PlayfieldTest = PlayfieldTest;
});
//# sourceMappingURL=PlayfieldGraphics.js.map
define(function (require) {
    console.log("Main.js...");
    var TestClass = require("Test/PlayfieldTest").PlayfieldTest;
    console.log(TestClass);
    let main = new TestClass();
    // main.boxTest();
    // main.circleTestTile();
    // main.groupTestTile();
    main.tenthousandTestTile();
 });
 