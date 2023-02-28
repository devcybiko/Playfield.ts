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
define("Utils/RectMixin", ["require", "exports"], function (require, exports) {
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
define("Utils/TreeMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
    class Tree {
        Tree(name, parent) {
            this._name = name;
            this._children = [];
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
            if (obj) {
                let i = this._children.indexOf(obj);
                if (i === -1)
                    return;
                this._children.splice(i, 1);
                this._children.push(obj);
            }
            else {
                this.parent.toFront(this);
            }
        }
        toBack(obj) {
            if (obj) {
                let i = this._children.indexOf(obj);
                if (i === -1)
                    return;
                this._children.splice(i, 1);
                this._children.splice(0, 0, obj);
            }
            else {
                this.parent.toBack(this);
            }
        }
    }
    exports.Tree = Tree;
});
define("Utils/LoggerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    class Logger {
        // INFO ==> INFO, LOG, WARN, ERROR
        // LOG  ==> LOG, WARN, ERROR
        // WARN ==> WARN, ERROR
        // ERROR==> ERROR
        Logger(logLevel = "error", uselink = true) {
            this._level = logLevel;
            this._uselink = uselink;
            return this;
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
define("Utils/index", ["require", "exports", "Utils/Mixins", "Utils/Functions", "Utils/RectMixin", "Utils/TreeMixin", "Utils/LoggerMixin"], function (require, exports, Mixins_1, Functions_1, RectMixin_1, TreeMixin_1, LoggerMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = exports.Tree = exports.Rect = exports.snapTo = exports.random = exports.inclusive = exports.between = exports.applyMixins = void 0;
    Object.defineProperty(exports, "applyMixins", { enumerable: true, get: function () { return Mixins_1.applyMixins; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_1.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_1.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_1.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_1.snapTo; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return RectMixin_1.Rect; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return TreeMixin_1.Tree; } });
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return LoggerMixin_1.Logger; } });
});
define("Graphics/Gfx", ["require", "exports", "Graphics/GfxParms", "Utils/index"], function (require, exports, GfxParms_1, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Gfx = void 0;
    Utils = __importStar(Utils);
    class Gfx {
        constructor(ctx) {
            this.logger = new Utils.Logger();
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
    exports.Tile = exports._Tile = void 0;
    /**
     * A Tile is a rectangular item on a Playfield.
     * It can draw itself on the Playfield
    * It has its own set of GfxParms (font, colors, x/y offset)`
     * it can move around
     * it is hierarcically organized so is drawn relative to its parent
     */
    class _Tile {
    }
    exports._Tile = _Tile;
    ;
    ;
    (0, Utils_1.applyMixins)(_Tile, [Utils_1.Logger, Utils_1.Tree, Utils_1.Rect]);
    ;
    class Tile extends _Tile {
        constructor(name, parent, x, y, w, h, playfield = parent._playfield) {
            super();
            this.Tree(name, parent);
            this.Rect(x, y, w, h);
            this.Logger("info");
            this._gparms = new Graphics_1.GfxParms();
            this._playfield = playfield;
            return this;
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
            let result = (0, Utils_1.between)(this.X, x, this.X + this.w) &&
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
define("Playfield/Abilities/DraggableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draggable = void 0;
    class Draggable {
        Draggable() {
        }
        onGrab(event) {
            let that = this;
            console.log("grab", that.name);
            return true;
        }
        onDrag(dx, dy, event) {
            let that = this;
            if (that.rmove)
                that.rmove(dx, dy);
            return true;
        }
        onDrop(event) {
            return true;
        }
    }
    exports.Draggable = Draggable;
});
define("Playfield/Events/MyEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyEvent = void 0;
    class MyEvent {
        constructor(x, y, button, type, wheelDelta) {
            this._x = x;
            this._y = y;
            if (button === 0)
                this._button = "select";
            if (button === 1)
                this._button = "middle";
            if (button === 2)
                this._button = "menu";
            this._type = type;
            this._wheelDelta = wheelDelta;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get button() {
            return this._button;
        }
        get type() {
            return this._type;
        }
        get wheelDelta() {
            return this._wheelDelta;
        }
    }
    exports.MyEvent = MyEvent;
});
define("Playfield/Abilities/DraggerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dragger = void 0;
    ;
    class Dragger {
        Dragger() {
            return this;
        }
        _grabChild(child, myEvent) {
            if (!this._dragObj) {
                this._dragObj = child;
                child.onGrab(myEvent);
                this._dragX = myEvent.x;
                this._dragY = myEvent.y;
                return true;
            }
            return false;
        }
        _dragChild(myEvent) {
            if (this._dragObj) {
                this._dragObj.onDrag(myEvent.x - this._dragX, myEvent.y - this._dragY);
                this._dragX = myEvent.x;
                this._dragY = myEvent.y;
                return true;
            }
            return false;
        }
        _dropChild(myEvent) {
            if (this._dragObj) {
                let dragObj = this._dragObj;
                this._dragObj = null;
                dragObj.onDrop(myEvent);
                return true;
            }
            return false;
        }
    }
    exports.Dragger = Dragger;
});
define("Playfield/Abilities/SelectableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selectable = void 0;
    class Selectable {
        Selectable() {
            return this;
        }
        onSelected(event) {
            let that = this;
            this._isSelected = true;
            return true;
        }
        onUnselected(event) {
            let that = this;
            this._isSelected = false;
            return true;
        }
        get isSelected() {
            return this._isSelected;
        }
    }
    exports.Selectable = Selectable;
});
define("Playfield/Events/KeyboardableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Keyboardable = void 0;
    class Keyboardable {
        KeyDown(myEvent) {
            return false;
        }
        KeyUp(myEvent) {
            return false;
        }
        OrdinaryKey(myEvent) {
            return false;
        }
        SpecialKey(myEvent) {
            return false;
        }
        Shift(myEvent) {
            return false;
        }
        Meta(myEvent) {
            return false;
        }
        MetaKey(myEvent) {
            return false;
        }
        Alt(myEvent) {
            return false;
        }
        AltKey(myEvent) {
            return false;
        }
        Control(myEvent) {
            return false;
        }
        ControlKey(myEvent) {
            return false;
        }
        Backspace(myEvent) {
            return false;
        }
        UpperCase(myEvent) {
            return false;
        }
        LowerCase(myEvent) {
            return false;
        }
        Digit(myEvent) {
            return false;
        }
        Punctuation(myEvent) {
            return false;
        }
        FunctionKey(myEvent) {
            return false;
        }
        ArrowUp(myEvent) {
            return false;
        }
        ArrowDown(myEvent) {
            return false;
        }
        ArrowLeft(myEvent) {
            return false;
        }
        ArrowRight(myEvent) {
            return false;
        }
        defaultKey(myEvent) {
            return false;
        }
    }
    exports.Keyboardable = Keyboardable;
});
define("Playfield/Events/KeyboardDispatcher", ["require", "exports", "Utils/index"], function (require, exports, Utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyboardDispatcher = void 0;
    class KeyboardDispatcher {
        constructor(obj, options = {}) {
            this._doKeyDown = true;
            this._doKeyUp = false;
            this._obj = obj;
            this._logger = new Utils_2.Logger();
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
            if ((0, Utils_2.inclusive)("A", key, "Z"))
                return obj.UpperCase(event);
            else if ((0, Utils_2.inclusive)("a", key, "z"))
                return obj.LowerCase(event);
            else if ((0, Utils_2.inclusive)("0", key, "9"))
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
define("Playfield/Events/MouseableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mouseable = void 0;
    class Mouseable {
        MouseDown(event) {
            return false;
        }
        MouseMove(event) {
            return false;
        }
        MouseUp(event) {
            return false;
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
    }
    exports.Mouseable = Mouseable;
});
define("Playfield/Events/MouseDispatcher", ["require", "exports", "Utils/index", "Playfield/Events/MyEvent"], function (require, exports, Utils_3, MyEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseDispatcher = void 0;
    class MouseDispatcher {
        constructor(obj, options = {}) {
            this._obj = obj;
            this._logger = new Utils_3.Logger();
        }
        _myEvent(event) {
            let myEvent = new MyEvent_1.MyEvent(event.offsetX, event.offsetY, event.button, event.type);
            return myEvent;
        }
        dispatchEvent(event) {
            let myEvent = this._myEvent(event);
            if (event.button !== undefined)
                return this.dispatchMouseEvent(myEvent);
            else
                return this.dispatchUnknownMouseEvent(event);
        }
        dispatchUnknownMouseEvent(event) {
            this._logger.error("dispatchUnknownMouseEvent:", event);
        }
        dispatchMouseEvent(myEvent) {
            this._logger.warn("dispatchMouseEvent:", myEvent);
            let obj = this._obj;
            if (!obj)
                return this._logger.error('ERROR: mousemove not associated with an object');
            if (myEvent.type === "mousedown") {
                if (myEvent.button === "select")
                    return obj.MouseDown(myEvent);
                if (myEvent.button === "middle")
                    return obj.MiddleDown(myEvent);
                if (myEvent.button === "menu")
                    return obj.MenuDown(myEvent);
            }
            else if (myEvent.type === "mouseup") {
                if (myEvent.button === "select")
                    return obj.MouseUp(myEvent);
                if (myEvent.button === "middle")
                    return obj.MiddleUp(myEvent);
                if (myEvent.button === "menu")
                    return obj.MenuUp(myEvent);
            }
            else if (myEvent.type === "mousemove") {
                return obj.MouseMove(myEvent);
            }
            else if (myEvent.type === "wheel") {
                if (myEvent.wheelDelta >= 0)
                    return obj.WheelDown(myEvent, myEvent.wheelDelta);
                if (myEvent.wheelDelta < 0)
                    return obj.WheelUp(myEvent, -myEvent.wheelDelta);
            }
            else {
                return this.dispatchUnknownMouseEvent(myEvent);
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
define("Playfield/Events/CanvasEventHandler", ["require", "exports", "Utils/index", "Playfield/Events/KeyboardDispatcher", "Playfield/Events/MouseDispatcher"], function (require, exports, Utils_4, KeyboardDispatcher_1, MouseDispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CanvasEventHandler = void 0;
    class CanvasEventHandler {
        constructor(canvas, obj) {
            this._logger = new Utils_4.Logger();
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
define("Playfield/Events/index", ["require", "exports", "Playfield/Events/CanvasEventHandler", "Playfield/Events/KeyboardableMixin", "Playfield/Events/KeyboardDispatcher", "Playfield/Events/MouseableMixin", "Playfield/Events/MouseDispatcher", "Playfield/Events/MyEvent"], function (require, exports, CanvasEventHandler_1, KeyboardableMixin_1, KeyboardDispatcher_2, MouseableMixin_1, MouseDispatcher_2, MyEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyEvent = exports.MouseDispatcher = exports.Mouseable = exports.KeyboardDispatcher = exports.Keyboardable = exports.CanvasEventHandler = void 0;
    Object.defineProperty(exports, "CanvasEventHandler", { enumerable: true, get: function () { return CanvasEventHandler_1.CanvasEventHandler; } });
    Object.defineProperty(exports, "Keyboardable", { enumerable: true, get: function () { return KeyboardableMixin_1.Keyboardable; } });
    Object.defineProperty(exports, "KeyboardDispatcher", { enumerable: true, get: function () { return KeyboardDispatcher_2.KeyboardDispatcher; } });
    Object.defineProperty(exports, "Mouseable", { enumerable: true, get: function () { return MouseableMixin_1.Mouseable; } });
    Object.defineProperty(exports, "MouseDispatcher", { enumerable: true, get: function () { return MouseDispatcher_2.MouseDispatcher; } });
    Object.defineProperty(exports, "MyEvent", { enumerable: true, get: function () { return MyEvent_2.MyEvent; } });
});
define("Playfield/Abilities/SelecterMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selecter = void 0;
    ;
    class Selecter {
        Selecter() {
            return this;
        }
        _selectChild(child, myEvent) {
            this._unselectChild(myEvent);
            this._selectedObj = child;
            child._isSelected = true;
            child.onSelected(myEvent);
            return true;
        }
        _unselectChild(myEvent) {
            if (this._selectedObj) {
                this._selectedObj._isSelected = false;
                this._selectedObj.onUnselected(myEvent);
                return true;
            }
            return false;
        }
    }
    exports.Selecter = Selecter;
});
define("Playfield/Abilities/ClickableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clickable = void 0;
    class Clickable {
        Clickable() {
            return this;
        }
        onClick(event) {
            let that = this;
            if (that.log)
                that.log("onClicked", that.name);
            return true;
        }
    }
    exports.Clickable = Clickable;
});
define("Playfield/Abilities/ClickerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clicker = void 0;
    ;
    class Clicker {
        Clicker() {
            return this;
        }
        _clickChild(child, myEvent) {
            child.onClick(myEvent);
            return true;
        }
    }
    exports.Clicker = Clicker;
});
define("Playfield/Abilities/index", ["require", "exports", "Playfield/Abilities/DraggerMixin", "Playfield/Abilities/DraggableMixin", "Playfield/Abilities/SelectableMixin", "Playfield/Abilities/SelecterMixin", "Playfield/Abilities/ClickerMixin", "Playfield/Abilities/ClickableMixin"], function (require, exports, DraggerMixin_1, DraggableMixin_1, SelectableMixin_1, SelecterMixin_1, ClickerMixin_1, ClickableMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clickable = exports.Clicker = exports.Selecter = exports.Selectable = exports.Draggable = exports.Dragger = void 0;
    Object.defineProperty(exports, "Dragger", { enumerable: true, get: function () { return DraggerMixin_1.Dragger; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return DraggableMixin_1.Draggable; } });
    Object.defineProperty(exports, "Selectable", { enumerable: true, get: function () { return SelectableMixin_1.Selectable; } });
    Object.defineProperty(exports, "Selecter", { enumerable: true, get: function () { return SelecterMixin_1.Selecter; } });
    Object.defineProperty(exports, "Clicker", { enumerable: true, get: function () { return ClickerMixin_1.Clicker; } });
    Object.defineProperty(exports, "Clickable", { enumerable: true, get: function () { return ClickableMixin_1.Clickable; } });
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Events/index", "Utils/index"], function (require, exports, Tile_1, Abilities_1, Events_1, Utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = exports._RootTile = void 0;
    /**
     * The RootTile has some special capabilities
     */
    class _RootTile extends Tile_1.Tile {
    }
    exports._RootTile = _RootTile;
    ;
    ;
    (0, Utils_5.applyMixins)(_RootTile, [Events_1.Keyboardable, Events_1.Mouseable, Abilities_1.Clicker, Abilities_1.Selecter, Abilities_1.Dragger, Utils_5.Logger]);
    class RootTile extends _RootTile {
        constructor(x, y, w, h, playfield) {
            super("_root", null, x, y, w, h, playfield);
            this.Dragger();
            this.Selecter();
            this.Logger("info", false);
        }
        draw() {
            this.redrawChildren();
        }
        MouseMove(myEvent) {
            this._dragChild(myEvent);
            return true;
        }
        MouseDown(myEvent) {
            this.warn(myEvent);
            let that = this;
            let children = that.children.reverse();
            this.warn(children);
            for (let _child of that.children.reverse()) {
                let child = _child;
                if (child.inBounds && child.inBounds(myEvent.x, myEvent.y)) {
                    this.warn("Found...", child);
                    if (child.onGrab)
                        this._grabChild(child, myEvent);
                    if (child.onSelected)
                        this._selectChild(child, myEvent);
                    if (child.onClick)
                        this._clickChild(child, myEvent);
                }
            }
            return false;
        }
        MouseUp(myEvent) {
            this._dropChild(myEvent);
            return true;
        }
    }
    exports.RootTile = RootTile;
});
define("Playfield/Playfield", ["require", "exports", "Utils/index", "Graphics/index", "Playfield/RootTile", "Playfield/Events/CanvasEventHandler"], function (require, exports, Utils_6, Graphics_2, RootTile_1, CanvasEventHandler_2) {
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
    (0, Utils_6.applyMixins)(_Playfield, [Utils_6.Logger, Utils_6.Rect]);
    class Playfield extends _Playfield {
        constructor(canvasId) {
            super();
            this._lastTime = 0;
            this._delay = 0;
            this._timerId = 0;
            this._canvas = document.querySelector(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this._gfx = new Graphics_2.Gfx(this._ctx);
            this._gparms = new Graphics_2.GfxParms();
            this.Rect(0, 0, this._canvas.width, this._canvas.height);
            this._rootTile = new RootTile_1.RootTile(0, 0, this.w, this.h, this);
            this._canvasEventHandler = new CanvasEventHandler_2.CanvasEventHandler(this._canvas, this._rootTile);
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
            if (this._delay && (delta > this._delay))
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
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile", "Playfield/Abilities/DraggerMixin", "Playfield/Abilities/DraggableMixin"], function (require, exports, Playfield_1, Tile_2, DraggerMixin_2, DraggableMixin_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draggable = exports.Dragger = exports.Tile = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_2.Tile; } });
    Object.defineProperty(exports, "Dragger", { enumerable: true, get: function () { return DraggerMixin_2.Dragger; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return DraggableMixin_2.Draggable; } });
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
define("Playfield/Shapes/BoxTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Utils/index", "Playfield/Abilities/index"], function (require, exports, ShapeTile_1, Utils_7, Abilities_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTile = exports._BoxTile = void 0;
    class _BoxTile extends ShapeTile_1.ShapeTile {
    }
    exports._BoxTile = _BoxTile;
    ;
    ;
    (0, Utils_7.applyMixins)(_BoxTile, [Abilities_2.Draggable, Abilities_2.Selectable]);
    class BoxTile extends _BoxTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._colors = ["red", "orange", "green", "blue", "indigo", "violet"];
            this._color = 0;
            this.Draggable();
            this.Selectable();
        }
        onGrab() {
            this.toFront();
            return true;
        }
        onClick() {
            this._color = (this._color + 1) % this._colors.length;
            this.warn(this._color);
        }
        draw() {
            if (this.isSelected)
                this.gparms.borderColor = "black";
            else
                this.gparms.borderColor = "";
            this.gparms.fillColor = this._colors[this._color];
            this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        }
        onDrop() {
            this.toFront();
            return true;
        }
    }
    exports.BoxTile = BoxTile;
});
define("Playfield/Shapes/CircleTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Abilities/DraggableMixin", "Utils/index"], function (require, exports, ShapeTile_2, DraggableMixin_3, Utils_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = exports._CircleTile = void 0;
    class _CircleTile extends ShapeTile_2.ShapeTile {
    }
    exports._CircleTile = _CircleTile;
    ;
    ;
    (0, Utils_8.applyMixins)(_CircleTile, [DraggableMixin_3.Draggable]);
    class CircleTile extends _CircleTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._dx = 0;
            this._dy = 0;
            this.Draggable();
        }
        onGrab(event) {
            this._dx = this.X - event.x;
            this._dy = this.Y - event.y;
            this.toFront();
            return true;
        }
        draw() {
            this._playfield.gfx.circle(this.x, this.y, this.w, this.gparms);
            if (this._dx && this._dy) {
                let oldColor = this.gparms.fillColor;
                this.gparms.fillColor = "red";
                let r = Math.floor(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
                this._playfield.gfx.circle(this.x, this.y, r, this.gparms);
                this.gparms.fillColor = oldColor;
            }
        }
        onDrop() {
            this.toFront();
            this._dx = 0;
            this._dy = 0;
            return true;
        }
        inBounds(x, y) {
            let dx = this.X - x;
            let dy = this.Y - y;
            let dr = dx * dx + dy * dy;
            let dw = this.w * this.w;
            if (dr <= dw)
                return this;
            for (let child of this.children.reverse()) {
                let found = child.inBounds(x, y);
                if (found)
                    return found;
            }
            return null;
        }
    }
    exports.CircleTile = CircleTile;
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
define("Test/PlayfieldTest", ["require", "exports", "Playfield/index", "Test/CircleTestTile", "Test/BoxTestTile", "Utils/index", "Playfield/Shapes/index"], function (require, exports, Playfield_3, CircleTestTile_1, BoxTestTile_2, Utils_9, Shapes_1) {
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
                    let x = (0, Utils_9.random)(0, this._playfield.w);
                    let y = (0, Utils_9.random)(0, this._playfield.h);
                    let r = (0, Utils_9.random)(10, 50);
                    let DX = (0, Utils_9.random)(-10, 10);
                    let DY = (0, Utils_9.random)(-10, 10);
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
            let circleTile = new Shapes_1.CircleTile("circle", parent, 50, 50, 50, 50);
            let boxTile = new Shapes_1.BoxTile("box", parent, 100, 100, 50, 50);
            let boxTile2 = new Shapes_1.BoxTile("box", parent, 200, 200, 50, 50);
            this._playfield.start(0);
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
 