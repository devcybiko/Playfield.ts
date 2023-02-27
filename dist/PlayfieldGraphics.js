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
        constructor() {
            this._x = 0;
            this._y = 0;
            this._w = 0;
            this._h = 0;
        }
        Rect(x, y, w, h) {
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
        move(x, y) {
            this.x = x;
            this.y = y;
        }
        rmove(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
        size(w, h) {
            this.w = w;
            this.h = h;
        }
        rsize(dw, dh) {
            this.w += dw;
            this.h += dh;
        }
    }
    exports.Rect = Rect;
});
define("Utils/Tree", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
    class Tree {
        constructor() {
            this._children = Array();
        }
        Tree(name, parent) {
            this._name = name;
            if (parent)
                parent.add(this);
        }
        get parent() {
            return this._parent;
        }
        get name() {
            return this._name;
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
define("Utils/Mixins", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyMixins = void 0;
    function applyMixins(derivedCtor, constructors) {
        constructors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null));
            });
        });
    }
    exports.applyMixins = applyMixins;
});
define("Utils/index", ["require", "exports", "Utils/Logger", "Utils/Functions", "Utils/Rect", "Utils/Tree", "Utils/Mixins"], function (require, exports, Logger_1, Functions_1, Rect_1, Tree_1, Mixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyMixins = exports.Tree = exports.Rect = exports.snapTo = exports.random = exports.inclusive = exports.between = exports.Logger = void 0;
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_1.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_1.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_1.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_1.snapTo; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_1.Rect; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return Tree_1.Tree; } });
    Object.defineProperty(exports, "applyMixins", { enumerable: true, get: function () { return Mixins_1.applyMixins; } });
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
define("Playfield/Draggable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/Events/Mouseable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/Events/Keyboardable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile", "Playfield/Dragger"], function (require, exports, Tile_1, Dragger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = void 0;
    /**
     * The RootTile has some special capabilities
     */
    class RootTile extends Tile_1.Tile {
        constructor(x, y, w, h, playfield) {
            super("_root", null, x, y, w, h, playfield);
            this._dragger = new Dragger_1.Dragger(this);
        }
        KeyDown(event) {
            return false;
        }
        KeyUp(event) {
            return false;
        }
        OrdinaryKey(event) {
            return false;
        }
        SpecialKey(event) {
            return false;
        }
        Shift(event) {
            return false;
        }
        Meta(event) {
            return false;
        }
        MetaKey(event) {
            return false;
        }
        Alt(event) {
            return false;
        }
        AltKey(event) {
            return false;
        }
        Control(event) {
            return false;
        }
        ControlKey(event) {
            return false;
        }
        Backspace(event) {
            return false;
        }
        UpperCase(event) {
            return false;
        }
        LowerCase(event) {
            return false;
        }
        Digit(event) {
            return false;
        }
        Punctuation(event) {
            return false;
        }
        FunctionKey(event) {
            return false;
        }
        ArrowUp(event) {
            return false;
        }
        ArrowDown(event) {
            return false;
        }
        ArrowLeft(event) {
            return false;
        }
        ArrowRight(event) {
            return false;
        }
        defaultKey(event) {
            return false;
        }
        MouseUp(event) {
            return this._dragger.MouseUp(event);
        }
        MouseDown(event) {
            return this._dragger.MouseDown(event);
        }
        MenuUp(event) {
            return false;
        }
        MenuDown(event) {
            return false;
        }
        MiddleUp(event) {
            return false;
        }
        MiddleDown(event) {
            return false;
        }
        WheelUp(event, delta) {
            return false;
        }
        WheelDown(event, delta) {
            return false;
        }
        MouseMove(event) {
            return this._dragger.MouseMove(event);
        }
        get dragger() {
            return this._dragger;
        }
        draw() {
            this.redrawChildren();
        }
    }
    exports.RootTile = RootTile;
});
define("Playfield/Events/KeyboardDispatcher", ["require", "exports", "Utils/index"], function (require, exports, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyboardDispatcher = void 0;
    class KeyboardDispatcher {
        constructor(obj, options = {}) {
            this._doKeyDown = true;
            this._doKeyUp = false;
            this._obj = obj;
            this._logger = new Utils_1.Logger("log");
            this._doKeyDown = options.doKeyDown || this._doKeyDown;
            this._doKeyUp = options.doKeyUp || this._doKeyUp;
        }
        dispatchEvent(event) {
            if (event.key !== undefined)
                return this.dispatchKeyboardEvent(event);
            else
                return this.dispatchUnknownKeyboardEvent(event);
        }
        dispatchUnknownKeyboardEvent(event) {
            this._logger.error("dispatchUnknownKeyboardEvent:", event);
        }
        dispatchKeyboardEvent(event) {
            this._logger.log("dispatchKeyboardEvent:", event);
            let obj = this._obj;
            let stop = false;
            if (event.type === "keydown" && this._doKeyDown) {
                stop = obj.KeyDown(event);
                stop = this.dispatchMoreKeys(event);
            }
            if (!stop && event.type === "keyup" && this._doKeyUp) {
                stop = obj.KeyUp(event);
                stop = this.dispatchMoreKeys(event);
            }
        }
        dispatchMoreKeys(event) {
            this._logger.log("dispatchMoreKeys:", event);
            let key = event.key;
            let obj = this._obj;
            let stop = false;
            if (key.length > 1)
                return obj.SpecialKey(event);
            else if (key.length === 1 && event.ctrlKey)
                return obj.ControlKey(event);
            else if (key.length === 1 && event.metaKey)
                return obj.MetaKey(event);
            else if (key.length === 1 && event.altKey)
                return obj.AltKey(event);
            else if (key.length === 1)
                return obj.OrdinaryKey(event);
            else
                return obj.defaultKey(event);
        }
        OrdinaryKey(event) {
            this._logger.log("OrdinaryKey:", event);
            let key = event.key;
            let obj = this._obj;
            if ((0, Utils_1.inclusive)("A", key, "Z"))
                return obj.UpperCase(event);
            else if ((0, Utils_1.inclusive)("a", key, "z"))
                return obj.LowerCase(event);
            else if ((0, Utils_1.inclusive)("0", key, "9"))
                return obj.Digit(event);
            else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key))
                return obj.Punctuation(event);
            else
                return obj.defaultKey(event);
        }
        SpecialKey(event) {
            this._logger.log("SpecialKey:", event);
            let key = event.key;
            let obj = this._obj;
            if (key === "ArrowUp")
                return obj.ArrowUp(event);
            else if (key === "ArrowDown")
                return obj.ArrowDown(event);
            else if (key === "ArrowLeft")
                return obj.ArrowLeft(event);
            else if (key === "ArrowRight")
                return obj.ArrowRight(event);
            else if (key === "ArrowLeft")
                return obj.ArrowLeft(event);
            else if (key === "Shift")
                return obj.Shift(event);
            else if (key === "Meta")
                return obj.Meta(event);
            else if (key === "Alt")
                return obj.Alt(event);
            else if (key === "Control")
                return obj.Control(event);
            else if (key === "Backspace")
                return obj.Backspace(event);
            else if (key[0] === "F")
                return obj.FunctionKey(event);
            else
                return obj.defaultKey(event);
        }
    }
    exports.KeyboardDispatcher = KeyboardDispatcher;
});
/**
* Event Hierarchy
- handleEvent
- handleMouseEvent
- MouseDown (left button only)
- MouseUp (left button only)
- MenuDown (right button only)
- MenuUp (right button only)
- MiddleDown (middle button only)
- MiddleUp (middle button only)
- WheelDown (wheel scrolling)
- WheelUp (wheel scrolling)
- handleMouseMove
- handleKeyboardEvent
- keydown:
- SpecialKey (Shift, Meta, Alt, Control)
- ArrowUp
- ArrowDown
- ArrowRight
- ArrowLeft
- Meta
- Shift
- Alt
- Control
- Backspace
- FunctionKey
- defaultKey
- ControlKey (Control-xxx)
- MetaKey (Meta-xxx)
- AltKey (Alt-xxx)
- OrdinaryKey (a-z, A-Z, etc...)
- UpperCase
- LowerCase
- Digit
- Punctuation
- defaultKey
- defaultKey (any others)
- defaultKey (keyup, etc...)
- handleUnknownEvent
*
*/ 
define("Playfield/Events/MouseDispatcher", ["require", "exports", "Utils/index"], function (require, exports, Utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseDispatcher = void 0;
    class MouseDispatcher {
        constructor(obj, options = {}) {
            this._obj = obj;
            this._logger = new Utils_2.Logger("log");
        }
        dispatchEvent(event) {
            if (event.button !== undefined)
                return this.dispatchMouseEvent(event);
        }
        dispatchUnknownMouseEvent(event) {
            this._logger.error("dispatchUnknownMouseEvent:", event);
        }
        dispatchMouseEvent(event) {
            this._logger.info("dispatchMouseEvent:", event);
            let obj = this._obj;
            if (!obj)
                return this._logger.error('ERROR: mousemove not associated with an object');
            if (event.type === "mousedown") {
                if (event.button === 0)
                    return obj.MouseDown(event);
                if (event.button === 1)
                    return obj.MiddleDown(event);
                if (event.button === 2)
                    return obj.MenuDown(event);
            }
            else if (event.type === "mouseup") {
                if (event.button === 0)
                    return obj.MouseUp(event);
                if (event.button === 1)
                    return obj.MiddleUp(event);
                if (event.button === 2)
                    return obj.MenuUp(event);
            }
            else if (event.type === "mousemove") {
                return obj.MouseMove(event);
            }
            else if (event.type === "wheel") {
                if (event.wheelDelta >= 0)
                    return obj.WheelDown(event, event.wheelDelta);
                if (event.wheelDelta < 0)
                    return obj.WheelUp(event, -event.wheelDelta);
            }
            else {
                return this.dispatchUnknownMouseEvent(event);
            }
        }
    }
    exports.MouseDispatcher = MouseDispatcher;
});
/**
* Event Hierarchy
- handleEvent
- handleMouseEvent
- MouseDown (left button only)
- MouseUp (left button only)
- MenuDown (right button only)
- MenuUp (right button only)
- MiddleDown (middle button only)
- MiddleUp (middle button only)
- WheelDown (wheel scrolling)
- WheelUp (wheel scrolling)
- handleMouseMove
- handleKeyboardEvent
- keydown:
- SpecialKey (Shift, Meta, Alt, Control)
- ArrowUp
- ArrowDown
- ArrowRight
- ArrowLeft
- Meta
- Shift
- Alt
- Control
- Backspace
- FunctionKey
- defaultKey
- ControlKey (Control-xxx)
- MetaKey (Meta-xxx)
- AltKey (Alt-xxx)
- OrdinaryKey (a-z, A-Z, etc...)
- UpperCase
- LowerCase
- Digit
- Punctuation
- defaultKey
- defaultKey (any others)
- defaultKey (keyup, etc...)
- handleUnknownEvent
*
*/ 
define("Playfield/Events/CanvasEventHandler", ["require", "exports", "Utils/index", "Playfield/Events/KeyboardDispatcher", "Playfield/Events/MouseDispatcher"], function (require, exports, Utils_3, KeyboardDispatcher_1, MouseDispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CanvasEventHandler = void 0;
    class CanvasEventHandler {
        constructor(canvas, obj) {
            this._logger = new Utils_3.Logger("warn");
            this._obj = obj;
            this._registerEventHandlers(canvas);
        }
        _registerEventHandlers(canvas) {
            if (this._obj.MouseDown) {
                this._mouseDispatcher = new MouseDispatcher_1.MouseDispatcher(this._obj);
                canvas.addEventListener('mousedown', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
                canvas.addEventListener('mousemove', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
                canvas.addEventListener('mouseup', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
                canvas.addEventListener('wheel', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher), false);
            }
            else if (this._obj.KeyDown) {
                this._keyboardDispatcher = new KeyboardDispatcher_1.KeyboardDispatcher(this._obj);
                addEventListener("keydown", this._keyboardDispatcher.dispatchEvent.bind(this._keyboardDispatcher));
                addEventListener("keyup", this._keyboardDispatcher.dispatchEvent.bind(this._keyboardDispatcher));
            }
        }
    }
    exports.CanvasEventHandler = CanvasEventHandler;
});
define("Playfield/Playfield", ["require", "exports", "Utils/index", "Graphics/index", "Playfield/RootTile", "Playfield/Events/CanvasEventHandler"], function (require, exports, Utils_4, Graphics_1, RootTile_1, CanvasEventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playfield = exports._Playfield = void 0;
    /**
     * Playfield is a graphic area for rendering
     * And it collects human inputs and dispatches them to tiles
     * A Playfield has a tree of Tiles (rectangles)
     */
    class _Playfield {
    }
    exports._Playfield = _Playfield;
    ;
    ;
    (0, Utils_4.applyMixins)(_Playfield, [Utils_4.Rect, Utils_4.Tree]);
    class Playfield extends _Playfield {
        constructor(canvasId) {
            super();
            this._lastTime = 0;
            this._delay = 0;
            this._timerId = 0;
            this._canvas = document.querySelector(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this._gfx = new Graphics_1.Gfx(this._ctx);
            this._gparms = new Graphics_1.GfxParms();
            this.Rect(0, 0, this._canvas.width, this._canvas.height);
            this._rootTile = new RootTile_1.RootTile(0, 0, this.w, this.h, this);
            this._logger = new Utils_4.Logger();
            this._canvasEventHandler = new CanvasEventHandler_1.CanvasEventHandler(this._canvas, this._rootTile);
        }
        get playfield() {
            return this;
        }
        get tile() {
            return this._rootTile;
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
            clearTimeout(this._timerId);
            let now = Date.now();
            let extra = now - this._lastTime;
            this.tile.tick(); // process all ticks
            this.redraw(); // redraw the playfield
            this._lastTime = Date.now();
            let delta = this._lastTime - now;
            if (delta > this._delay)
                console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
            this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
        }
        start(delay = 125) {
            this._delay = delay;
            this._lastTime = Date.now();
            this.redraw();
            this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/Tile", ["require", "exports", "Utils/index", "Graphics/index"], function (require, exports, Utils_5, Graphics_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = exports._Tile = void 0;
    class _Tile {
    }
    exports._Tile = _Tile;
    ;
    ;
    (0, Utils_5.applyMixins)(_Tile, [Utils_5.Rect, Utils_5.Tree]);
    class Tile extends _Tile {
        constructor(name, parent, x, y, w, h, playfield = parent._playfield) {
            super();
            this.Tree(name, this);
            this.Rect(x, y, w, h);
            this._gparms = new Graphics_2.GfxParms();
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
        get X() {
            return this.x + this.gparms.dx;
        }
        get Y() {
            return this.y + this.gparms.dy;
        }
        // add(child: Tile) {
        // super.add(child);
        // child._playfield = this._playfield;
        // }
        inBounds(x, y) {
            let result = (0, Utils_5.between)(this.X, x, this.Y + this.w) &&
                (0, Utils_5.between)(this.Y, y, this.Y + this.h);
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
        drawAll() {
            this.redraw();
            for (let child of this.children) {
                child.drawAll();
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
            this.children.forEach(child => child.tick());
        }
        go() {
            throw new Error("Method not implemented.");
        }
    }
    exports.Tile = Tile;
});
define("Playfield/Dragger", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dragger = void 0;
    class Dragger {
        ;
        constructor(obj) {
            this._obj = obj;
        }
        MouseDown(event) {
            console.log("MouseDown", event);
            for (let _child of this._obj.children.reverse()) {
                let child = _child;
                if (child.inBounds && child.inBounds(event.x, event.y) && child.grab) {
                    this._dragObj = child;
                    if (child.click)
                        child.click(event);
                    if (child.grab)
                        child.grab(event);
                    this._dragX = event.offsetX;
                    this._dragY = event.offsetY;
                    return true;
                }
            }
        }
        MouseUp(event) {
            if (this._dragObj) {
                this._dragObj.drop();
                this._dragObj = null;
                return true;
            }
        }
        MouseMove(event) {
            if (this._dragObj) {
                let dx = this._dragX - event.offsetX;
                let dy = this._dragY - event.offsetY;
                this._dragX = event.offsetX;
                this._dragY = event.offsetY;
                this._dragObj.drag(dx, dy);
            }
            return false;
        }
        MenuUp(event) {
            throw new Error("Method not implemented.");
        }
        MenuDown(event) {
            throw new Error("Method not implemented.");
        }
        MiddleUp(event) {
            throw new Error("Method not implemented.");
        }
        MiddleDown(event) {
            throw new Error("Method not implemented.");
        }
        WheelUp(event, delta) {
            throw new Error("Method not implemented.");
        }
        WheelDown(event, delta) {
            throw new Error("Method not implemented.");
        }
    }
    exports.Dragger = Dragger;
});
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile"], function (require, exports, Playfield_1, Tile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_2.Tile; } });
});
define("Playfield/Shapes/ShapeTile", ["require", "exports", "Playfield/index"], function (require, exports, __1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShapeTile = void 0;
    class ShapeTile extends __1.Tile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
        }
    }
    exports.ShapeTile = ShapeTile;
});
define("Playfield/Shapes/BoxTile", ["require", "exports", "Playfield/Shapes/ShapeTile"], function (require, exports, ShapeTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTile = void 0;
    class BoxTile extends ShapeTile_1.ShapeTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
        }
        grab() {
            console.log("grab", this.name);
            return true;
        }
        drag(dx, dy) {
            this.rmove(-dx, -dy);
            return true;
        }
        drop() {
            return true;
        }
        draw() {
            this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        }
    }
    exports.BoxTile = BoxTile;
});
define("Playfield/Shapes/CircleTile", ["require", "exports", "Playfield/Shapes/ShapeTile"], function (require, exports, ShapeTile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = void 0;
    class CircleTile extends ShapeTile_2.ShapeTile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
        }
        draw() {
            this._playfield.gfx.circle(this.x, this.y, this.w, this.gparms);
        }
    }
    exports.CircleTile = CircleTile;
});
define("Playfield/Shapes/Clickable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/Shapes/index", ["require", "exports", "Playfield/Shapes/BoxTile", "Playfield/Shapes/CircleTile", "Playfield/Shapes/ShapeTile"], function (require, exports, BoxTile_1, CircleTile_1, ShapeTile_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShapeTile = exports.CircleTile = exports.BoxTile = void 0;
    Object.defineProperty(exports, "BoxTile", { enumerable: true, get: function () { return BoxTile_1.BoxTile; } });
    Object.defineProperty(exports, "CircleTile", { enumerable: true, get: function () { return CircleTile_1.CircleTile; } });
    Object.defineProperty(exports, "ShapeTile", { enumerable: true, get: function () { return ShapeTile_3.ShapeTile; } });
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
            this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        }
        tick() {
            let obj = this;
            this.rmove(obj.DX || 10, obj.DY || 10);
            if (this.X > this._playfield.w || this.X <= 0) {
                if (obj.DX === undefined)
                    this.rmove(-this.x, 0);
                else
                    obj.DX = -obj.DX;
            }
            if (this.Y > this._playfield.h || this.Y <= 0) {
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
            this._playfield.gfx.circle(this.x, this.y, this.w, this.gparms);
        }
    }
    exports.CircleTestTile = CircleTestTile;
});
define("Test/PlayfieldTest", ["require", "exports", "Playfield/index", "Test/CircleTestTile", "Test/BoxTestTile", "Utils/index", "Playfield/Shapes/index"], function (require, exports, Playfield_3, CircleTestTile_1, BoxTestTile_2, Utils_6, Shapes_1) {
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
            let circleTile = new CircleTestTile_1.CircleTestTile("circle", parent, parent.w / 2, parent.h / 2, 50, 50);
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
                    let x = (0, Utils_6.random)(0, this._playfield.w);
                    let y = (0, Utils_6.random)(0, this._playfield.h);
                    let r = (0, Utils_6.random)(10, 50);
                    let DX = (0, Utils_6.random)(-10, 10);
                    let DY = (0, Utils_6.random)(-10, 10);
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
        shapeTest() {
            let parent = this._playfield.tile;
            let circleTile = new Shapes_1.CircleTile("circle", parent, 50, 50, 50);
            let boxTile = new Shapes_1.BoxTile("box", parent, 100, 100, 50, 50);
            this._playfield.start();
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
    // main.tenthousandTestTile();
    main.shapeTest();
 });
 