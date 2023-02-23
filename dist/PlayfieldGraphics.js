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
            this.xOffset = 0;
            this.yOffset = 0;
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
        constructor(name, parent, obj) {
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
                this.ctx.fillRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
            }
            if (gparms.borderColor) {
                this.ctx.strokeStyle = gparms.borderColor;
                this.ctx.strokeRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
            }
        }
        ellipse(x, y, w, h, gparms = this.gparms) {
            if (gparms.fillColor) {
                this.ctx.beginPath();
                this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this.ctx.fillStyle = gparms.fillColor;
                this.ctx.fill();
            }
            if (gparms.borderColor) {
                this.ctx.beginPath();
                this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this.ctx.strokeStyle = gparms.borderColor;
                this.ctx.stroke();
            }
        }
        circle(x, y, r, gparms = this.gparms) {
            this.ellipse(x - r, y - r, r, r, gparms);
        }
        line(x0, y0, x1, y1, gparms = this.gparms) {
            this.logger.info("line", x0, y0, x1, y1);
            this.ctx.beginPath();
            this.ctx.strokeStyle = gparms.color;
            this.ctx.moveTo(gparms.xOffset + x0, gparms.yOffset + y0);
            this.ctx.lineTo(gparms.xOffset + x1, gparms.yOffset + y1);
            this.ctx.stroke();
        }
        text(msg, x = 0, y = 0, gparms = this.gparms) {
            this.ctx.fillStyle = gparms.color;
            this.ctx.font = gparms.font;
            this.ctx.textAlign = gparms.textAlign;
            this.ctx.textBaseline = gparms.textBaseline;
            this.ctx.fillText(msg, gparms.xOffset + x, gparms.yOffset + y);
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
            region.rect(x + gparms.xOffset, y + gparms.yOffset, w, h);
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
            this._tree = new Utils_1.Tree(name, parent ? parent.tree : null, this);
            this._rect = new Utils_1.Rect(x, y, w, h);
            this._gparms = new Graphics_1.GfxParms();
            this._playfield = playfield;
        }
        get rect() {
            return this._rect;
        }
        get tree() {
            return this._tree;
        }
        get gparms() {
            return this._gparms;
        }
        inBounds(x, y) {
            let result = (0, Utils_1.between)(this.gparms.xOffset + this.rect.x, x, this.gparms.xOffset + this.rect.x + this.rect.w) &&
                (0, Utils_1.between)(this.gparms.yOffset + this.rect.y, y, this.gparms.yOffset + this.rect.y + this.rect.h);
            if (result)
                return this;
            for (let child of this.tree.children.reverse()) {
                let found = child.obj.inBounds(x, y);
                if (found)
                    return found;
            }
            return null;
        }
        _recompute() {
            let parentTile = this.tree.parentObj;
            if (parentTile) {
                let parentGparms = parentTile.gparms;
                this.gparms.xOffset = parentTile.rect.x + parentGparms.xOffset;
                this.gparms.yOffset = parentTile.rect.y + parentGparms.yOffset;
            }
        }
        add(tile) {
            this.tree.add(tile.tree);
            tile._playfield = this._playfield;
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
            this._recompute();
            this.draw();
            for (let child of this.tree.children) {
                child.obj.drawAll();
            }
        }
        draw() {
            throw new Error("Method not implemented.");
        }
        tick() {
            throw new Error("Method not implemented.");
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
            this._playfield.clear();
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
            this._canvas = document.querySelector(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this._gfx = new Graphics_2.Gfx(this._ctx);
            this._gparms = new Graphics_2.GfxParms();
            this._rect = new Utils_2.Rect(0, 0, this._canvas.width, this._canvas.height);
            this._tile = new RootTile_1.RootTile(0, 0, this.rect.w, this.rect.h, this);
            this._logger = new Utils_2.Logger();
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
            this.tile.drawAll();
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
define("Test/CircleTile", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = void 0;
    class CircleTile extends Playfield_2.Tile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
        }
        draw() {
            this.gparms.borderColor = "red";
            this.gparms.color = "blue";
            this.gparms.fillColor = "green";
            this._playfield.gfx.circle(this.rect.x, this.rect.y, this.rect.w, this.gparms);
        }
        tick() {
            throw new Error("Method not implemented.");
        }
        go() {
            throw new Error("Method not implemented.");
        }
    }
    exports.CircleTile = CircleTile;
});
define("Test/PlayfieldTest", ["require", "exports", "Playfield/index", "Test/CircleTile"], function (require, exports, Playfield_3, CircleTile_1) {
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
        tileTest() {
            let parent = this._playfield.tile;
            let circleTile = new CircleTile_1.CircleTile("_root", parent, parent.rect.w / 2, parent.rect.h / 2, 50, 50);
            this._playfield.redraw();
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
    main.tileTest();
 });
 