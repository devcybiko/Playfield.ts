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
define("Mixins/Mixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Mixins/Base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Base = void 0;
    class Base {
        constructor() {
            this._any = this;
        }
        get any() {
            return this._any;
        }
        is(name) {
            // synonym for isa()
            return this.isa(name);
        }
        isa(name) {
            if (typeof this.any[name] === "function") {
                return true;
            }
            else {
                return false;
            }
        }
    }
    exports.Base = Base;
});
define("Mixins/Named", ["require", "exports", "Mixins/Base"], function (require, exports, Base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Named = exports.NamedClass = exports.NamedBase = void 0;
    exports.NamedBase = Named(Base_1.Base);
    class NamedClass extends exports.NamedBase {
    }
    exports.NamedClass = NamedClass;
    ;
    function Named(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._name = null;
            }
            Named(name) {
                this._name = name;
            }
            get name() {
                return this._name;
            }
            set name(s) {
                this._name = s;
            }
        };
    }
    exports.Named = Named;
});
define("Mixins/Tree", ["require", "exports", "Mixins/Base"], function (require, exports, Base_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = exports.TreeClass = exports.TreeBase = void 0;
    exports.TreeBase = Tree(Base_2.Base);
    class TreeClass extends exports.TreeBase {
    }
    exports.TreeClass = TreeClass;
    ;
    function Tree(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._parent = null;
                this._children = Array();
            }
            Tree(parent) {
                this._parent = parent;
            }
            parent() {
                return this._parent;
            }
            add(obj) {
                obj._parent = this;
                this._children.push(obj);
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
                return false;
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
        };
    }
    exports.Tree = Tree;
});
define("Mixins/Rect", ["require", "exports", "Mixins/Base"], function (require, exports, Base_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = exports.RectClass = exports.RectBase = void 0;
    exports.RectBase = Rect(Base_3.Base);
    class RectClass extends exports.RectBase {
    }
    exports.RectClass = RectClass;
    ;
    function Rect(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                // Mixins may not declare private/protected properties
                // however, you can use ES2020 private fields
                this._x = 0;
                this._y = 0;
                this._w = 0;
                this._h = 0;
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
            Rect(x, y, w, h) {
                this._x = x;
                this._y = y;
                this._h = h;
                this._w = w;
            }
        };
    }
    exports.Rect = Rect;
});
define("Mixins/index", ["require", "exports", "Mixins/Named", "Mixins/Tree", "Mixins/Rect", "Mixins/Base"], function (require, exports, Named_1, Tree_1, Rect_1, Base_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Base = exports.RectClass = exports.Rect = exports.TreeClass = exports.Tree = exports.NamedClass = exports.Named = void 0;
    Object.defineProperty(exports, "Named", { enumerable: true, get: function () { return Named_1.Named; } });
    Object.defineProperty(exports, "NamedClass", { enumerable: true, get: function () { return Named_1.NamedClass; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return Tree_1.Tree; } });
    Object.defineProperty(exports, "TreeClass", { enumerable: true, get: function () { return Tree_1.TreeClass; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_1.Rect; } });
    Object.defineProperty(exports, "RectClass", { enumerable: true, get: function () { return Rect_1.RectClass; } });
    Object.defineProperty(exports, "Base", { enumerable: true, get: function () { return Base_4.Base; } });
});
define("Utils/Loggable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Loggable = exports.LoggableClass = exports.LoggableBase = void 0;
    exports.LoggableBase = Loggable(Mixins_1.Base);
    class LoggableClass extends exports.LoggableBase {
    }
    exports.LoggableClass = LoggableClass;
    ;
    function Loggable(_base) {
        return class extends _base {
            Loggable(logLevel = "error", uselink = true) {
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
        };
    }
    exports.Loggable = Loggable;
});
define("Utils/Logger", ["require", "exports", "Utils/Loggable"], function (require, exports, Loggable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    class Logger extends Loggable_1.LoggableClass {
        constructor(logLevel = "warn", uselink = true) {
            super();
            this.Loggable(logLevel, uselink);
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
define("Utils/index", ["require", "exports", "Utils/Loggable", "Utils/Logger", "Utils/Functions"], function (require, exports, Loggable_2, Logger_1, Functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.snapTo = exports.random = exports.inclusive = exports.between = exports.Logger = exports.LoggableClass = exports.Loggable = void 0;
    Object.defineProperty(exports, "Loggable", { enumerable: true, get: function () { return Loggable_2.Loggable; } });
    Object.defineProperty(exports, "LoggableClass", { enumerable: true, get: function () { return Loggable_2.LoggableClass; } });
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_1.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_1.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_1.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_1.snapTo; } });
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
define("Playfield/Capabilities/Movable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Movable = exports.MovableClass = exports.MovableBase = void 0;
    exports.MovableBase = Movable(Mixins_2.Base);
    class MovableClass extends exports.MovableBase {
    }
    exports.MovableClass = MovableClass;
    ;
    function Movable(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._x = 0;
                this._y = 0;
            }
            Movable(x, y) {
                this._x = x;
                this._y = y;
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
            move(x, y) {
                this.x = x;
                this.y = y;
            }
            rmove(dx, dy) {
                this.x += dx;
                this.y += dy;
            }
        };
    }
    exports.Movable = Movable;
});
define("Playfield/Capabilities/Draggable", ["require", "exports", "Utils/index", "Mixins/index"], function (require, exports, Utils, Mixins_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draggable = exports.DraggableClass = exports.DraggleBase = void 0;
    Utils = __importStar(Utils);
    exports.DraggleBase = Draggable(Mixins_3.Base);
    class DraggableClass extends exports.DraggleBase {
    }
    exports.DraggableClass = DraggableClass;
    ;
    function Draggable(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._origX = 0; // original x
                this._origY = 0; // original y
                this._snap = 10;
                this._isDraggable = true;
            }
            Dragabble(snap = 10) {
                this._snap = snap;
            }
            get isDraggable() {
                return this._isDraggable;
            }
            set isDraggable(b) {
                this._isDraggable = b;
            }
            drag(dx, dy) {
                let newX = Utils.snapTo(this._origX + dx, this._snap);
                let newY = Utils.snapTo(this._origY + dy, this._snap);
                this.any.move(newX, newY);
            }
            grab() {
                this._origX = this.any.x;
                this._origY = this.any.y;
            }
            drop() {
            }
        };
    }
    exports.Draggable = Draggable;
});
define("Playfield/Capabilities/Drawable", ["require", "exports", "Mixins/index", "Graphics/index"], function (require, exports, Mixins_4, Graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Drawable = exports.DrawableClass = exports.DrawableBase = void 0;
    exports.DrawableBase = Drawable(Mixins_4.Base);
    class DrawableClass extends exports.DrawableBase {
    }
    exports.DrawableClass = DrawableClass;
    ;
    function Drawable(_base) {
        return class extends _base {
            Drawable(ctx) {
                this._gfx = new Graphics_1.Gfx(ctx);
                this._gparms = new Graphics_1.GfxParms();
            }
            get gfx() {
                return this._gfx;
            }
            set gfx(g) {
                this._gfx = g;
            }
            get gparms() {
                return this._gparms;
            }
            set gparms(g) {
                this._gparms = g;
            }
        };
    }
    exports.Drawable = Drawable;
});
define("Playfield/Capabilities/Selectable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selectable = exports.SelectableClass = exports.SelectableBase = void 0;
    exports.SelectableBase = Selectable(Mixins_5.Base);
    class SelectableClass extends exports.SelectableBase {
    }
    exports.SelectableClass = SelectableClass;
    ;
    function Selectable(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._isSelected = false;
            }
            Selectable() {
            }
            get isSelected() {
                return this._isSelected;
            }
            set isSelected(n) {
                this._isSelected = n;
            }
            select() {
                this.isSelected = true;
            }
            deselect() {
                this.isSelected = false;
            }
        };
    }
    exports.Selectable = Selectable;
});
define("Playfield/Capabilities/Clickable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clickable = exports.ClickableClass = exports.ClickableBase = void 0;
    exports.ClickableBase = Clickable(Mixins_6.Base);
    class ClickableClass extends exports.ClickableBase {
    }
    exports.ClickableClass = ClickableClass;
    ;
    function Clickable(_base) {
        return class extends _base {
            Clickable() {
            }
            click(x, y) {
                this.any.info("CLICK! " + this.any.name + ": " + x + "," + y);
            }
        };
    }
    exports.Clickable = Clickable;
});
define("Playfield/EventHandlers/EventDispatcher", ["require", "exports", "Utils/index"], function (require, exports, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDispatcher = void 0;
    class EventDispatcher {
        constructor(obj, options = {}) {
            this._doKeyDown = true;
            this._doKeyUp = false;
            this._obj = obj;
            this._logger = new Utils_1.Logger("log");
            this._doKeyDown = options.doKeyDown || this._doKeyDown;
            this._doKeyUp = options.doKeyUp || this._doKeyUp;
        }
        dispatchEvent(event) {
            if (event.button !== undefined)
                return this.dispatchMouseEvent(event);
            else if (event.key !== undefined)
                return this.dispatchKeyboardEvent(event);
            else
                return this.dispatchUnknownEvent(event);
        }
        dispatchUnknownEvent(event) {
            this._logger.error("dispatchUnknownEvent:", event);
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
                return this.dispatchUnknownEvent(event);
            }
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
    exports.EventDispatcher = EventDispatcher;
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
define("Playfield/EventHandlers/CanvasEventHandler", ["require", "exports", "Utils/index", "Playfield/EventHandlers/EventDispatcher"], function (require, exports, Utils_2, EventDispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CanvasEventHandler = void 0;
    class CanvasEventHandler {
        constructor(canvas, obj) {
            this._logger = new Utils_2.Logger("warn");
            this._obj = obj;
            this._eventDispatcher = new EventDispatcher_1.EventDispatcher(obj);
            this._registerEventHandlers(canvas);
        }
        _registerEventHandlers(canvas) {
            canvas.addEventListener('mousedown', this._eventDispatcher.dispatchEvent.bind(this));
            canvas.addEventListener('mousemove', this._eventDispatcher.dispatchEvent.bind(this));
            canvas.addEventListener('mouseup', this._eventDispatcher.dispatchEvent.bind(this));
            canvas.addEventListener('wheel', this._eventDispatcher.dispatchEvent.bind(this), false);
            addEventListener("keydown", this._eventDispatcher.dispatchEvent.bind(this));
            addEventListener("keyup", this._eventDispatcher.dispatchEvent.bind(this));
        }
    }
    exports.CanvasEventHandler = CanvasEventHandler;
});
define("Playfield/PlayfieldEventHandler", ["require", "exports", "Utils/index", "Playfield/EventHandlers/EventDispatcher"], function (require, exports, Utils, EventDispatcher_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEventHandler = void 0;
    Utils = __importStar(Utils);
    class PlayfieldEventHandler extends EventDispatcher_2.EventDispatcher {
        constructor(playfield, canvas) {
            super(playfield, canvas);
            this.logger = new Utils.Logger("warn");
            this._registerEventHandlers(canvas);
        }
        _registerEventHandlers(canvas) {
            canvas.addEventListener('mousedown', this.dispatchEvent.bind(this));
            canvas.addEventListener('mousemove', this.dispatchEvent.bind(this));
            canvas.addEventListener('mouseup', this.dispatchEvent.bind(this));
            canvas.addEventListener('wheel', this.dispatchEvent.bind(this), false);
            addEventListener("keydown", this.dispatchEvent.bind(this));
        }
        dispatchKeyboardEvent(event) {
            if (this.playfield.focusedObj && this.playfield.focusedObj.any.eventHandler) {
                this.playfield.focusedObj.any.eventHandler.handleEvent(event);
            }
        }
        MouseMove(event, playfield, canvas) {
            playfield.dragObj(event.offsetX, event.offsetY);
        }
        MouseUp(event, playfield, canvas) {
            playfield.dropObj();
        }
        MouseDown(event, playfield, convas) {
            let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
            this.logger.log("MouseDown", obj);
            playfield.selectObj(obj);
            if (obj) {
                obj.click(event.offsetX, event.offsetY);
                playfield.grabObj(obj, event.offsetX, event.offsetY, !event.shiftKey);
            }
        }
    }
    exports.PlayfieldEventHandler = PlayfieldEventHandler;
});
define("Playfield/EventHandlers/Capabilities/MouseEnabled", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseEnabled = exports.MouseEnabledClass = exports.MouseEnabledBase = void 0;
    exports.MouseEnabledBase = MouseEnabled(Mixins_7.Base);
    class MouseEnabledClass extends exports.MouseEnabledBase {
    }
    exports.MouseEnabledClass = MouseEnabledClass;
    ;
    function MouseEnabled(_base) {
        return class extends _base {
            MouseEnabled() {
            }
            MouseUp(event) {
                this.any.log("MouseUp:", event);
            }
            MouseDown(event) {
                this.any.log("MouseDown:", event);
            }
            MenuUp(event) {
                this.any.log("MenuUp:", event);
            }
            MenuDown(event) {
                this.any.log("MenuDown:", event);
            }
            MiddleUp(event) {
                this.any.log("MiddleUp:", event);
            }
            MiddleDown(event) {
                this.any.log("MiddleDown:", event);
            }
            WheelUp(event, delta) {
                this.any.log("WheelUp:", delta, event);
            }
            WheelDown(event, delta) {
                this.any.log("WheelDown:", delta, event);
            }
            MouseMove(event) {
                this.any.log("MouseMove:", event);
            }
        };
    }
    exports.MouseEnabled = MouseEnabled;
});
define("Playfield/EventHandlers/Capabilities/index", ["require", "exports", "Playfield/EventHandlers/Capabilities/MouseEnabled"], function (require, exports, MouseEnabled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseEnabledClass = exports.MouseEnabled = void 0;
    Object.defineProperty(exports, "MouseEnabled", { enumerable: true, get: function () { return MouseEnabled_1.MouseEnabled; } });
    Object.defineProperty(exports, "MouseEnabledClass", { enumerable: true, get: function () { return MouseEnabled_1.MouseEnabledClass; } });
});
define("Playfield/Playfield", ["require", "exports", "Utils/index", "Mixins/index", "Playfield/EventHandlers/CanvasEventHandler", "Playfield/Capabilities/index", "Playfield/EventHandlers/Capabilities/index"], function (require, exports, Utils_3, Mixins_8, CanvasEventHandler_1, Capabilities_1, Capabilities_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playfield = void 0;
    const PlayfieldBase = (0, Capabilities_2.MouseEnabled)((0, Capabilities_1.Playable)((0, Utils_3.Loggable)((0, Capabilities_1.Drawable)((0, Mixins_8.Named)((0, Mixins_8.Tree)((0, Mixins_8.Rect)(Mixins_8.Base)))))));
    class Playfield extends PlayfieldBase {
        constructor(canvasId) {
            super();
            this._grabX = 0;
            this._grabY = 0;
            this._canvas = document.querySelector(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this.Named("_playfield");
            this.Rect(0, 0, this._ctx.canvas.clientWidth, this._ctx.canvas.clientHeight);
            this.Tree(null);
            this.Loggable();
            this.Drawable(this._ctx);
            this.Playable(this);
            this.MouseEnabled();
            this._selectedObj = null;
            this._focusedObj = null;
            this._eventHandler = new CanvasEventHandler_1.CanvasEventHandler(this._canvas, this);
            this._dragObj = null;
            this._body = document.querySelector('body');
            this._body.playfield = this;
        }
        get selectedObj() {
            return this._selectedObj;
        }
        set selectedObj(obj) {
            this._selectedObj = obj;
        }
        get focusedObj() {
            return this._focusedObj;
        }
        set focusedObj(obj) {
            this._focusedObj = obj;
        }
        selectObj(obj) {
            if (this._selectedObj)
                this._selectedObj.deselect();
            this._selectedObj = obj;
            if (obj !== null)
                obj.select();
        }
        focusObj(obj) {
            if (this._focusedObj)
                this._focusedObj.defocus();
            this.focusedObj = obj;
            if (obj !== null)
                obj.focus();
        }
        add(obj) {
            super.add(obj);
            obj.playfield = this;
            obj.gfx = this.gfx;
        }
        grabObj(obj, x, y, toFront) {
            if (obj && obj.isDraggable) {
                this.dropObj();
                if (toFront)
                    this.toFront(obj);
                else
                    this.toBack(obj);
                this._dragObj = obj;
                this._grabX = x;
                this._grabY = y;
                obj.grab();
            }
        }
        dragObj(x, y) {
            if (this._dragObj) {
                let dx = x - this._grabX;
                let dy = y - this._grabY;
                this.info(dx, dy);
                this._dragObj.drag(dx, dy);
            }
        }
        dropObj() {
            if (this._dragObj)
                this._dragObj.drop();
            this._dragObj = null;
        }
        recompute() {
            //for Actor compatibility
        }
        draw() {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            // for partial actor compatibility
        }
        drawObj(obj) {
            // visitor method for drawAll()
            obj.recompute();
            obj.draw();
        }
        drawAll() {
            this.dfs(this.drawObj);
        }
        findObjInBounds(x, y) {
            for (let i = this._children.length - 1; i >= 0; i--) {
                let obj = this._children[i];
                let found = obj.inBounds(x, y);
                if (found)
                    return found;
            }
            return null;
        }
        handleKeyDown(event) {
            let playfield = event.srcElement.playfield;
            if (!playfield)
                return this.error("ERROR: keydown not associated with a playfield");
            if (playfield._selectedObj)
                playfield._selectedObj.any.keydown(event.key);
        }
        timer() {
            this.goAll();
            this.drawAll();
        }
        start() {
            this.drawAll();
            setInterval(this.timer.bind(this), 125, this);
        }
        goAll() {
            for (let obj of this._children)
                obj.go();
        }
        collisions(theObj) {
            let results = [];
            for (let obj of this._children) {
                if (theObj === obj)
                    continue;
                if (obj.inBounds(theObj.x, theObj.y) ||
                    obj.inBounds(theObj.x + theObj.w, theObj.y) ||
                    obj.inBounds(theObj.x, theObj.y + theObj.h) ||
                    obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
                    results.push(obj);
            }
            return results;
        }
        MouseMove(event, playfield, canvas) {
            playfield.dragObj(event.offsetX, event.offsetY);
        }
        MouseUp(event, playfield, canvas) {
            playfield.dropObj();
        }
        MouseDown(event, playfield, convas) {
            let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
            this.logger.log("MouseDown", obj);
            playfield.selectObj(obj);
            if (obj) {
                obj.click(event.offsetX, event.offsetY);
                playfield.grabObj(obj, event.offsetX, event.offsetY, !event.shiftKey);
            }
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/Capabilities/Playable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playable = exports.PlayableClass = exports.PlayableBase = void 0;
    ;
    exports.PlayableBase = Playable(Mixins_9.Base);
    class PlayableClass extends exports.PlayableBase {
    }
    exports.PlayableClass = PlayableClass;
    ;
    function Playable(_base) {
        return class extends _base {
            Playable(playfield) {
                this.playfield = playfield;
            }
            get playfield() {
                return this._playfield;
            }
            set playfield(p) {
                this._playfield = p;
            }
        };
    }
    exports.Playable = Playable;
});
define("Playfield/Capabilities/Focusable", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Focusable = exports.FocusableClass = exports.FocusableBase = void 0;
    exports.FocusableBase = Focusable(Mixins_10.Base);
    class FocusableClass extends exports.FocusableBase {
    }
    exports.FocusableClass = FocusableClass;
    ;
    function Focusable(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._hasFocus = false;
            }
            Focusable() {
            }
            get hasFocus() {
                return this._hasFocus;
            }
            set hasFocus(n) {
                this._hasFocus = n;
            }
            focus() {
                this.hasFocus = true;
            }
            defocus() {
                this.hasFocus = false;
            }
        };
    }
    exports.Focusable = Focusable;
});
define("Playfield/Capabilities/index", ["require", "exports", "Playfield/Capabilities/Draggable", "Playfield/Capabilities/Movable", "Playfield/Capabilities/Drawable", "Playfield/Capabilities/Selectable", "Playfield/Capabilities/Clickable", "Playfield/Capabilities/Playable", "Playfield/Capabilities/Focusable"], function (require, exports, Draggable_1, Movable_1, Drawable_1, Selectable_1, Clickable_1, Playable_1, Focusable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FocusableClass = exports.Focusable = exports.PlayableClass = exports.Playable = exports.ClickableClass = exports.Clickable = exports.SelectableClass = exports.Selectable = exports.DrawableClass = exports.Drawable = exports.MovableClass = exports.Movable = exports.DraggableClass = exports.Draggable = void 0;
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return Draggable_1.Draggable; } });
    Object.defineProperty(exports, "DraggableClass", { enumerable: true, get: function () { return Draggable_1.DraggableClass; } });
    Object.defineProperty(exports, "Movable", { enumerable: true, get: function () { return Movable_1.Movable; } });
    Object.defineProperty(exports, "MovableClass", { enumerable: true, get: function () { return Movable_1.MovableClass; } });
    Object.defineProperty(exports, "Drawable", { enumerable: true, get: function () { return Drawable_1.Drawable; } });
    Object.defineProperty(exports, "DrawableClass", { enumerable: true, get: function () { return Drawable_1.DrawableClass; } });
    Object.defineProperty(exports, "Selectable", { enumerable: true, get: function () { return Selectable_1.Selectable; } });
    Object.defineProperty(exports, "SelectableClass", { enumerable: true, get: function () { return Selectable_1.SelectableClass; } });
    Object.defineProperty(exports, "Clickable", { enumerable: true, get: function () { return Clickable_1.Clickable; } });
    Object.defineProperty(exports, "ClickableClass", { enumerable: true, get: function () { return Clickable_1.ClickableClass; } });
    Object.defineProperty(exports, "Playable", { enumerable: true, get: function () { return Playable_1.Playable; } });
    Object.defineProperty(exports, "PlayableClass", { enumerable: true, get: function () { return Playable_1.PlayableClass; } });
    Object.defineProperty(exports, "Focusable", { enumerable: true, get: function () { return Focusable_1.Focusable; } });
    Object.defineProperty(exports, "FocusableClass", { enumerable: true, get: function () { return Focusable_1.FocusableClass; } });
});
define("Playfield/Actor", ["require", "exports", "Utils/index", "Mixins/index", "Playfield/Capabilities/index"], function (require, exports, Utils_4, Mixins_11, Capabilities_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Actor = void 0;
    const ActorBase = (0, Capabilities_3.Focusable)((0, Capabilities_3.Playable)((0, Capabilities_3.Clickable)((0, Capabilities_3.Drawable)((0, Utils_4.Loggable)((0, Mixins_11.Named)((0, Mixins_11.Tree)((0, Mixins_11.Rect)((0, Capabilities_3.Movable)((0, Capabilities_3.Draggable)((0, Capabilities_3.Selectable)(Mixins_11.Base)))))))))));
    class Actor extends ActorBase {
        constructor(parent, name, x, y, w, h) {
            super();
            this.Named(name);
            this.Rect(x, y, w, h);
            this.Tree(null);
            this.Movable(x, y);
            this.Dragabble();
            this.Selectable();
            this.Focusable();
            this.Loggable();
            this.Playable(parent.playfield);
            this.eventHandler = null;
            this.Drawable(this.playfield._ctx);
            parent.add(this);
        }
        X() {
            return this.x + this.gparms.xOffset;
        }
        Y() {
            return this.y + this.gparms.yOffset;
        }
        inBounds(x, y) {
            let result = (0, Utils_4.between)(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
                (0, Utils_4.between)(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
            if (result)
                return this;
            for (let i = this._children.length - 1; i >= 0; i--) {
                let obj = this._children[i];
                let found = obj.inBounds(x, y);
                if (found)
                    return found;
            }
            return null;
        }
        keydown(key) {
            if (key === "ArrowUp")
                this.y = this.y - 10;
            if (key === "ArrowDown")
                this.y = this.y + 10;
            if (key === "ArrowLeft")
                this.x = this.x - 10;
            if (key === "ArrowRight")
                this.x = this.x + 10;
        }
        go() {
        }
        recompute() {
            let parentGparms = this.parent().gparms;
            if (parentGparms) {
                this.gparms.xOffset = this.parent().x + parentGparms.xOffset;
                this.gparms.yOffset = this.parent().y + parentGparms.yOffset;
            }
        }
        drawAll() {
            this.draw();
            for (let obj of this._children)
                obj.drawAll();
        }
        draw() {
        }
    }
    exports.Actor = Actor;
});
define("Playfield/index", ["require", "exports", "Playfield/Actor", "Playfield/Capabilities/Draggable", "Playfield/EventHandlers/EventDispatcher", "Playfield/Playfield", "Playfield/PlayfieldEventHandler"], function (require, exports, Actor_1, Draggable_2, EventDispatcher_3, Playfield_1, PlayfieldEventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEventHandler = exports.Playfield = exports.EventHandler = exports.Draggable = exports.Actor = void 0;
    Object.defineProperty(exports, "Actor", { enumerable: true, get: function () { return Actor_1.Actor; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return Draggable_2.Draggable; } });
    Object.defineProperty(exports, "EventHandler", { enumerable: true, get: function () { return EventDispatcher_3.EventDispatcher; } });
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "PlayfieldEventHandler", { enumerable: true, get: function () { return PlayfieldEventHandler_1.PlayfieldEventHandler; } });
});
define("Jed/Item", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = void 0;
    class Item extends Playfield_2.Actor {
        constructor(parent, name, value, x, y, w, h) {
            super(parent, name, x, y, w, h);
            this._value = value;
        }
        value(newValue) {
            if (newValue !== undefined)
                this._value = newValue;
            return this._value;
        }
    }
    exports.Item = Item;
});
define("Jed/LabelItem", ["require", "exports", "Jed/Item"], function (require, exports, Item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelItem = void 0;
    class LabelItem extends Item_1.Item {
        constructor(parent, name, value, x, y, w = 0, h = 0) {
            super(parent, name, value, x, y, w, h);
            this.gparms.fontFace = "serif";
            this.bb = this.playfield.gfx.boundingBox(this.value(), this.gparms);
            if (!w)
                this.w = this.bb.w;
            if (!h)
                this.h = this.bb.h;
        }
        draw() {
            let gfx = this.playfield.gfx;
            // this.bb = gfx.boundingBox(this.value(), this.gparms);
            // this.w = this.bb.w;
            // this.h = this.bb.h;
            gfx.text(this.value(), this.x, this.y, this.gparms);
        }
    }
    exports.LabelItem = LabelItem;
});
define("Shapes/Box", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Box = void 0;
    class Box extends Playfield_3.Actor {
        constructor(parent, name, x, y, w = 0, h = 0, borderColor = "black", fillColor = "white") {
            super(parent, name, x, y, w, h);
            this.gparms.borderColor = borderColor;
            this.gparms.fillColor = fillColor;
        }
        draw() {
            super.draw();
            this.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        }
    }
    exports.Box = Box;
});
define("Shapes/XBox", ["require", "exports", "Shapes/Box"], function (require, exports, Box_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XBox = void 0;
    class XBox extends Box_1.Box {
        constructor(parent, name, x, y, w = 0, h = 0, borderColor = "black", fillColor = "white", color = "black") {
            super(parent, name, x, y, w, h);
            this.gparms.color = color;
        }
        select() {
        }
        deselect() {
        }
        draw() {
            super.draw();
            if (this.isSelected) {
                this.gfx.line(this.x, this.y, this.x + this.w, this.y + this.h, this.gparms);
                this.gfx.line(this.x + this.w, this.y, this.x, this.y + this.h, this.gparms);
            }
        }
    }
    exports.XBox = XBox;
});
define("Shapes/index", ["require", "exports", "Shapes/Box", "Shapes/XBox"], function (require, exports, Box_2, XBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XBox = exports.Box = void 0;
    Object.defineProperty(exports, "Box", { enumerable: true, get: function () { return Box_2.Box; } });
    Object.defineProperty(exports, "XBox", { enumerable: true, get: function () { return XBox_1.XBox; } });
});
define("Jed/XBoxItem", ["require", "exports", "Jed/Item", "Shapes/index"], function (require, exports, Item_2, Shapes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XBoxItem = void 0;
    class XBoxItem extends Item_2.Item {
        constructor(parent, name, values, x, y, w = 0, h = 0, borderColor = "black", fillColor = "white", color = "black") {
            super(parent, name, null, x, y, 0, 0);
            this._values = ["on", "off"];
            this._isChecked = false;
            this.values(values);
            this.xbox = new Shapes_1.XBox(parent, name, x, y, w, h, borderColor, fillColor, color);
        }
        click(x, y) {
            super.click(x, y);
            this._isChecked = !this._isChecked;
            this.log(this.value());
        }
        isChecked(checked) {
            return this.isSelected;
        }
        values(values) {
            if (values === undefined)
                return this._values;
            if (typeof values === "string")
                this._values = [values, null];
            else
                this._values = values;
        }
        value(value) {
            if (value !== undefined)
                this._values = [value, null];
            return this.isChecked() ? this._values[0] : this._values[1];
        }
        draw() {
            if (this.isChecked()) {
                this.gfx.line(this.x, this.y, this.x + this.w, this.y + this.h, this.gparms);
                this.gfx.line(this.x + this.w, this.y, this.x, this.y + this.h, this.gparms);
            }
        }
    }
    exports.XBoxItem = XBoxItem;
});
define("Jed/CheckBoxItem", ["require", "exports", "Jed/Item", "Jed/LabelItem", "Jed/XBoxItem"], function (require, exports, Item_3, LabelItem_1, XBoxItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CheckBoxItem = void 0;
    class CheckBoxItem extends Item_3.Item {
        constructor(parent, name, label, values, x, y, w = 0, h = 0, ww = 0, hh = 0, borderColor = "black", fillColor = "white", color = "black") {
            super(parent, name, null, x, y, 0, 0);
            this._values = ["on", "off"];
            this.labelItem = new LabelItem_1.LabelItem(parent, name + "-label", label, 0, 0, ww, hh);
            this.xboxItem = new XBoxItem_1.XBoxItem(parent, name + "-checkbox", values, this.labelItem.bb.w, 0, w, h, borderColor, fillColor, color);
            this.values(values);
            console.log("Hello", this);
            this.log(this.w, this.h);
            this.w = 0;
            this.h = 0;
        }
        click(x, y) {
            super.click(x, y);
            this.xboxItem.click(x, y);
        }
        isChecked(checked) {
            return this.xboxItem.isChecked(checked);
        }
        values(values) {
            if (values === undefined)
                return this._values;
            if (typeof values === "string")
                this._values = [values, null];
            else
                this._values = values;
        }
        value(value) {
            return this.xboxItem.value(value);
        }
    }
    exports.CheckBoxItem = CheckBoxItem;
});
define("Jed/EditItemEventHandler", ["require", "exports", "Utils/index", "Playfield/index"], function (require, exports, Utils, Playfield_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditItemEventHandler = void 0;
    Utils = __importStar(Utils);
    class EditItemEventHandler extends Playfield_4.EventHandler {
        constructor(editItem) {
            super(editItem.playfield, editItem);
            this.logger = new Utils.Logger("log");
        }
        ArrowLeft(event, playfield, obj) {
            obj.cursorInc(-1);
        }
        ArrowRight(event, playfield, obj) {
            obj.cursorInc(+1);
        }
        Backspace(event, playfield, obj) {
            this.logger.log(obj.cursor, obj._value);
            if (obj.cursor > 0) {
                let c = obj.cursor;
                let left = obj._value.substring(0, c - 1);
                let right = obj._value.substring(c);
                obj.value(left + right);
                obj.cursorInc(-1);
                this.logger.log(left, right, obj.cursor, obj._value);
            }
        }
        OrdinaryKey(event, playfield, obj) {
            let c = obj.cursor;
            obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
            obj.cursorInc(+1);
        }
    }
    exports.EditItemEventHandler = EditItemEventHandler;
});
define("Jed/EditItem", ["require", "exports", "Jed/Item", "Jed/EditItemEventHandler"], function (require, exports, Item_4, EditItemEventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditItem = void 0;
    class EditItem extends Item_4.Item {
        constructor(parent, name, value, x, y, w = 100, h = 24) {
            super(parent, name, value, x, y, w, h);
            this.cursor = 0;
            this.left = 0;
            this.right = 0;
            this.cursorOn = true;
            this.cursorBlinkRate = 500;
            this.nchars = 0;
            this.nchars2 = 0;
            this.gparms.fontFace = "monospace";
            this.eventHandler = new EditItemEventHandler_1.EditItemEventHandler(this);
            this.nchars = Math.ceil(this.w / this.playfield.gfx.boundingBox("m", this.gparms).w);
            this.nchars2 = Math.ceil(this.w / this.playfield.gfx.boundingBox("m", this.gparms).w / 2);
            this.left = 0;
            this.right = this.computeRight();
            this._setIntervalTimer();
        }
        _setIntervalTimer() {
            this.cursorOn = true;
            if (this.timerId)
                clearInterval(this.timerId);
            this.timerId = setInterval(this.blink.bind(this), this.cursorBlinkRate);
        }
        blink() {
            this.cursorOn = !this.cursorOn;
        }
        click(x, y) {
            this.playfield.focusObj(this);
        }
        drawCursor() {
            if (!this.hasFocus)
                return;
            if (!this.cursorOn)
                return;
            let gfx = this.playfield.gfx;
            let valueBB = gfx.boundingBox(this.value().substring(this.left, this.cursor), this.gparms);
            let dw = valueBB.w;
            if (dw <= 0)
                dw = 1;
            else if (dw >= this.w)
                dw = this.w - 1;
            let x0 = this.x + dw;
            if (x0 <= this.x)
                x0 = this.x + 1;
            let x1 = x0;
            let y0 = this.y;
            let y1 = y0 + valueBB.h;
            gfx.line(x0, y0, x1, y1, this.gparms);
            gfx.line(x0 + 1, y0, x1 + 2, y1, this.gparms);
        }
        draw() {
            let gfx = this.playfield.gfx;
            if (this.hasFocus)
                this.gparms.color = "red";
            else
                this.gparms.color = "black";
            gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
            gfx.textRect(this.value().substring(this.left), this.x, this.y, this.w, this.h, this.gparms);
            this.drawCursor();
            gfx.restore();
        }
        computeRight() {
            // let gfx = this.playfield.gfx;
            // let right = this.left;
            // for(let i=this.left; i<=this._value.length; i++) {
            //     let bb = gfx.boundingBox(this._value.substring(this.left, i));
            //     right = i;
            //     if (bb.w > this.w) break;
            // }
            let right = this.left + this.nchars2 * 2;
            if (right >= this._value.length)
                right = this._value.length - 1;
            return right;
        }
        computeLeft() {
            // let gfx = this.playfield.gfx;
            // let left = this.right;
            // for(let i=this.right; i>=0; i--) {
            //     let bb = gfx.boundingBox(this._value.substring(i, this.right));
            //     if (bb.w > this.w) break;
            //     left = i;
            // }
            let left = this.right - this.nchars2 * 2 + 1;
            if (left < 0)
                left = 0;
            return left;
        }
        cursorInc(delta) {
            this.cursor += delta;
            this._setIntervalTimer();
            this.cursorOn = true;
            if (this.cursor < 0)
                this.cursor = 0;
            if (this.cursor > this._value.length)
                this.cursor = this._value.length;
            this.left = this.cursor - this.nchars2;
            if (this.left < 0)
                this.left = 0;
            this.right = this.left + this.nchars;
            if (this.right > this._value.length)
                this.right = this._value.length;
            if (this.right === this._value.length)
                this.left = Math.max(this.right - this.nchars + 1, 0);
            this.log(this.left, this.cursor, this.right, this.nchars, this.nchars2);
        }
    }
    exports.EditItem = EditItem;
});
define("Jed/TextItem", ["require", "exports", "Jed/Item", "Jed/LabelItem", "Jed/EditItem"], function (require, exports, Item_5, LabelItem_2, EditItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextItem = void 0;
    class TextItem extends Item_5.Item {
        constructor(parent, name, label, value, x, y, w = 0, h = 0, ww = 0, hh = 0) {
            super(parent, name, value, x, y, 0, 0);
            this.cursorOn = true;
            this.labelItem = new LabelItem_2.LabelItem(this, name + "-label", label, 0, 0, ww, hh);
            this.editItem = new EditItem_1.EditItem(this, name + "-editor", value, this.labelItem.w + 2, 0, w, h);
        }
        click(x, y) {
            this.playfield.focusObj(this.editItem);
        }
        labelBB() {
            return this.labelItem.bb;
        }
    }
    exports.TextItem = TextItem;
});
define("Jed/index", ["require", "exports", "Jed/CheckBoxItem", "Jed/EditItem", "Jed/EditItemEventHandler", "Jed/Item", "Jed/LabelItem", "Jed/TextItem"], function (require, exports, CheckBoxItem_1, EditItem_2, EditItemEventHandler_2, Item_6, LabelItem_3, TextItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextItem = exports.LabelItem = exports.Item = exports.EditItemEventHandler = exports.EditItem = exports.CheckBoxItem = void 0;
    Object.defineProperty(exports, "CheckBoxItem", { enumerable: true, get: function () { return CheckBoxItem_1.CheckBoxItem; } });
    Object.defineProperty(exports, "EditItem", { enumerable: true, get: function () { return EditItem_2.EditItem; } });
    Object.defineProperty(exports, "EditItemEventHandler", { enumerable: true, get: function () { return EditItemEventHandler_2.EditItemEventHandler; } });
    Object.defineProperty(exports, "Item", { enumerable: true, get: function () { return Item_6.Item; } });
    Object.defineProperty(exports, "LabelItem", { enumerable: true, get: function () { return LabelItem_3.LabelItem; } });
    Object.defineProperty(exports, "TextItem", { enumerable: true, get: function () { return TextItem_1.TextItem; } });
});
define("Playfield/EventHandlers/Capabilities/KeyboardEnabled", ["require", "exports", "Mixins/index"], function (require, exports, Mixins_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyboardEnabled = exports.KeyboardEnabledClass = exports.KeyboardEnabledBase = void 0;
    exports.KeyboardEnabledBase = KeyboardEnabled(Mixins_12.Base);
    class KeyboardEnabledClass extends exports.KeyboardEnabledBase {
    }
    exports.KeyboardEnabledClass = KeyboardEnabledClass;
    ;
    function KeyboardEnabled(_base) {
        return class extends _base {
            KeyboardEnabled() {
            }
            KeyDown(event) {
            }
            KeyUp(event) {
            }
            OrdinaryKey(event) {
            }
            SpecialKey(event) {
                this.any.log("SpecialKey:", event);
            }
            Shift(event) {
                this.any.log("Shift:", event);
            }
            Meta(event) {
                this.any.log("Meta:", event);
            }
            MetaKey(event) {
                this.any.log("MetaKey:", event);
            }
            Alt(event) {
                this.any.log("Alt:", event);
            }
            AltKey(event) {
                this.any.log("AltKey:", event);
            }
            Control(event) {
                this.any.log("Control:", event);
            }
            ControlKey(event) {
                this.any.log("ControlKey:", event);
            }
            Backspace(event) {
                this.any.log("Backspace:", event);
            }
            UpperCase(event) {
                this.any.log("UpperCase:", event);
            }
            LowerCase(event) {
                this.any.log("LowerCase:", event);
            }
            Digit(event) {
                this.any.log("Digit:", event);
            }
            Punctuation(event) {
                this.any.log("Punctuation:", event);
            }
            FunctionKey(event) {
                this.any.log("FunctionKey:", event);
            }
            ArrowUp(event) {
                this.any.log("ArrowUp:", event);
            }
            ArrowDown(event) {
                this.any.log("ArrowDown:", event);
            }
            ArrowLeft(event) {
                this.any.log("ArrowLeft:", event);
            }
            ArrowRight(event) {
                this.any.log("ArrowRight:", event);
            }
            defaultKey(event) {
                this.any.log("unknown keypress:", event.key, event);
            }
        };
    }
    exports.KeyboardEnabled = KeyboardEnabled;
});
define("Test/JedTest", ["require", "exports", "Jed/index", "Playfield/index"], function (require, exports, Jed, Playfield_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JedTest = void 0;
    Jed = __importStar(Jed);
    class JedTest {
        constructor() {
            let playfield = new Playfield_5.Playfield("#my_canvas");
            let TextItem1 = new Jed.TextItem(playfield, "first_name", "First Name:", "Gregory L. Smith", 10, 10, 75, 24);
            let labelBB = TextItem1.labelBB();
            new Jed.TextItem(playfield, "mi", "M.I.:", "Smith", 10, 40, 150, 24, labelBB.w, labelBB.h);
            new Jed.TextItem(playfield, "last_name", "Last Name:", "Smith", 10, 70, 8, 24, labelBB.w, labelBB.h);
            new Jed.CheckBoxItem(playfield, "email_signup", "Email Signup: ", ["yes", "no"], 10, 100, 30, 30, 0, 0, "black", "white", "red");
            playfield.start();
        }
    }
    exports.JedTest = JedTest;
});
//# sourceMappingURL=PlayfieldGraphics.js.map