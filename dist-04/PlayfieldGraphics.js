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
    exports.limit = exports.ceil = exports.round = exports.int = exports.snapTo = exports.random = exports.inclusive = exports.between = void 0;
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
    function int(n) {
        return Math.floor(n);
    }
    exports.int = int;
    function round(n) {
        return Math.floor(n + 0.5);
    }
    exports.round = round;
    function ceil(n) {
        return Math.ceil(n);
    }
    exports.ceil = ceil;
    function limit(min, value, max) {
        if (value < min)
            value = min;
        if (value > max)
            value = max;
        return value;
    }
    exports.limit = limit;
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
            this._isLoggable = true;
            this._level = logLevel;
            this._uselink = uselink;
            return this;
        }
        // --- Public Methods --- //
        info(...args) {
            // most verbose
            if (["info"].includes(this._level))
                console.log(this._format("INFO", this._module()), ...args);
        }
        log(...args) {
            // less verbose
            if (["info", "log"].includes(this._level))
                console.log(this._format("LOG", this._module()), ...args);
        }
        warn(...args) {
            // less verbose
            if (["info", "log", "warn"].includes(this._level))
                console.log(this._format("WARN", this._module()), ...args);
        }
        error(...args) {
            // always show errors
            console.error(this._format("ERROR", this._module(), ...args));
        }
        // --- Private Methods --- //
        _format(level, module, ...args) {
            let format = `${level}: ${module}: ${args.join(", ")}`;
            if (this._uselink)
                format += "\n" + " ".repeat(level.length + 2) + this._link;
            return format;
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
        // --- Accessors --- //
        get logLevel() {
            return this._level;
        }
        set logLevel(level) {
            this._level = level;
        }
    }
    exports.Logger = Logger;
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
                parent.addChild(this);
            this._fullName = this._getFullName();
        }
        _getFullName() {
            let parentFullName = this.parent ? this.parent._fullName + "." : "";
            return parentFullName + this.name;
        }
        // --- Public Methods --- //
        addChild(child) {
            child._parent = this;
            this._children.push(child);
        }
        root() {
            let result = this;
            while (result.parent) {
                result = result.parent;
            }
            return result;
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
        depth() {
            if (this.parent)
                return this.parent.depth() + 1;
            return 0;
        }
        printMe(node, ctx) {
            console.log(" | ".repeat(node.depth()), node.name);
        }
        printTree() {
            this.dfs(this.printMe.bind(this), null);
        }
        // --- Accessors --- //
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
        get fullName() {
            return this._fullName;
        }
    }
    exports.Tree = Tree;
});
define("Utils/PointMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    class Point {
        constructor() {
            this._x = 0;
            this._y = 0;
        }
        Point(x, y) {
            this._x = x;
            this._y = y;
        }
        // --- Public Methods --- //
        move(x, y) {
            this.x = x;
            this.y = y;
        }
        rmove(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
        // --- Accessors --- //
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
    }
    exports.Point = Point;
});
define("Utils/RectMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = void 0;
    class Rect {
        constructor() {
            this._x = 0;
            this._y = 0;
            this._w = 0; // w=1 is a single pixel
            this._h = 0; // h= 1 is a single pixel
        }
        Rect(x, y, w, h) {
            return this.RectWH(x, y, w, h);
        }
        RectWH(x, y, w, h) {
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;
            return this;
        }
        // Static Methods -- //
        static cast(obj) {
            return obj;
        }
        // --- Public Methods --- //
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
        // --- Accessors --- //
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
        get X() {
            // placeholder for absolute screen X
            return this._x;
        }
        get Y() {
            // placeholder for absolute screen Y
            return this._y;
        }
        get W() {
            // placeholder for absolute absolute W
            return this._w;
        }
        get H() {
            // placeholder for absolute absolute H
            return this._h;
        }
    }
    exports.Rect = Rect;
});
define("Utils/RelRectMixin", ["require", "exports", "Utils/Functions", "Utils/RectMixin"], function (require, exports, Functions_1, RectMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RelRect = void 0;
    class RelRect {
        constructor() {
            // all points are relative to the parent
            // if positive integer, they are relative to the parent's top or left edge
            // if negative integer, they are relative to the parent's bottom or right edge
            // if positive/negative fractional, they are a percentage of the parent's width/height
            // modifying these values update x/y/w/h
            // -- but modifying x/y/w/h does not change these values
            this._x0 = 0;
            this._y0 = 0;
            this._x1 = 0;
            this._y1 = 0;
        }
        RelRect(x0, y0, x1, y1) {
            this.x0 = x0;
            this.y0 = y0;
            this.x1 = x1;
            this.y1 = y1;
            return this;
        }
        // --- Accessors --- //
        get x0() {
            return this._x0;
        }
        get y0() {
            return this._y0;
        }
        get x1() {
            return this._x1;
        }
        get y1() {
            return this._y1;
        }
        get _parentRect() {
            let that = this;
            if (that.parent)
                that._parent;
            return (new RectMixin_1.Rect).Rect(0, 0, 0, 0);
        }
        set x0(x0) {
            let thisRect = RectMixin_1.Rect.cast(this);
            this._x0 = x0;
            if (-1 < x0 && x0 < 1) {
                if (x0 > 0)
                    thisRect.x = (0, Functions_1.int)(this._parentRect.w * x0);
                else
                    thisRect.x = (0, Functions_1.int)(this._parentRect.w * (1 + x0));
            }
            else {
                if (x0 >= 0)
                    thisRect.x = x0;
                else
                    thisRect.x = this._parentRect.w + x0;
            }
        }
        set y0(y0) {
            let thisRect = RectMixin_1.Rect.cast(this);
            this._y0 = y0;
            if (-1 < y0 && y0 < 1) {
                if (y0 > 0)
                    thisRect.y = (0, Functions_1.int)(this._parentRect.h * y0);
                else
                    thisRect.y = (0, Functions_1.int)(this._parentRect.h * (1 + y0));
            }
            else {
                if (y0 >= 0)
                    thisRect.y = y0;
                else
                    thisRect.y = this._parentRect.h + y0;
            }
        }
        set x1(x1) {
            let thisRect = RectMixin_1.Rect.cast(this);
            this._x1 = x1;
            if (-1 < x1 && x1 < 1) {
                if (x1 > 0)
                    thisRect.w = (0, Functions_1.int)(this._parentRect.w * x1) + 1;
                else
                    thisRect.w = (0, Functions_1.int)(this._parentRect.w * (1 + x1)) + 1;
            }
            else {
                if (x1 >= 0)
                    thisRect.w = x1 - thisRect.x + 1;
                else
                    thisRect.w = this._parentRect.w + x1 - thisRect.x + 1;
            }
        }
        set y1(y1) {
            let thisRect = RectMixin_1.Rect.cast(this);
            this._y1 = y1;
            if (-1 < y1 && y1 < 1) {
                if (y1 > 0)
                    thisRect.h = (0, Functions_1.int)(this._parentRect.h * y1) + 1;
                else
                    thisRect.h = (0, Functions_1.int)(this._parentRect.h * (1 + y1)) + 1;
            }
            else {
                if (y1 >= 0)
                    thisRect.h = y1 - thisRect.y + 1;
                else
                    thisRect.h = this._parentRect.h + y1 - thisRect.y + 1;
            }
        }
    }
    exports.RelRect = RelRect;
});
define("Utils/MarginsMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Margins = void 0;
    class Margins {
        constructor() {
            this._top = 0;
            this._bottom = 0;
            this._left = 0;
            this._right = 0;
        }
        Margins(top, right, bottom, left) {
            this._top = top;
            this._bottom = bottom;
            this._left = left;
            this._right = right;
            return this;
        }
        // --- Accessors --- //
        get top() {
            return this._top;
        }
        set top(n) {
            this._top = n;
        }
        get right() {
            return this._right;
        }
        set right(n) {
            this._right = n;
        }
        get bottom() {
            return this._bottom;
        }
        set bottom(n) {
            this._bottom = n;
        }
        get left() {
            return this._left;
        }
        set left(n) {
            this._left = n;
        }
    }
    exports.Margins = Margins;
});
define("Utils/RatioMixin", ["require", "exports", "Utils/Functions"], function (require, exports, Functions_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ratio = void 0;
    class Ratio {
        Ratio(rmin, rmax, value, imin, imax) {
            this._rmin = rmin;
            this._rmax = rmax;
            this._rdelta = this._rmax - this._rmin;
            this._imin = (0, Functions_2.int)(imin);
            this._imax = (0, Functions_2.int)(imax);
            this._idelta = this._imax - this._imin;
            this.value = value;
        }
        set index(index) {
            this._index = (0, Functions_2.int)(index);
            let percent = (this._index - this._imin) / this._idelta;
            this._value = percent * this._rdelta + this._rmin;
        }
        get index() {
            return this._index;
        }
        set value(value) {
            this._value = value;
            let percent = (this._value - this._rmin) / this._rdelta;
            this._index = (0, Functions_2.int)(percent * this._idelta + this._imin);
        }
        get value() {
            return this._value;
        }
    }
    exports.Ratio = Ratio;
});
define("Utils/index", ["require", "exports", "Utils/Mixins", "Utils/Functions", "Utils/LoggerMixin", "Utils/TreeMixin", "Utils/RectMixin", "Utils/RelRectMixin", "Utils/PointMixin", "Utils/MarginsMixin", "Utils/RatioMixin"], function (require, exports, Mixins_1, Functions_3, LoggerMixin_1, TreeMixin_1, RectMixin_2, RelRectMixin_1, PointMixin_1, MarginsMixin_1, RatioMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ratio = exports.Margins = exports.Point = exports.RelRect = exports.Rect = exports.Tree = exports.Logger = exports.limit = exports.ceil = exports.round = exports.int = exports.snapTo = exports.random = exports.inclusive = exports.between = exports.applyMixins = void 0;
    Object.defineProperty(exports, "applyMixins", { enumerable: true, get: function () { return Mixins_1.applyMixins; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_3.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_3.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_3.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_3.snapTo; } });
    Object.defineProperty(exports, "int", { enumerable: true, get: function () { return Functions_3.int; } });
    Object.defineProperty(exports, "round", { enumerable: true, get: function () { return Functions_3.round; } });
    Object.defineProperty(exports, "ceil", { enumerable: true, get: function () { return Functions_3.ceil; } });
    Object.defineProperty(exports, "limit", { enumerable: true, get: function () { return Functions_3.limit; } });
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return LoggerMixin_1.Logger; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return TreeMixin_1.Tree; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return RectMixin_2.Rect; } });
    Object.defineProperty(exports, "RelRect", { enumerable: true, get: function () { return RelRectMixin_1.RelRect; } });
    Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return PointMixin_1.Point; } });
    Object.defineProperty(exports, "Margins", { enumerable: true, get: function () { return MarginsMixin_1.Margins; } });
    Object.defineProperty(exports, "Ratio", { enumerable: true, get: function () { return RatioMixin_1.Ratio; } });
});
define("Playfield/Graphics/GfxParms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxParms = void 0;
    class GfxParms {
        constructor() {
            this.color = "black";
            this.borderColor = "black";
            this.fillColor = "white";
            this.borderRadius = 0;
            this.textAlign = GfxParms.LEFT;
            this.textBaseline = GfxParms.TOP;
            this.fontSize = 16;
            this.fontFace = GfxParms.DEFAULT_FONT;
            this.fontStyle = "";
        }
        clone() {
            let gfxparms = new GfxParms();
            Object.assign(gfxparms, this);
            return gfxparms;
        }
        _updateFont() {
            this._font = (this._fontStyle + " " + this._fontSize + "px " + this._fontFace).trim();
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
        get fontStyle() {
            return this._fontStyle;
        }
        set fontStyle(value) {
            this._fontStyle = value;
            this._updateFont();
        }
    }
    exports.GfxParms = GfxParms;
    GfxParms.SANS_SERIF = "sans-serif";
    GfxParms.SERIF = "serif";
    GfxParms.MONOSPACE = "monospace";
    GfxParms.DEFAULT_FONT = "sans-serif";
    GfxParms.BOLD = "bold";
    GfxParms.ITALIC = "italic";
    GfxParms.REGULAR = "";
    GfxParms.LEFT = "left";
    GfxParms.RIGHT = "right";
    GfxParms.CENTER = "center";
    GfxParms.TOP = "top";
    GfxParms.MIDDLE = "middle";
    GfxParms.BOTTOM = "bottom";
});
define("Playfield/Graphics/Gfx", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/Graphics/index", ["require", "exports", "Playfield/Graphics/GfxParms"], function (require, exports, GfxParms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxParms = void 0;
    Object.defineProperty(exports, "GfxParms", { enumerable: true, get: function () { return GfxParms_1.GfxParms; } });
});
define("Playfield/PlayfieldEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Playfield/Options", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Options = void 0;
    class Options {
    }
    exports.Options = Options;
});
define("Playfield/Abilities/ClickableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clickable = void 0;
    class Clickable {
        Clickable() {
            this.isClickable = true;
        }
        // --- onActions --- //
        onClick(pfEvent) {
        }
        onMenu(pfEvent) {
        }
        // --- Accessors --- //
        get isClickable() {
            return this._isClickable;
        }
        set isClickable(value) {
            this._isClickable = value;
        }
    }
    exports.Clickable = Clickable;
});
define("Playfield/Abilities/ClickerMixin", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clicker = void 0;
    ;
    class Clicker {
        Clicker() {
            this.isClicker = true;
            return this;
        }
        // --- Public Methods --- //
        clickEvent(pfEvent, child) {
            if (pfEvent.isPress) {
                let tileChild = Tile_1.Tile.cast(child);
                if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                    child.onClick(pfEvent);
                }
            }
            else if (pfEvent.isMenu) {
                let tileChild = Tile_1.Tile.cast(child);
                if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                    child.onMenu(pfEvent);
                }
            }
        }
    }
    exports.Clicker = Clicker;
});
define("Playfield/Abilities/DispatchableMixin", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dispatchable = void 0;
    class Dispatchable {
        Dispatchable() {
            this.isDispatchable = true;
        }
        // --- static methods --- //
        static cast(obj) {
            return obj;
        }
        dispatchEvent(pfEvent, controller) {
            let anyThis = this;
            if (anyThis.isHoverable && controller.hoverEvent)
                controller.hoverEvent(pfEvent, this);
            if (anyThis.isSelectable && controller.selectEvent)
                controller.selectEvent(pfEvent, this);
            if (anyThis.isClickable && controller.clickEvent)
                controller.clickEvent(pfEvent, this);
            if (anyThis.isPressable && controller.pressEvent)
                controller.pressEvent(pfEvent, this);
            if (anyThis.isFocusable && controller.editerEvent)
                controller.editerEvent(pfEvent, this);
            if (anyThis.isDraggable && controller.dragEvent)
                controller.dragEvent(pfEvent, this);
        }
        // --- On Actions --- //
        onEvent(pfEvent) {
            this.dispatchEvent(pfEvent, Tile_2.Tile.cast(this).parent);
        }
        // --- Accessors --- //
        get isDispatchable() {
            return this._isDispatchable;
        }
        set isDispatchable(value) {
            this._isDispatchable = value;
        }
    }
    exports.Dispatchable = Dispatchable;
});
define("Playfield/Abilities/DispatcherMixin", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/DispatchableMixin"], function (require, exports, Tile_3, DispatchableMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dispatcher = void 0;
    ;
    class Dispatcher {
        Dispatcher() {
            this.isDispatcher = true;
            return this;
        }
        // --- Public Methods --- //
        dispatchEventToChildren(pfEvent) {
            // Note: this passes the event to every immediate child
            //       if the children have children it is the 
            //       responsibility of the children to pass the event down
            let thisTile = Tile_3.Tile.cast(this);
            if (pfEvent.isMouseEvent && thisTile.inBounds(pfEvent.x, pfEvent.y)) {
                this._forEachChild(pfEvent);
            }
            else if (pfEvent.isKeyboardEvent) {
                this._forEachChild(pfEvent);
            }
        }
        _forEachChild(pfEvent) {
            let thisTile = Tile_3.Tile.cast(this);
            for (let child of thisTile.children.reverse()) {
                let dispatchableChild = DispatchableMixin_1.Dispatchable.cast(child);
                if (pfEvent.isActive)
                    dispatchableChild.onEvent(pfEvent);
            }
        }
        onEvent(pfEvent) {
            this.dispatchEventToChildren(pfEvent);
            DispatchableMixin_1.Dispatchable.cast(this).dispatchEvent(pfEvent, Tile_3.Tile.cast(this).parent);
        }
    }
    exports.Dispatcher = Dispatcher;
});
define("Playfield/Abilities/DraggableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draggable = void 0;
    class Draggable {
        Draggable() {
            this.isDraggable = true;
            this.isDragging = false;
            return this;
        }
        // --- onActions --- //
        onGrab(dx, dy, pfEvent) {
            this.isDragging = true;
            pfEvent.isActive = false;
            return true;
        }
        onDrag(dx, dy, pfEvent) {
            if (this.isDragging) {
                let that = this;
                if (that.rmove)
                    that.rmove(dx, dy);
                pfEvent.isActive = false;
            }
        }
        onDrop(pfEvent) {
            if (this.isDragging) {
                this.isDragging = false;
                pfEvent.isActive = false;
            }
        }
        // --- Accessors --- //
        get isDraggable() {
            return this._isDraggable;
        }
        set isDraggable(value) {
            this._isDraggable = value;
        }
        get isDragging() {
            return this._isDragging;
        }
        set isDragging(value) {
            this._isDragging = value;
        }
    }
    exports.Draggable = Draggable;
});
define("Playfield/Abilities/DraggerMixin", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dragger = void 0;
    ;
    class Dragger {
        Dragger() {
            this.isDragger = true;
            this._dragObj = null;
            this._dragX = 0;
            this._dragY = 0;
            return this;
        }
        // --- Public Methods --- //
        dragEvent(pfEvent, child) {
            if (pfEvent.isMove)
                return this._dragChild(pfEvent, child);
            else if (pfEvent.isPress)
                return this._grabChild(pfEvent, child);
            else if (pfEvent.isRelease)
                return this._dropChild(pfEvent, child);
        }
        // --- Private Methods --- //
        _dragChild(pfEvent, child) {
            if (!child.isDraggable)
                return;
            if (this._dragObj) {
                this._dragObj.onDrag(pfEvent.x - this._dragX, pfEvent.y - this._dragY, pfEvent);
                this._dragX = pfEvent.x;
                this._dragY = pfEvent.y;
            }
        }
        _grabChild(pfEvent, child) {
            if (!child.isDraggable)
                return;
            let tileChild = Tile_4.Tile.cast(child);
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                let dx = pfEvent.x - tileChild.X;
                let dy = pfEvent.y - tileChild.Y;
                if (child.onGrab(dx, dy, pfEvent)) {
                    // if the child does not reject the "grab"
                    this._dropChild(pfEvent, child);
                    this._dragX = pfEvent.x;
                    this._dragY = pfEvent.y;
                    this._dragObj = child;
                }
            }
        }
        _dropChild(pfEvent, child) {
            if (this._dragObj) {
                this._dragObj.onDrop(pfEvent);
                this._dragObj = null;
            }
        }
    }
    exports.Dragger = Dragger;
});
define("Playfield/Abilities/EditableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editable = void 0;
    class Editable {
        Editable() {
            this.isEditable = true;
            this.isFocus = false;
            this.isFocusable = true;
            return this;
        }
        // --- onActons --- //
        onKey(key, pfEvent) {
        }
        onArrowLeft(pfEvent) {
        }
        onArrowRight(pfEvent) {
        }
        onBackspace(pfEvent) {
        }
        onBackSpace(pfEvent) {
            // this is the wrong method
            // you should be using onBackspace(), above
            // this is purposely mispelled with upper-case "S"
            // to force a compile-time error
            // if you attempt to override it.
        }
        onFocus(pfEvent) {
        }
        onUnfocus(pfEvent) {
        }
        // --- Accessors --- //
        get isEditable() {
            return this._isEditable;
        }
        set isEditable(value) {
            this._isEditable = value;
        }
        get isFocusable() {
            return this._isFocusable;
        }
        set isFocusable(value) {
            this._isFocusable = value;
        }
        get isFocus() {
            return this._isFocus;
        }
        set isFocus(value) {
            this._isFocus = value;
        }
    }
    exports.Editable = Editable;
});
define("Playfield/Abilities/EditerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editer = void 0;
    ;
    class Editer {
        Editer() {
            this.isEditer = true;
            this._focusObj = null;
            return this;
        }
        // --- Public Methods --- //
        editerEvent(pfEvent, child) {
            if (pfEvent.isPress)
                return this._focusChild(pfEvent, child);
            else if (pfEvent.isKeyDown)
                return this._dispatchKey(pfEvent, child);
        }
        // --- Private Methods --- //
        _focusChild(pfEvent, child) {
            let tileChild = child;
            if (pfEvent.isKeyboardEvent || tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                this._unfocusChildren(pfEvent, child);
                this._focusObj = child;
                child.isFocus = true;
                child.onFocus(pfEvent);
            }
        }
        _editerParent() {
            return this.parent;
        }
        _unfocusChild(child, ctx) {
            // this is a function called by Tree.dfs()
            if (child._focusObj) {
                // we're PRETTY sure this is Editable...
                child._focusObj.isFocus = false;
                child._focusObj.onUnfocus();
            }
        }
        _unfocusChildren(pfEvent, child) {
            // we have to unfocus ALL the children in the tree
            // otherwise, the keyboard events go to all currently inFocus items
            let root = this.root();
            root.dfs(this._unfocusChild);
        }
        _dispatchKey(pfEvent, child) {
            if (child.isFocus) {
                if (pfEvent.key.length === 1)
                    child.onKey(pfEvent.key, pfEvent);
                else if (pfEvent.key === "ArrowLeft")
                    child.onArrowLeft(pfEvent);
                else if (pfEvent.key === "ArrowRight")
                    child.onArrowRight(pfEvent);
                else if (pfEvent.key === "Backspace")
                    child.onBackspace(pfEvent);
                else if (pfEvent.key === "Tab" && !pfEvent.isShift)
                    this._nextChild(1, pfEvent);
                else if (pfEvent.key === "Tab" && pfEvent.isShift)
                    this._nextChild(-1, pfEvent);
            }
        }
        _nextChild(direction, pfEvent) {
            if (!this._focusObj)
                return;
            let focusObj = this._focusObj;
            let children = focusObj.parent.children.sort((a, b) => direction * (a._tabOrder - b._tabOrder));
            let i = children.indexOf(focusObj);
            if (i === -1)
                throw new Error("Focus Object Not Found");
            let safety = children.length;
            for (let j = i + 1; children[j] !== focusObj; j += 1) {
                if (j >= children.length)
                    j = 0;
                let sibling = children[j];
                if (sibling.isFocusable)
                    return this._focusChild(pfEvent, sibling);
                if (safety-- <= 0)
                    break;
            }
        }
        // -- Accessors --- //
        get focusObj() {
            return this._focusObj;
        }
    }
    exports.Editer = Editer;
});
define("Playfield/Abilities/HoverableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hoverable = void 0;
    class Hoverable {
        Hoverable() {
            this.isHovering = false;
            this.isHoverable = true;
            return this;
        }
        // --- onActions --- //
        onHover(pfEvent) {
            // this is the wrong method
            // you should be using onHovering(), above
            // this is purposely mispelled with upper-case "S"
            // to force a compile-time error
            // if you attempt to override it.
        }
        onHovering(pfEvent) {
        }
        onEnter(pfEvent) {
        }
        onExit(pfEvent) {
        }
        // --- Accessors --- //
        get isHovering() {
            return this._isHovering;
        }
        set isHovering(value) {
            this._isHovering = value;
        }
        get isHoverable() {
            return this._isHoverable;
        }
        set isHoverable(value) {
            this._isHoverable = value;
        }
    }
    exports.Hoverable = Hoverable;
});
define("Playfield/Abilities/HovererMixin", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hoverer = void 0;
    ;
    class Hoverer {
        Hoverer() {
            this.isHoverer = true;
            return this;
        }
        // --- Public Methods --- //
        hoverEvent(pfEvent, child) {
            let tileChild = Tile_5.Tile.cast(child);
            if (pfEvent.isMove) {
                if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                    if (child.isHovering) {
                        child.onHovering(pfEvent);
                    }
                    else {
                        child.isHovering = true;
                        child.onEnter(pfEvent);
                    }
                }
                else {
                    if (child.isHovering) {
                        child.isHovering = false;
                        child.onExit(pfEvent);
                    }
                }
            }
        }
    }
    exports.Hoverer = Hoverer;
});
define("Playfield/Abilities/PressableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pressable = void 0;
    class Pressable {
        Pressable() {
            this.isPressable = true;
            this.isPressed = false;
            return this;
        }
        // --- onActions --- //
        onPress(pfEvent) {
        }
        onRelease(pfEvent) {
        }
        // --- Accessors --- //
        get isPressed() {
            return this._isPressed;
        }
        set isPressed(value) {
            this._isPressed = value;
        }
        get isPressable() {
            return this._isPressable;
        }
        set isPressable(value) {
            this._isPressable = value;
        }
    }
    exports.Pressable = Pressable;
});
define("Playfield/Abilities/PresserMixin", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Presser = void 0;
    ;
    class Presser {
        Presser() {
            this.isPresser = true;
            return this;
        }
        // --- Public Methods --- //
        pressEvent(pfEvent, child) {
            let tileChild = Tile_6.Tile.cast(child);
            if (pfEvent.isPress && tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                child.isPressed = true;
                child.onPress(pfEvent);
            }
            if (pfEvent.isRelease && child.isPressed) {
                child.isPressed = false;
                child.onRelease(pfEvent);
            }
        }
    }
    exports.Presser = Presser;
});
define("Playfield/Abilities/Resizable", ["require", "exports", "Playfield/Tile"], function (require, exports, Tile_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Resizable = void 0;
    class Resizable {
        Resizable() {
            this.isResizable = true;
        }
        static cast(obj) {
            return obj;
        }
        resize(w, h) {
            let thisTile = Tile_7.Tile.cast(this);
            thisTile.w = w;
            thisTile.h = h;
        }
        relResize(dw, dh) {
            let thisTile = Tile_7.Tile.cast(this);
            thisTile.w += dw;
            thisTile.h += dh;
        }
        // --- onActions --- //
        onResize(w, h, pfEvent) {
            this.resize(w, h);
            this.onResizeChildren(w, h, pfEvent);
        }
        onRelResize(dw, dh, pfEvent) {
            let thisTile = Tile_7.Tile.cast(this);
            this.relResize(dw, dh);
            this.onRelResizeChildren(dw, dh, pfEvent);
        }
        onResizeChildren(w, h, pfEvent) {
            let thisTile = Tile_7.Tile.cast(this);
            for (let _child of thisTile.children) {
                let child = Resizable.cast(_child);
                if (child.isResizable)
                    child.onResize(w, h, pfEvent);
            }
        }
        onRelResizeChildren(dw, dh, pfEvent) {
            let thisTile = Tile_7.Tile.cast(this);
            for (let _child of thisTile.children) {
                let child = Resizable.cast(_child);
                if (child.isResizable)
                    child.onRelResize(dw, dh, pfEvent);
            }
        }
        // --- Accessors --- //
        get isResizable() {
            return this._isResizable;
        }
        set isResizable(value) {
            this._isResizable = value;
        }
    }
    exports.Resizable = Resizable;
});
define("Playfield/Abilities/SelectableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selectable = void 0;
    class Selectable {
        Selectable() {
            this._isSelectable = true;
            this._isSelected = false;
            return this;
        }
        // --- static methods --- //
        static cast(obj) {
            return obj;
        }
        // --- onActions --- //
        onSelect(pfEvent) {
        }
        onUnselect(pfEvent) {
        }
        // --- Accessors --- //
        get isSelected() {
            return this._isSelected;
        }
        set isSelected(value) {
            this._isSelected = value;
        }
        get isSelectable() {
            return this._isSelectable;
        }
        set isSelectable(value) {
            this._isSelectable = value;
        }
    }
    exports.Selectable = Selectable;
});
define("Playfield/Abilities/SelecterMixin", ["require", "exports", "Playfield/Abilities/SelectableMixin", "Playfield/Tile"], function (require, exports, SelectableMixin_1, Tile_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selecter = void 0;
    ;
    class Selecter {
        Selecter() {
            this.isSelecter = true;
            this._selectedObj = null;
            return this;
        }
        // --- Public Methods --- //
        selectEvent(pfEvent, child) {
            let tileChild = Tile_8.Tile.cast(child);
            let selectedObj = SelectableMixin_1.Selectable.cast(this._selectedObj);
            if (pfEvent.isPress) {
                let foundChild = SelectableMixin_1.Selectable.cast(tileChild.inBoundsChildren(pfEvent.x, pfEvent.y));
                if (foundChild && foundChild.isSelectable)
                    this._selectChild(pfEvent, foundChild);
            }
        }
        selectChild(child) {
            this._selectChild(null, child);
        }
        unselectChild(child) {
            this._unselectChild(null, child);
        }
        // --- Private Methods --- //
        _selectChild(pfEvent, child) {
            this._unselectChild(pfEvent, child);
            this._selectedObj = child;
            child.isSelected = true;
            child.onSelect(pfEvent);
        }
        _unselectChild(pfEvent, child) {
            if (this._selectedObj) {
                this._selectedObj.isSelected = false;
                this._selectedObj.onUnselect(pfEvent);
                this._selectedObj = null;
            }
        }
        // --- Accessors --- //
        get selectedObj() {
            return this._selectedObj;
        }
    }
    exports.Selecter = Selecter;
});
/**
 * can be timed.
 *
 * This object has its own Timer
 * It has its own _delay value
 * you must .start() the timer
 * and you may .stop() the timer
 * but you muse poll the timer with isTimedOut() or timeRemaining()
 * - this is not asynchronous and there is no callback
 */
define("Playfield/Abilities/Timer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = void 0;
    class Timer {
        Timer() {
            this.isTimer = true;
            this._delay = 0;
            this._lastTime = Date.now();
            this._timeout = 0;
            return this;
        }
        get delay() {
            return this._delay;
        }
        set delay(value) {
            this._delay = value;
        }
        startTimer(delay) {
            if (delay !== undefined)
                this._delay = delay;
            this._lastTime = Date.now();
            this._timeout = this._lastTime + this._delay;
        }
        stopTimer() {
            this._timeout = 0;
        }
        timeRemaining() {
            this._lastTime = Date.now();
            return this._timeout - this._lastTime;
        }
        get isTimedOut() {
            return this.timeRemaining() < 0;
        }
    }
    exports.Timer = Timer;
});
define("Playfield/Abilities/index", ["require", "exports", "Playfield/Abilities/ClickableMixin", "Playfield/Abilities/ClickerMixin", "Playfield/Abilities/DispatchableMixin", "Playfield/Abilities/DispatcherMixin", "Playfield/Abilities/DraggableMixin", "Playfield/Abilities/DraggerMixin", "Playfield/Abilities/EditableMixin", "Playfield/Abilities/EditerMixin", "Playfield/Abilities/HoverableMixin", "Playfield/Abilities/HovererMixin", "Playfield/Abilities/PressableMixin", "Playfield/Abilities/PresserMixin", "Playfield/Abilities/Resizable", "Playfield/Abilities/SelectableMixin", "Playfield/Abilities/SelecterMixin", "Playfield/Abilities/Timer"], function (require, exports, ClickableMixin_1, ClickerMixin_1, DispatchableMixin_2, DispatcherMixin_1, DraggableMixin_1, DraggerMixin_1, EditableMixin_1, EditerMixin_1, HoverableMixin_1, HovererMixin_1, PressableMixin_1, PresserMixin_1, Resizable_1, SelectableMixin_2, SelecterMixin_1, Timer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = exports.Selecter = exports.Selectable = exports.Resizable = exports.Presser = exports.Pressable = exports.Hoverer = exports.Hoverable = exports.Editer = exports.Editable = exports.Dragger = exports.Draggable = exports.Dispatcher = exports.Dispatchable = exports.Clicker = exports.Clickable = void 0;
    Object.defineProperty(exports, "Clickable", { enumerable: true, get: function () { return ClickableMixin_1.Clickable; } });
    Object.defineProperty(exports, "Clicker", { enumerable: true, get: function () { return ClickerMixin_1.Clicker; } });
    Object.defineProperty(exports, "Dispatchable", { enumerable: true, get: function () { return DispatchableMixin_2.Dispatchable; } });
    Object.defineProperty(exports, "Dispatcher", { enumerable: true, get: function () { return DispatcherMixin_1.Dispatcher; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return DraggableMixin_1.Draggable; } });
    Object.defineProperty(exports, "Dragger", { enumerable: true, get: function () { return DraggerMixin_1.Dragger; } });
    Object.defineProperty(exports, "Editable", { enumerable: true, get: function () { return EditableMixin_1.Editable; } });
    Object.defineProperty(exports, "Editer", { enumerable: true, get: function () { return EditerMixin_1.Editer; } });
    Object.defineProperty(exports, "Hoverable", { enumerable: true, get: function () { return HoverableMixin_1.Hoverable; } });
    Object.defineProperty(exports, "Hoverer", { enumerable: true, get: function () { return HovererMixin_1.Hoverer; } });
    Object.defineProperty(exports, "Pressable", { enumerable: true, get: function () { return PressableMixin_1.Pressable; } });
    Object.defineProperty(exports, "Presser", { enumerable: true, get: function () { return PresserMixin_1.Presser; } });
    Object.defineProperty(exports, "Resizable", { enumerable: true, get: function () { return Resizable_1.Resizable; } });
    Object.defineProperty(exports, "Selectable", { enumerable: true, get: function () { return SelectableMixin_2.Selectable; } });
    Object.defineProperty(exports, "Selecter", { enumerable: true, get: function () { return SelecterMixin_1.Selecter; } });
    Object.defineProperty(exports, "Timer", { enumerable: true, get: function () { return Timer_1.Timer; } });
});
define("Playfield/Tile", ["require", "exports", "Utils/index", "Playfield/Options", "Playfield/Abilities/index"], function (require, exports, Utils_1, Options_1, Abilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = exports._Tile = exports.TileOptions = void 0;
    /**
     * A Tile is a rectangular item on a Playfield.
     * It can draw itself on the Playfield
    * It has its own set of GfxParms (font, colors, x/y offset)`
     * it can move around
     * it is hierarcically organized so is drawn relative to its parent
     */
    class TileOptions extends Options_1.Options {
        constructor() {
            super(...arguments);
            this.margins = (new Utils_1.Margins).Margins(0, 0, 0, 0);
            this.backgroundColor = "white";
        }
    }
    exports.TileOptions = TileOptions;
    class _Tile {
    }
    exports._Tile = _Tile;
    ;
    ;
    (0, Utils_1.applyMixins)(_Tile, [Abilities_1.Dispatchable, Utils_1.Logger, Utils_1.Tree, Utils_1.Rect, Utils_1.RelRect]);
    ;
    class Tile extends _Tile {
        constructor(name, parent, x0, y0, w, h) {
            super();
            this._options = new TileOptions;
            this._tabOrder = 0;
            this.RelRect(x0, y0, x0 + w - 1, y0 + h - 1);
            this.Tree(name, parent);
            this._data = null;
        }
        static cast(obj) {
            return obj;
        }
        // --- Overrides --- //
        addChild(child) {
            super.addChild(child);
            child.playfield = this._playfield;
            child._gfx = this._playfield.gfx.clone();
            child._tabOrder = this.children.length - 1;
            let anyChild = child;
            // is this a good idea? or should we enforce objects initizing within their constructors?
            if (anyChild.Clickable && !anyChild.isClickable)
                anyChild.Clickable();
            if (anyChild.Dispatchable && !anyChild.isDispatchable)
                anyChild.Dispatchable();
            if (anyChild.Draggable && !anyChild.isDraggable)
                anyChild.Draggable();
            if (anyChild.Editable && !anyChild.isEditable)
                anyChild.Editable();
            if (anyChild.Hoverable && !anyChild.isHoverable)
                anyChild.Hoverable();
            if (anyChild.Pressable && !anyChild.isPressable)
                anyChild.Pressable();
            if (anyChild.Resizable && !anyChild.isResizable)
                anyChild.Resizable();
            if (anyChild.Selectable && !anyChild.isSelectable)
                anyChild.Selectable();
            if (anyChild.Clicker && !anyChild.isClicker)
                anyChild.Clicker();
            if (anyChild.Dispatcher && !anyChild.isDispatcher)
                anyChild.Dispatcher();
            if (anyChild.Dragger && !anyChild.isDragger)
                anyChild.Dragger();
            if (anyChild.Editer && !anyChild.isEditer)
                anyChild.Editer();
            if (anyChild.Hoverer && !anyChild.isHoverer)
                anyChild.Hoverer();
            if (anyChild.Presser && !anyChild.isPresser)
                anyChild.Presser();
            if (anyChild.Resizer && !anyChild.isResizer)
                anyChild.Resizer();
            if (anyChild.Selecter && !anyChild.isSelecter)
                anyChild.Selecter();
            if (anyChild.Logger && !anyChild.isLoggable)
                anyChild.Logger();
            if (anyChild.isDraggable && anyChild.isPressable)
                this.error("Warning: It's not a good idea to mix Draggable with Pressable since Draggable will invalidate the Event on isPress");
        }
        _updateGparms(enable) {
            this.gfx.gparms.fillColor = this._options.backgroundColor;
        }
        // --- Public Methods --- //
        inBoundsChildren(x, y, checkThis = true) {
            let found = Tile.null;
            if (checkThis)
                found = this.inBounds(x, y);
            if (found)
                return found;
            for (let child of this.children) {
                let tileChild = Tile.cast(child);
                found = tileChild.inBoundsChildren(x, y);
                if (found)
                    break;
            }
            return found;
        }
        inBounds(x, y) {
            if ((0, Utils_1.between)(this.X, x, this.X + this.w) &&
                (0, Utils_1.between)(this.Y, y, this.Y + this.h))
                return this;
            return Tile.null;
        }
        drawChildren(enable) {
            this.children.forEach(child => child.draw(enable));
        }
        draw(enable = true) {
            this._updateGparms(enable);
            this.drawChildren(enable);
        }
        // --- OnActions --- //
        onTick() {
            this.children.forEach(child => child.onTick());
        }
        // --- Overrides --- //
        printMe(node, ctx) {
            console.log(" | ".repeat(node.depth()), node.name, node.X, node.Y, node.W, node.H);
        }
        // --- Accessors --- //
        get gfx() {
            return this._gfx;
        }
        get X() {
            // Absolute Screen coordinates
            if (this.parent)
                return this.x + Tile.cast(this.parent).X;
            return this.x;
        }
        get Y() {
            // Absolute Screen Coordinates
            if (this.parent)
                return this.y + Tile.cast(this.parent).Y;
            return this.y;
        }
        get W() {
            // Absolute Screen Coordinates (kinda)
            return this.w;
        }
        get H() {
            // Absolute Screen Coordinates (kinda)
            return this.h;
        }
        get playfield() {
            return this._playfield;
        }
        set playfield(value) {
            this._playfield = value;
            this._gfx = this._playfield.gfx.clone();
        }
        get tabOrder() {
            return this._tabOrder;
        }
        set tabOrder(value) {
            this._tabOrder = value;
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        get options() {
            return this._options;
        }
        set options(value) {
            this._options = value;
        }
    }
    exports.Tile = Tile;
    // --- Static Members --- //
    Tile.null = null;
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Utils/index"], function (require, exports, Tile_9, Abilities_2, Utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = exports._RootTile = void 0;
    class _RootTile extends Tile_9.Tile {
    }
    exports._RootTile = _RootTile;
    ;
    ;
    (0, Utils_2.applyMixins)(_RootTile, [Abilities_2.Resizable, Abilities_2.Dispatcher, Utils_2.Logger, Abilities_2.Clicker, Abilities_2.Presser, Abilities_2.Selecter, Abilities_2.Dragger, Abilities_2.Editer, Abilities_2.Hoverer]);
    class RootTile extends _RootTile {
        constructor(name, parent, x0, y0, x1, y1) {
            super(name, parent, x0, y0, x1, y1);
        }
        // -- static members --- //
        static cast(obj) {
            return obj;
        }
        // --- Overrides --- //
        draw(enable = true) {
            this._updateGparms(enable);
            this.gfx.clipRect(this.X, this.Y, this.W, this.H);
            this.gfx.rect(this.X, this.Y, this.W, this.H);
            this.drawChildren(enable);
            this.gfx.restore();
        }
    }
    exports.RootTile = RootTile;
});
define("Playfield/EventQueue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventQueue = void 0;
    class EventQueue {
        constructor() {
            this._eventQueue = [];
        }
        // --- Public Methods --- //
        getEvent() {
            return this._eventQueue.shift();
        }
        pushEvent(pfEvent) {
            this._eventQueue.push(pfEvent);
        }
    }
    exports.EventQueue = EventQueue;
});
define("Playfield/Playfield", ["require", "exports", "Playfield/Tile", "Utils/index", "Playfield/RootTile", "Playfield/Options"], function (require, exports, Tile_10, Utils_3, RootTile_1, Options_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playfield = exports._Playfield = exports.PlayfieldOptions = void 0;
    /**
     * Playfield is a graphic area for rendering
     * And it collects human inputs and dispatches them to tiles
     * A Playfield has a tree of Tiles (rectangles)
     */
    class PlayfieldOptions extends Options_2.Options {
    }
    exports.PlayfieldOptions = PlayfieldOptions;
    class _Playfield {
    }
    exports._Playfield = _Playfield;
    ;
    ;
    (0, Utils_3.applyMixins)(_Playfield, [Utils_3.Logger, Utils_3.Rect]);
    class Playfield extends _Playfield {
        constructor(gfx, eventQueue) {
            super();
            this._lastTime = 0;
            this._delay = -1;
            this._timerId = 0;
            this._gfx = gfx;
            this._eventQueue = eventQueue;
            this.Rect(0, 0, this._gfx.width, this._gfx.height);
            this._rootTile = new RootTile_1.RootTile("_root", Tile_10.Tile.null, 0, 0, this.w, this.h);
            this._rootTile.playfield = this;
        }
        // --- Public Methods --- //
        clear() {
            this.gfx.rect(0, 0, this._gfx.width, this._gfx.height);
        }
        redraw(enable = true) {
            this.clear();
            this.rootTile.draw(enable);
        }
        start(delay = 125) {
            this._delay = delay;
            this._lastTime = Date.now();
            this.redraw(enable);
            // if (this._delay >= 0) this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
            if (this._delay >= 0)
                this._timerId = setInterval(this._tick.bind(this), this._delay, this);
        }
        stop() {
            this._delay = -1;
            clearInterval(this._timerId);
        }
        // --- Private Methods --- //
        _tick() {
            // clearTimeout(this._timerId);
            let now = Date.now();
            let extra = now - this._lastTime;
            this._handleEvents();
            this.rootTile.onTick(); // process all ticks
            this.redraw(enable); // redraw the playfield
            this._lastTime = Date.now();
            let delta = this._lastTime - now;
            if (this._delay && (delta > this._delay))
                console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
            // this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
        }
        _handleEvents() {
            let that = this;
            for (let pfEvent = next(); pfEvent; pfEvent = next()) {
                this._rootTile.onEvent(pfEvent);
            }
            function next() {
                return that._eventQueue.getEvent();
            }
        }
        // --- Accessors --- //
        get playfield() {
            return this;
        }
        get rootTile() {
            return this._rootTile;
        }
        get gfx() {
            return this._gfx;
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/Splitter", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Abilities/index", "Utils/index", "Playfield/RootTile"], function (require, exports, Tile_11, Abilities_3, Abilities_4, Utils_4, RootTile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Splitter = exports._Splitter = void 0;
    class _Splitter extends Tile_11.Tile {
    }
    exports._Splitter = _Splitter;
    ;
    ;
    (0, Utils_4.applyMixins)(_Splitter, [Abilities_4.Resizable, Abilities_4.Hoverable, Abilities_4.Draggable, Abilities_3.Dispatcher, Utils_4.Logger, Abilities_3.Clicker, Abilities_3.Presser, Abilities_3.Selecter, Abilities_3.Dragger, Abilities_3.Editer, Abilities_3.Hoverer]);
    class Splitter extends _Splitter {
        constructor(name, parent, topPercent = 0.5, leftPercent = 0.5, hGutterSize = 15, vGutterSize = 15) {
            super(name, parent, 0, 0, parent.w, parent.h);
            this.Logger();
            this._margins = new Utils_4.Margins().Margins(2, 2, 2, 2);
            this._hGutterSize = hGutterSize;
            this._vGutterSize = vGutterSize;
            if (topPercent === 0 || topPercent === 1)
                this._hGutterSize = 0;
            if (leftPercent === 0 || leftPercent === 1)
                this._vGutterSize = 0;
            this._topPercent = topPercent;
            this._leftPercent = leftPercent;
            this._initOnFirstCall();
            this.isDraggable = true;
        }
        _initOnFirstCall() {
            if (!this._ne) {
                this._isHGutterHovering = false;
                this._isVGutterHovering = false;
                this._hGutterInit(this._topPercent);
                this._vGutterInit(this._leftPercent);
                this._ne = new RootTile_2.RootTile("ne", this, 0, 0, 0, 0);
                this._nw = new RootTile_2.RootTile("nw", this, 0, 0, 0, 0);
                this._se = new RootTile_2.RootTile("se", this, 0, 0, 0, 0);
                this._sw = new RootTile_2.RootTile("sw", this, 0, 0, 0, 0);
                this._resize();
            }
        }
        _resize() {
            this._neSize();
            this._seSize();
            this._nwSize();
            this._swSize();
        }
        _neSize() {
            this._ne.x0 = this._margins.left;
            this._ne.y0 = this._margins.top;
            this._ne.x1 = this._vGutterRect.x - this._margins.right;
            this._ne.y1 = Math.max(0, this._hGutterRect.y - this._margins.bottom);
        }
        _seSize() {
            this._se.x0 = this._margins.left;
            this._se.y0 = this._hGutterRect.y + this._hGutterRect.h + 1;
            this._se.x1 = this._vGutterRect.x - this._margins.right;
            this._se.y1 = this.y1 - this._margins.bottom;
        }
        _nwSize() {
            this._nw.x0 = this._vGutterRect.x + this._vGutterRect.w + this._margins.right;
            this._nw.y0 = this._margins.top;
            this._nw.x1 = Math.max(0, this.x1 - this._margins.right);
            this._nw.y1 = Math.max(0, this._hGutterRect.y - this._margins.bottom);
        }
        _swSize() {
            this._sw.x0 = this._vGutterRect.x + this._vGutterRect.w + this._margins.right;
            this._sw.y0 = this._hGutterRect.y + this._hGutterRect.h + 1;
            this._sw.x1 = Math.max(0, this.x1 - this._margins.right);
            this._sw.y1 = Math.max(0, this.y1 - this._margins.bottom);
        }
        _vGutterInit(leftPercent) {
            if (this._vGutterSize === 0) {
                this._vGutterRect = (new Utils_4.Rect()).Rect(this.w * leftPercent, 0, 0, this.h);
            }
            else {
                let x0 = (0, Utils_4.int)(this.w * leftPercent) - (0, Utils_4.int)(this._hGutterSize / 2);
                let y0 = this._margins.top;
                this._vGutterRect = (new Utils_4.Rect()).Rect(x0, y0, this._vGutterSize, this.h - this._margins.top - this._margins.bottom);
            }
        }
        _hGutterInit(topPercent) {
            if (this._hGutterSize === 0) {
                this._hGutterRect = (new Utils_4.Rect().Rect(0, this.h * topPercent, this.w, 0));
            }
            let x0 = 0;
            let y0 = (0, Utils_4.int)(this.h * topPercent) - (0, Utils_4.int)(this._hGutterSize / 2);
            this._hGutterRect = (new Utils_4.Rect()).Rect(x0, y0, this.w, this._hGutterSize);
        }
        _hoverGutter(gutter, pfEvent) {
            if (!gutter)
                return;
            return (0, Utils_4.between)(gutter.x, pfEvent.x - this.X, gutter.x + gutter.w) && (0, Utils_4.between)(gutter.y, pfEvent.y - this.Y, gutter.y + gutter.h);
        }
        // --- Overrides --- //
        addChild(child) {
            if (this.children.length < 4)
                super.addChild(child);
            else
                throw new Error("You must use Splitter.ne, Splitter.nw, Splitter.se or Splitter.sw");
        }
        _drawGutter(gutterRect, hover) {
            if (gutterRect.x < 0)
                return;
            if (gutterRect.y < 0)
                return;
            let gparms = this.gfx.gparms;
            gparms.borderColor = "";
            if (hover) {
                gparms.fillColor = "black";
                this.gfx.rect(this.X + gutterRect.x, this.Y + gutterRect.y, gutterRect.w, gutterRect.h);
            }
            else {
                gparms.fillColor = "";
                gparms.borderColor = "green";
                if (gutterRect.w > gutterRect.h) {
                    // horizontal
                    this.gfx.line(this.X + gutterRect.x, this.Y + gutterRect.y + (0, Utils_4.int)(gutterRect.h / 2), this.X + gutterRect.x + gutterRect.w, this.Y + (0, Utils_4.int)(gutterRect.y + gutterRect.h / 2));
                }
                else {
                    // vertical
                    this.gfx.line(this.X + gutterRect.x + (0, Utils_4.int)(gutterRect.w / 2), this.Y + gutterRect.y, this.X + gutterRect.x + (gutterRect.w / 2), this.Y + gutterRect.y + gutterRect.h);
                }
            }
        }
        // --- Overrides --- //
        relResize(dw, dh) {
            this._neSize();
            this._seSize();
            this._nwSize();
            this._swSize();
        }
        draw(enable = true) {
            this._drawGutter(this._hGutterRect, this._isHGutterHovering);
            this._drawGutter(this._vGutterRect, this._isVGutterHovering);
            this.gfx.gparms.borderColor = "black";
            this.gfx.gparms.fillColor = "";
            this.ne.draw(enable);
            this.se.draw(enable);
            this.nw.draw(enable);
            this.sw.draw(enable);
        }
        // --- onActions --- //
        onRelResize(dw, dh, pfEvent) {
            let thisTile = Tile_11.Tile.cast(this);
            if (dw) {
                this._hGutterRect.rsize(dw, 0);
                this._nw.onRelResize(dw, 0, pfEvent);
            }
            if (dh) {
                this._vGutterRect.rsize(0, dh);
                this._se.onRelResize(0, dh, pfEvent);
            }
            if (dw || dh) {
                this._sw.onRelResize(dw, dh, pfEvent);
            }
        }
        onGrab(dx, dy, pfEvent) {
            this.log("onGrab");
            if (this._isHGutterHovering || this._isVGutterHovering) {
                this.isDragging = true;
                pfEvent.isActive = false;
                return true;
            }
            return false;
        }
        onDrop(pfEvent) {
            this.log("onDrop");
            this._isHGutterHovering = false;
            this._isVGutterHovering = false;
            super.onDrop(pfEvent);
        }
        onDrag(dx, dy, pfEvent) {
            if (this._isHGutterHovering) {
                this._hGutterRect.rmove(0, dy);
                this._ne.onRelResize(0, dy, pfEvent);
                this._nw.onRelResize(0, dy, pfEvent);
                this._se.rmove(0, dy);
                this._se.onRelResize(0, -dy, pfEvent);
                this._sw.rmove(0, dy);
                this._sw.onRelResize(0, -dy, pfEvent);
                pfEvent.isActive = false;
            }
            if (this._isVGutterHovering) {
                this._vGutterRect.rmove(dx, 0);
                this._ne.onRelResize(dx, 0, pfEvent);
                this._se.onRelResize(dx, 0, pfEvent);
                this._nw.rmove(dx, 0);
                this._nw.onRelResize(-dx, 0, pfEvent);
                this._sw.rmove(dx, 0);
                this._sw.onRelResize(-dx, 0, pfEvent);
                pfEvent.isActive = false;
            }
        }
        onEvent(pfEvent) {
            this.dispatchEvent(pfEvent, this.parent);
            if (pfEvent.isActive)
                this.dispatchEventToChildren(pfEvent);
        }
        onHovering(pfEvent) {
            if (this.isDragging)
                return;
            this._isHGutterHovering = this._hoverGutter(this._hGutterRect, pfEvent);
            this._isVGutterHovering = this._hoverGutter(this._vGutterRect, pfEvent);
        }
        onExit(pfEvent) {
            if (this.isDragging)
                return;
            super.onExit(pfEvent);
        }
        // --- Accessors --- //
        get ne() {
            this._initOnFirstCall();
            return this._ne;
        }
        set ne(value) {
            this._ne = value;
        }
        get nw() {
            this._initOnFirstCall();
            return this._nw;
        }
        set nw(value) {
            this._nw = value;
        }
        get se() {
            this._initOnFirstCall();
            return this._se;
        }
        set se(value) {
            this._se = value;
        }
        get sw() {
            this._initOnFirstCall();
            return this._sw;
        }
        set sw(value) {
            this._sw = value;
        }
    }
    exports.Splitter = Splitter;
});
define("Playfield/HSplitter", ["require", "exports", "Playfield/Tile", "Playfield/RootTile", "Playfield/Splitter"], function (require, exports, Tile_12, RootTile_3, Splitter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HSplitter = void 0;
    class HSplitter extends Splitter_1.Splitter {
        constructor(name, parent, topPercent = 0.5) {
            super(name, parent, topPercent, 0);
        }
        _initOnFirstCall() {
            if (!this._north) {
                this._hGutterInit(this._topPercent);
                this._north = new RootTile_3.RootTile("ne", this, 0, 0, 0, 0);
                this._south = new RootTile_3.RootTile("se", this, 0, 0, 0, 0);
                this._resize();
            }
        }
        _resize() {
            this._northSize();
            this._southSize();
        }
        _northSize() {
            this._north.x0 = this._margins.left;
            this._north.y0 = this._margins.top;
            this._north.x1 = this.x1 - this._margins.right;
            this._north.y1 = this._hGutterRect.y;
        }
        _southSize() {
            this._south.x0 = this._margins.left;
            this._south.y0 = this._hGutterRect.y;
            this._south.x1 = this.x1 - this._margins.right;
            this._south.y1 = this.y1 - this._margins.bottom;
        }
        // --- Overrides --- //
        addChild(child) {
            if (this.children.length < 2)
                super.addChild(child);
            else
                throw new Error("You must use HSplitter.north or HSplitter.south");
        }
        // --- Overrides --- //
        relResize(dw, dh) {
            this._northSize();
            this._southSize();
        }
        draw(enable = true) {
            this._drawGutter(this._hGutterRect, this._isHGutterHovering);
            this.gfx.gparms.borderColor = "black";
            this.north.draw(enable);
            this.south.draw(enable);
        }
        // --- onActions --- //
        onRelResize(dw, dh, pfEvent) {
            let thisTile = Tile_12.Tile.cast(this);
            if (dw) {
                this._hGutterRect.rsize(dw, 0);
            }
            if (dh) {
                this._south.onRelResize(0, dh, pfEvent);
            }
        }
        onDrag(dx, dy, pfEvent) {
            if (this._isHGutterHovering) {
                this._hGutterRect.rmove(0, dy);
                this._north.onRelResize(0, dy, pfEvent);
                this._south.rmove(0, dy);
                this._south.onRelResize(0, -dy, pfEvent);
                pfEvent.isActive = false;
            }
        }
        // --- Accessors --- //
        get north() {
            this._initOnFirstCall();
            return this._north;
        }
        set north(value) {
            this._north = value;
        }
        get south() {
            this._initOnFirstCall();
            return this._south;
        }
        set south(value) {
            this._south = value;
        }
    }
    exports.HSplitter = HSplitter;
});
define("Playfield/VSplitter", ["require", "exports", "Playfield/Tile", "Playfield/RootTile", "Playfield/Splitter"], function (require, exports, Tile_13, RootTile_4, Splitter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VSplitter = void 0;
    class VSplitter extends Splitter_2.Splitter {
        constructor(name, parent, leftPercent = 0.5) {
            super(name, parent, 0, leftPercent);
        }
        _initOnFirstCall() {
            if (!this._east) {
                this._vGutterInit(this._leftPercent);
                this._east = new RootTile_4.RootTile("east", this, 0, 0, 0, 0);
                this._west = new RootTile_4.RootTile("west", this, 0, 0, 0, 0);
                this._resize();
            }
        }
        _resize() {
            this._eastSize();
            this._westSize();
        }
        _eastSize() {
            this._east.x = this._margins.left;
            this._east.y = this._vGutterRect.y;
            this._east.w = this._vGutterRect.x - this.x0;
            this._east.h = this.h - this._margins.bottom;
        }
        _westSize() {
            this._west.x = this._vGutterRect.x;
            this._west.y = this._margins.top;
            this._west.w = this.w - this._vGutterRect.x - this._margins.right;
            this._west.h = this.h - this._margins.bottom;
        }
        // --- Overrides --- //
        addChild(child) {
            if (this.children.length < 2)
                super.addChild(child);
            else
                throw new Error("You must use VSplitter.east or VSplitter.west");
        }
        // --- Overrides --- //
        relResize(dw, dh) {
            this._eastSize();
            this._westSize();
        }
        draw(enable = true) {
            this._drawGutter(this._vGutterRect, this._isVGutterHovering);
            this.gfx.gparms.borderColor = "black";
            this.east.draw(enable);
            this.west.draw(enable);
        }
        // --- onActions --- //
        onRelResize(dw, dh, pfEvent) {
            let thisTile = Tile_13.Tile.cast(this);
            if (dw) {
                this._west.onRelResize(dw, 0, pfEvent);
            }
            if (dh) {
                this._vGutterRect.rsize(0, dh);
            }
        }
        onDrop(pfEvent) {
            this._isVGutterHovering = false;
            super.onDrop(pfEvent);
        }
        onDrag(dx, dy, pfEvent) {
            if (this._isVGutterHovering) {
                this._vGutterRect.rmove(dx, 0);
                this._east.onRelResize(dx, 0, pfEvent);
                this._west.rmove(dx, 0);
                this._west.onRelResize(-dx, 0, pfEvent);
                pfEvent.isActive = false;
            }
        }
        onEvent(pfEvent) {
        }
        onHovering(pfEvent) {
            if (this.isDragging)
                return;
            this._isVGutterHovering = this._hoverGutter(this._vGutterRect, pfEvent);
        }
        onExit(pfEvent) {
            if (this.isDragging)
                return;
            super.onExit(pfEvent);
        }
        // --- Accessors --- //
        get east() {
            this._initOnFirstCall();
            return this._east;
        }
        set east(value) {
            this._east = value;
        }
        get west() {
            this._initOnFirstCall();
            return this._west;
        }
        set west(value) {
            this._west = value;
        }
    }
    exports.VSplitter = VSplitter;
});
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile", "Playfield/EventQueue", "Playfield/Splitter", "Playfield/HSplitter", "Playfield/VSplitter", "Playfield/Options", "Playfield/RootTile"], function (require, exports, Playfield_1, Tile_14, EventQueue_1, Splitter_3, HSplitter_1, VSplitter_1, Options_3, RootTile_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = exports.Options = exports.VSplitter = exports.HSplitter = exports.Splitter = exports.EventQueue = exports.TileOptions = exports.Tile = exports.PlayfieldOptions = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "PlayfieldOptions", { enumerable: true, get: function () { return Playfield_1.PlayfieldOptions; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_14.Tile; } });
    Object.defineProperty(exports, "TileOptions", { enumerable: true, get: function () { return Tile_14.TileOptions; } });
    Object.defineProperty(exports, "EventQueue", { enumerable: true, get: function () { return EventQueue_1.EventQueue; } });
    Object.defineProperty(exports, "Splitter", { enumerable: true, get: function () { return Splitter_3.Splitter; } });
    Object.defineProperty(exports, "HSplitter", { enumerable: true, get: function () { return HSplitter_1.HSplitter; } });
    Object.defineProperty(exports, "VSplitter", { enumerable: true, get: function () { return VSplitter_1.VSplitter; } });
    Object.defineProperty(exports, "Options", { enumerable: true, get: function () { return Options_3.Options; } });
    Object.defineProperty(exports, "RootTile", { enumerable: true, get: function () { return RootTile_5.RootTile; } });
});
define("Browser/BrowserPlayfieldEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserPlayfieldEvent = void 0;
    class BrowserPlayfieldEvent {
        constructor(event, ratio = 1.0) {
            this.event = event;
            this._isActive = true;
            // this.type = event.type;
            // mouse events
            this.isMouseEvent = event.type.startsWith("mouse") || event.type.startsWith("wheel");
            this.isKeyboardEvent = event.type.startsWith("key");
            this.x = Math.floor(event.offsetX / ratio);
            this.y = Math.floor(event.offsetY / ratio);
            this.isMove = event.type === "mousemove";
            this.isPress = event.type === "mousedown" && event.button === 0;
            this.isRelease = event.type === "mouseup" && event.button === 0;
            this.isMenu = event.type === "mousedown" && event.button === 2;
            this.isMenuRelease = event.type === "mousedown" && event.button === 2;
            // keyboard events
            this.key = event.key;
            this.isKeyDown = event.type === "keydown";
            this.isKeyUp = event.type === "keyup";
            this.isShift = event.shiftKey;
            this.isControl = event.ctrlKey;
            this.isAlt = event.altKey;
            this.isOption = event.altKey;
            this.isMeta = event.metaKey;
            this.isCommand = event.metaKey;
            // gestures
            this.swipe = event.wheelDelta;
            this.isSwipeLeft = event.wheelDelta < 0;
            this.isSwipeRight = event.wheelDelta > 0;
        }
        // --- Accessors --- //
        get event() {
            return this._event;
        }
        set event(value) {
            this._event = value;
        }
        get x() {
            return this._x;
        }
        set x(value) {
            this._x = value;
        }
        get y() {
            return this._y;
        }
        set y(value) {
            this._y = value;
        }
        get isMove() {
            return this._isMove;
        }
        set isMove(value) {
            this._isMove = value;
        }
        get isPress() {
            return this._isPress;
        }
        set isPress(value) {
            this._isPress = value;
        }
        get isRelease() {
            return this._isRelease;
        }
        set isRelease(value) {
            this._isRelease = value;
        }
        get isMenu() {
            return this._isMenu;
        }
        set isMenu(value) {
            this._isMenu = value;
        }
        get isMenuRelease() {
            return this._isMenuRelease;
        }
        set isMenuRelease(value) {
            this._isMenuRelease = value;
        }
        get key() {
            return this._key;
        }
        set key(value) {
            this._key = value;
        }
        get isKeyDown() {
            return this._isKeyDown;
        }
        set isKeyDown(value) {
            this._isKeyDown = value;
        }
        get isKeyUp() {
            return this._isKeyUp;
        }
        set isKeyUp(value) {
            this._isKeyUp = value;
        }
        get isShift() {
            return this._isShift;
        }
        set isShift(value) {
            this._isShift = value;
        }
        get isControl() {
            return this._isControl;
        }
        set isControl(value) {
            this._isControl = value;
        }
        get isAlt() {
            return this._isAlt;
        }
        set isAlt(value) {
            this._isAlt = value;
        }
        get isOption() {
            return this._isOption;
        }
        set isOption(value) {
            this._isOption = value;
        }
        get isMeta() {
            return this._isMeta;
        }
        set isMeta(value) {
            this._isMeta = value;
        }
        get isCommand() {
            return this._isCommand;
        }
        set isCommand(value) {
            this._isCommand = value;
        }
        get swipe() {
            return this._swipe;
        }
        set swipe(value) {
            this._swipe = value;
        }
        get isSwipeLeft() {
            return this._isSwipeLeft;
        }
        set isSwipeLeft(value) {
            this._isSwipeLeft = value;
        }
        get isSwipeRight() {
            return this._isSwipeRight;
        }
        set isSwipeRight(value) {
            this._isSwipeRight = value;
        }
        get isActive() {
            return this._isActive;
        }
        set isActive(value) {
            this._isActive = value;
        }
        get isMouseEvent() {
            return this._isMouseEvent;
        }
        set isMouseEvent(value) {
            this._isMouseEvent = value;
        }
        get isKeyboardEvent() {
            return this._isKeyboardEvent;
        }
        set isKeyboardEvent(value) {
            this._isKeyboardEvent = value;
        }
    }
    exports.BrowserPlayfieldEvent = BrowserPlayfieldEvent;
});
define("Browser/BrowserEventPump", ["require", "exports", "Browser/BrowserPlayfieldEvent"], function (require, exports, BrowserPlayfieldEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserEventPump = void 0;
    class BrowserEventPump {
        constructor(canvas, eventQueue) {
            this._ratio = 1.0;
            this._eventQueue = eventQueue;
            this._registerEventHandlers(canvas);
        }
        // --- Private Methods --- //
        _registerEventHandlers(canvas) {
            canvas.addEventListener('mousedown', this._handler.bind(this));
            canvas.addEventListener('mousemove', this._handler.bind(this));
            canvas.addEventListener('mouseup', this._handler.bind(this));
            canvas.addEventListener('wheel', this._handler.bind(this));
            addEventListener("keydown", this._handler.bind(this));
            addEventListener("keyup", this._handler.bind(this));
            this._ratio = canvas._ratio;
        }
        _handler(event) {
            event.preventDefault();
            let pfEvent = new BrowserPlayfieldEvent_1.BrowserPlayfieldEvent(event, this._ratio);
            this._eventQueue.pushEvent(pfEvent);
        }
    }
    exports.BrowserEventPump = BrowserEventPump;
});
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
define("Browser/BrowserFiles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserFiles = exports.BrowserFile = void 0;
    class BrowserFile {
        constructor(key, path) {
            this._key = key;
            this._path = path;
            this._status = BrowserFile.STATUS_ARRAY[0];
            this._length = 0;
        }
        get status() {
            return this._status;
        }
        set status(s) {
            this._status = s;
        }
        get isError() {
            return ["unintialized", "error", "abort"].includes(this._status);
        }
        get isDone() {
            return ["loadend", "error", "abort"].includes(this._status);
        }
        get isInProgress() {
            return ["initialized", "loadstart", "load", "progress"].includes(this._status);
        }
    }
    exports.BrowserFile = BrowserFile;
    BrowserFile.STATUS_ARRAY = ["uninitialized", "initialized", "loadstart", "load", "loadend", "progress", "error", "abort"];
    class BrowserFiles {
        constructor() {
            this._files = {};
        }
        load(key, path) {
            let file = new BrowserFile(key, path);
            this._files[key] = file;
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            this._addListeners(xhr, file);
            xhr.open("GET", path);
            xhr.send();
            file.status = "initialized";
            return xhr;
        }
        get(key) {
            return this._files[key];
        }
        _addListeners(xhr, file) {
            xhr._file = file;
            xhr.addEventListener('loadstart', this._handleEvent.bind(this));
            xhr.addEventListener('load', this._handleEvent.bind(this));
            xhr.addEventListener('loadend', this._handleEvent.bind(this));
            xhr.addEventListener('progress', this._handleEvent.bind(this));
            xhr.addEventListener('error', this._handleEvent.bind(this));
            xhr.addEventListener('abort', this._handleEvent.bind(this));
        }
        _handleEvent(event) {
            console.log(event);
            let xhr = event.currentTarget;
            let file = xhr._file;
            console.log(file);
            if (xhr.status !== 200) {
                file.status = "error";
                file._error = xhr.statusText;
            }
            else {
                file.status = event.type;
                file._error = xhr.statusText;
                file._data = xhr.response;
                if (event.total)
                    file._length = event.total;
            }
        }
    }
    exports.BrowserFiles = BrowserFiles;
});
define("Browser/BrowserGfx", ["require", "exports", "Playfield/Graphics/GfxParms", "Utils/index"], function (require, exports, GfxParms_2, Utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserGfx = void 0;
    function xx(x) {
        return (0, Utils_5.int)(x) + 0.5;
    }
    function yy(y) {
        return (0, Utils_5.int)(y) + 0.5;
    }
    /**
     * for documentation on why we add 0.5 to all x,y values see this
     * https://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540
     */
    var PIXEL_RATIO = (function () {
        var ctx = document.createElement("canvas").getContext("2d"), dpr = window.devicePixelRatio || 1, bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    })();
    function print_ratios() {
        var ctx = document.createElement("canvas").getContext("2d");
        console.log("dpr", window.devicePixelRatio);
        console.log("ctx.webkitBackingStorePixelRatio", ctx.webkitBackingStorePixelRatio);
        console.log("ctx.mozBackingStorePixelRatio", ctx.mozBackingStorePixelRatio);
        console.log("ctx.msBackingStorePixelRatio", ctx.msBackingStorePixelRatio);
        console.log("ctx.oBackingStorePixelRatio", ctx.oBackingStorePixelRatio);
        console.log("ctx.backingStorePixelRatio", ctx.backingStorePixelRatio);
    }
    function createHiDPICanvas(w, h, canvas, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        console.log("pixel ratio = " + ratio);
        var can = canvas || document.createElement("canvas");
        can.origWidth = w;
        can.origHeight = h;
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can._ratio = ratio;
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
    function createHiDPIFromCanvas(canvasId, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        print_ratios();
        console.log("pixel ratio = " + ratio);
        var can = document.querySelector(canvasId);
        let w = can.width;
        let h = can.height;
        can.origWidth = w;
        can.origHeight = h;
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = can.height + "px";
        can.style.height = can.height + "px";
        // can.style.width = w + "px";
        // can.style.height = h + "px";
        can._ratio = ratio;
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
    class BrowserGfx {
        constructor(canvasId, ratio) {
            if (canvasId)
                this._init(canvasId, ratio);
        }
        _init(canvasId, ratio) {
            // this._canvas = createHiDPICanvas(1000, 1000, document.querySelector(canvasId), 2.0);
            this._canvas = createHiDPIFromCanvas(canvasId, ratio);
            // this._canvas = document.querySelector(canvasId) as any;
            this._ctx = this._canvas.getContext("2d");
            this._gparms = new GfxParms_2.GfxParms();
            this._ctx.lineWidth = 1;
            this._ctx.fontKerning = "none";
            this._ctx.letterSpacing = "1px";
            this._ctx.textRendering = "geometricPrecision";
        }
        // --- Public Methods --- //
        clone() {
            let newGfx = new BrowserGfx();
            newGfx._canvas = this._canvas;
            newGfx._ctx = this._ctx;
            newGfx._gparms = this.gparms.clone();
            return newGfx;
        }
        vline(x, y0, y1, moveTo = true) {
            if (moveTo)
                this._ctx.moveTo(xx(x), yy(y0));
            this._ctx.lineTo(xx(x), yy(y1));
        }
        hline(x0, x1, y, moveTo = true) {
            if (moveTo)
                this._ctx.moveTo(xx(x0), yy(y));
            this._ctx.lineTo(xx(x1), yy(y));
        }
        rect(x, y, w, h) {
            let gparms = this.gparms;
            this._ctx.beginPath();
            if (gparms.borderRadius) {
                this._ctx.roundRect(xx(x - 1), yy(y - 1), w, h, gparms.borderRadius);
            }
            else {
                let x0 = x;
                let y0 = y;
                let x1 = (0, Utils_5.int)(x0) + (0, Utils_5.int)(w - 1);
                let y1 = (0, Utils_5.int)(y0) + (0, Utils_5.int)(h - 1);
                this.hline(x0, x1, y0, true);
                this.vline(x1, y0, y1, false);
                this.hline(x0, x1, y1, false);
                this.vline(x0, y0, y1, false);
            }
            this._ctx.closePath();
            if (gparms.fillColor) {
                this._ctx.fillStyle = gparms.fillColor;
                this._ctx.fill();
            }
            if (gparms.borderColor) {
                this._ctx.strokeStyle = gparms.borderColor;
                this._ctx.stroke();
            }
        }
        ellipse(x, y, w, h) {
            this._ctx.beginPath();
            this._ctx.ellipse(xx(x + w / 2), yy(y + h / 2), w / 2, h / 2, 0, 0, 2 * Math.PI);
            this._ctx.closePath();
            if (this.gparms.fillColor) {
                this._ctx.fillStyle = this.gparms.fillColor;
                this._ctx.fill();
            }
            if (this.gparms.borderColor) {
                this._ctx.strokeStyle = this.gparms.borderColor;
                this._ctx.stroke();
            }
        }
        circle(x, y, r) {
            this.ellipse(x - r, y - r, r * 2, r * 2);
        }
        line(x0, y0, x1, y1) {
            this._ctx.beginPath();
            if (x0 === x1) {
                this.vline(x0, y0, y1);
            }
            else if (y0 === y1) {
                this.hline(x0, x1, y0);
            }
            else {
                this._ctx.moveTo(xx(x0), yy(y0));
                this._ctx.lineTo(xx(x1), yy(y1));
            }
            this._ctx.closePath();
            if (this.gparms.borderColor) {
                this._ctx.strokeStyle = this.gparms.borderColor;
                this._ctx.stroke();
            }
        }
        text(msg, x = 0, y = 0, w, h) {
            this._ctx.fillStyle = this.gparms.color;
            this._ctx.font = this.gparms.font;
            this._ctx.textAlign = this.gparms.textAlign;
            this._ctx.textBaseline = this.gparms.textBaseline;
            let textX = x;
            let textY = y;
            if (!w || !h) {
                let boundingBox = this.boundingBox(msg);
                if (!w)
                    w = boundingBox.w;
                if (!h)
                    h = boundingBox.h;
            }
            if (this.gparms.textAlign === GfxParms_2.GfxParms.LEFT) {
                // do nothing
            }
            else if (this.gparms.textAlign === GfxParms_2.GfxParms.RIGHT) {
                textX += w - 1;
            }
            else if (this.gparms.textAlign === GfxParms_2.GfxParms.CENTER) {
                textX += w / 2 - 1;
            }
            else {
                throw new Error("Unknown textAlign: " + this.gparms.textAlign);
            }
            if (this.gparms.textBaseline === GfxParms_2.GfxParms.TOP) {
                textY -= 1;
            }
            else if (this.gparms.textBaseline === GfxParms_2.GfxParms.BOTTOM) {
                textY += h - 1;
            }
            else if (this.gparms.textBaseline === GfxParms_2.GfxParms.MIDDLE) {
                textY += (0, Utils_5.int)(h / 2);
            }
            else {
                throw new Error("Unknown textAlign: " + this.gparms.textAlign);
            }
            if (w) {
                this.clipRect(x, y, w, h);
                this._ctx.fillText(msg, xx(textX), yy(textY));
                this.restore();
            }
            else {
                this._ctx.fillText(msg, xx(textX), yy(textY));
            }
        }
        textRect(msg, x = 0, y = 0, w, h) {
            this._ctx.font = this.gparms.font;
            if (!w || !h) {
                let boundingBox = this.boundingBox(msg);
                if (!w)
                    w = boundingBox.w;
                if (!h)
                    h = boundingBox.h;
            }
            this.rect(x, y, w, h);
            this.text(msg, x, y, w, h);
        }
        boundingBox(msg) {
            this._ctx.font = this.gparms.font;
            let boundingBox = this._ctx.measureText(msg);
            return { w: Math.floor(boundingBox.width + 0.5), h: this.gparms.fontSize };
        }
        clipRect(x = 0, y = 0, w = this._ctx.canvas.width, h = this._ctx.canvas.height) {
            this.save();
            let region = new Path2D();
            region.rect(xx(x - 1), yy(y - 1), w + 2, h + 2);
            this._ctx.clip(region);
        }
        save() {
            this._ctx.save();
        }
        restore() {
            this._ctx.restore();
        }
        // --- Accessors --- //
        get width() {
            return this._canvas.origWidth;
        }
        get height() {
            return this._canvas.origHeight;
        }
        get canvas() {
            return this._canvas;
        }
        get gparms() {
            return this._gparms;
        }
    }
    exports.BrowserGfx = BrowserGfx;
});
define("Browser/BrowserPlayfieldApp", ["require", "exports", "Playfield/index", "Browser/BrowserEventPump", "Browser/BrowserGfx"], function (require, exports, Playfield_2, BrowserEventPump_1, BrowserGfx_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserPlayfieldApp = void 0;
    class BrowserPlayfieldApp {
        constructor(canvasId = "#playfield", ratio) {
            this._gfx = new BrowserGfx_1.BrowserGfx(canvasId, ratio);
            this._eventQueue = new Playfield_2.EventQueue();
            this._canvasEventPump = new BrowserEventPump_1.BrowserEventPump(this._gfx.canvas, this._eventQueue);
            this._playfield = new Playfield_2.Playfield(this._gfx, this._eventQueue);
        }
        // --- Accessors --- //
        get playfield() {
            return this._playfield;
        }
        set playfield(value) {
            this._playfield = value;
        }
        get gfx() {
            return this._gfx;
        }
        set gfx(value) {
            this._gfx = value;
        }
        get eventQueue() {
            return this._eventQueue;
        }
        set eventQueue(value) {
            this._eventQueue = value;
        }
        get canvasEventPump() {
            return this._canvasEventPump;
        }
        set canvasEventPump(value) {
            this._canvasEventPump = value;
        }
    }
    exports.BrowserPlayfieldApp = BrowserPlayfieldApp;
});
define("Browser/index", ["require", "exports", "Browser/BrowserEventPump", "Browser/BrowserGfx", "Browser/BrowserPlayfieldApp", "Browser/BrowserPlayfieldEvent", "Browser/BrowserFiles"], function (require, exports, BrowserEventPump_2, BrowserGfx_2, BrowserPlayfieldApp_1, BrowserPlayfieldEvent_2, BrowserFiles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserFile = exports.BrowserFiles = exports.BrowserPlayfieldEvent = exports.BrowserPlayfieldApp = exports.BrowserGfx = exports.BrowserEventPump = void 0;
    Object.defineProperty(exports, "BrowserEventPump", { enumerable: true, get: function () { return BrowserEventPump_2.BrowserEventPump; } });
    Object.defineProperty(exports, "BrowserGfx", { enumerable: true, get: function () { return BrowserGfx_2.BrowserGfx; } });
    Object.defineProperty(exports, "BrowserPlayfieldApp", { enumerable: true, get: function () { return BrowserPlayfieldApp_1.BrowserPlayfieldApp; } });
    Object.defineProperty(exports, "BrowserPlayfieldEvent", { enumerable: true, get: function () { return BrowserPlayfieldEvent_2.BrowserPlayfieldEvent; } });
    Object.defineProperty(exports, "BrowserFiles", { enumerable: true, get: function () { return BrowserFiles_1.BrowserFiles; } });
    Object.defineProperty(exports, "BrowserFile", { enumerable: true, get: function () { return BrowserFiles_1.BrowserFile; } });
});
define("Jed/ItemOptions", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemOptions = void 0;
    class ItemOptions extends Playfield_3.TileOptions {
        constructor() {
            super(...arguments);
            this.fontSize = 24;
            this.fontFace = "sans-serif";
            this.fontStyle = "";
            this.backgroundColor = "white";
            this.foregroundColor = "black";
            this.containerColor = "gray";
            this.textColor = "black";
            this.borderColor = "black";
            this.selectColor = "red";
            this.hoverColor = "#c88";
            this.textAlign = "left";
            this.textBaseline = "top";
            this.borderRadius = 0;
        }
    }
    exports.ItemOptions = ItemOptions;
});
define("Jed/Item", ["require", "exports", "Playfield/index", "Utils/index", "Playfield/Abilities/index", "Jed/ItemOptions", "Playfield/Graphics/index"], function (require, exports, Playfield_4, Utils_6, Abilities_5, ItemOptions_1, Graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = exports._Item = void 0;
    class _Item extends Playfield_4.Tile {
    }
    exports._Item = _Item;
    ;
    ;
    (0, Utils_6.applyMixins)(_Item, [Abilities_5.Draggable, Abilities_5.Clickable]);
    class Item extends _Item {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h);
            this._value = value;
            this._label = label || value || name;
            this._itemOptions = new ItemOptions_1.ItemOptions();
            if (w < 0) {
                // setting the width to a negative number forces right-aligned text
                this._itemOptions.textAlign = Graphics_1.GfxParms.RIGHT;
                this.w = -w;
            }
            this._updateGparms(enable);
            this._autoLabelWidthHeight();
        }
        static cast(obj) {
            return obj;
        }
        _updateGparms(enable) {
            this.gfx.gparms.fillColor = this.options.backgroundColor;
            this.gfx.gparms.color = this.options.textColor;
            this.gfx.gparms.borderColor = this.options.borderColor;
            this.gfx.gparms.fontSize = this.options.fontSize;
            this.gfx.gparms.fontFace = this.options.fontFace;
            this.gfx.gparms.fontStyle = this.options.fontStyle;
            this.gfx.gparms.textAlign = this.options.textAlign;
            this.gfx.gparms.textBaseline = this.options.textBaseline;
            this.gfx.gparms.borderRadius = this.options.borderRadius;
        }
        _autoLabelWidthHeight() {
            this._updateGparms(enable);
            let bb = this.gfx.boundingBox(this.label);
            this.w = this.w || bb.w + 2 + this.options.fontSize;
            this.h = this.h || bb.h + 2;
        }
        go() {
            throw Error("Unimplemented feature: 'go()';");
        }
        // --- Accessors --- //
        get value() {
            return this._value;
        }
        set value(_value) {
            this._value = _value;
        }
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
        get options() {
            return this._itemOptions;
        }
    }
    exports.Item = Item;
});
define("Jed/Button", ["require", "exports", "Jed/Item", "Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_1, Utils_7, Abilities_6, Graphics_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = exports._Button = void 0;
    class _Button extends Item_1.Item {
    }
    exports._Button = _Button;
    ;
    ;
    (0, Utils_7.applyMixins)(_Button, [Abilities_6.Draggable, Abilities_6.Pressable, Abilities_6.Hoverable]);
    class Button extends _Button {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this.label = label || value || name;
            this.gfx.gparms.borderRadius = 10;
            this.options.textAlign = Graphics_2.GfxParms.CENTER;
            this.options.textBaseline = Graphics_2.GfxParms.MIDDLE;
            this.options.borderRadius = 10;
        }
        // --- Overrides --- //
        go() {
            return false;
        }
        draw(enable = true) {
            let gparms = this.gfx.gparms;
            this._updateGparms(enable);
            let x = this.X;
            let y = this.Y;
            let bb = this.gfx.boundingBox(this.label);
            let w = this.W || bb.w;
            let h = this.H || bb.h;
            if (this.isHovering && this.isPressed)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering && !this.isPressed)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = this.options.backgroundColor;
            this.gfx.clipRect(x, y, w, h);
            this.gfx.textRect(this.label, x, y, w, h);
            this.gfx.restore();
        }
        // --- onActions --- //
        onEnter() {
        }
        onExit() {
        }
        onHovering() {
        }
        onPress() {
        }
        onRelease() {
            if (this.isHovering)
                this.go();
        }
    }
    exports.Button = Button;
});
define("Jed/Checkbox", ["require", "exports", "Jed/Item", "Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_2, Utils_8, Abilities_7, Graphics_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkbox = exports._Checkbox = void 0;
    class _Checkbox extends Item_2.Item {
    }
    exports._Checkbox = _Checkbox;
    ;
    ;
    (0, Utils_8.applyMixins)(_Checkbox, [Abilities_7.Draggable, Abilities_7.Clickable, Abilities_7.Hoverable]);
    class Checkbox extends _Checkbox {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this._isChecked = false;
        }
        // --- Public Methods --- //
        go() {
            return false;
        }
        // --- Overrides --- //
        draw(enable = true) {
            let gparms = this.gfx.gparms;
            gparms.borderRadius = 0;
            this._updateGparms(enable);
            if (this.isChecked)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = this.options.backgroundColor;
            let boxX = this.X;
            let boxY = this.Y;
            let boxW = gparms.fontSize;
            let boxH = boxW;
            let textX = boxX + boxW + 2;
            let textY = boxY;
            let textW = this.w - boxW - 2;
            let textH = boxH + 2;
            gparms.textBaseline = Graphics_3.GfxParms.BOTTOM;
            this.gfx.clipRect(this.X, this.Y, this.W, this.H);
            this.gfx.rect(boxX, boxY, boxW, boxH);
            this.gfx.text(this.label, textX, textY, textW, textH);
            this.gfx.restore();
        }
        // --- onActions  --- //
        onClick() {
            this.isChecked = !this.isChecked;
            return this.go();
        }
        // --- Accessors --- //
        get isChecked() {
            return this._isChecked;
        }
        set isChecked(value) {
            this._isChecked = value;
        }
        get value() {
            if (this.isChecked)
                return super.value;
            else
                return "";
        }
        set value(s) {
            super.value = s;
        }
    }
    exports.Checkbox = Checkbox;
});
define("Jed/Group", ["require", "exports", "Jed/Item", "Playfield/index", "Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_3, Playfield_5, Utils_9, Abilities_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = exports._Group = void 0;
    class _Group extends Item_3.Item {
    }
    exports._Group = _Group;
    ;
    ;
    (0, Utils_9.applyMixins)(_Group, [Abilities_8.Dispatcher, Utils_9.Logger, Abilities_8.Clicker, Abilities_8.Presser, Abilities_8.Selecter, Abilities_8.Dragger, Abilities_8.Editer, Abilities_8.Hoverer]);
    class Group extends _Group {
        constructor(name, parent, x, y, w = 0, h = 0, label) {
            super(name, parent, x, y, w, h, label, label);
            this._isBoxed = true;
            this._xMargin = 10;
            this._yMargin = 10;
            this.label = label;
            this._isResizing = false;
            this.options.fontSize -= 2;
            this.isDraggable = true;
            this.updateWidthHeight();
        }
        // --- Overrides --- //
        inBounds(dx, dy) {
            this._updateGparms(enable);
            for (let child of this.children.reverse()) {
                let tileChild = Playfield_5.Tile.cast(child);
                if (tileChild.inBounds(dx, dy))
                    return Playfield_5.Tile.cast(this);
            }
            if (this.isBoxed) {
                let wh = this._computeWidthHeight();
                let result = (0, Utils_9.between)(this.X, dx, this.X + wh.w) &&
                    (0, Utils_9.between)(this.Y - this.gfx.gparms.fontSize / 2, dy, this.Y + wh.h);
                if (result)
                    return Playfield_5.Tile.cast(this);
            }
            return super.inBounds(dx, dy);
        }
        // onEvent(pfEvent: PlayfieldEvent) {
        //     this.dispatchEventToChildren(pfEvent);
        // }
        onGrab(dx, dy, pfEvent) {
            super.onGrab(dx, dy, pfEvent);
            pfEvent.isActive = true;
            if (this.isBoxed && (0, Utils_9.between)(this.w - 10, dx, this.w + 10) && (0, Utils_9.between)(this.h - 10, dy, this.h + 10)) {
                this._isResizing = true;
            }
            return true;
        }
        onDrag(dx, dy, pfEvent) {
            if (this._isResizing) {
                super.w = this.w + dx;
                super.h = this.h + dy;
            }
            else {
                return super.onDrag(dx, dy, pfEvent);
            }
        }
        onDrop(pfEvent) {
            super.onDrop(pfEvent);
            this._isResizing = false;
            return true;
        }
        updateWidthHeight() {
            let wh = this._computeWidthHeight();
            super.w = wh.w;
            super.h = wh.h;
        }
        _computeWidthHeight() {
            let w = super.w;
            let h = super.h;
            // if (w || h) return { w, h };
            for (let child of this.children) {
                let rectChild = Utils_9.Rect.cast(child);
                let cx = rectChild.x;
                let cy = rectChild.y;
                let cw = rectChild.w;
                let ch = rectChild.h;
                let newW = cx + cw + this.xMargin * 2;
                let newH = cy + ch + this.yMargin * 2;
                if (newW > w)
                    w = newW;
                if (newH > h)
                    h = newH;
                if (this.label.includes("greg"))
                    console.log(newW, newH, w, h);
            }
            return { w, h };
        }
        draw(enable = true) {
            this._updateGparms(enable);
            this.updateWidthHeight();
            if (this.isBoxed) {
                let wh = this._computeWidthHeight();
                this.gfx.clipRect(this.X, this.Y, wh.w, wh.h);
                this.gfx.rect(this.X, this.Y, wh.w, wh.h);
                if (this.label) {
                    this.gfx.restore();
                    let labelX = this.X + this.xMargin / 2;
                    let labelY = this.Y - this.gfx.gparms.fontSize / 2;
                    let labelW = Math.min(this.gfx.boundingBox(this.label).w, wh.w - this.xMargin);
                    let labelH = this.gfx.gparms.fontSize;
                    let gfx = this.gfx.clone();
                    gfx.gparms.borderColor = "";
                    gfx.gparms.fillColor = this.options.backgroundColor;
                    this.gfx.clipRect(labelX, labelY, wh.w - this.xMargin / 2, wh.h + this.gfx.gparms.fontSize / 2);
                    gfx.rect(labelX, labelY, labelW, labelH);
                    gfx.text(this.label, labelX, labelY, labelW);
                }
                this.drawChildren(enable);
                this.gfx.restore();
            }
            else {
                this.drawChildren(enable);
            }
        }
        // --- Accessors --- //
        get isGroupItem() {
            return this._isGroupItem;
        }
        set isGroupItem(value) {
            this._isGroupItem = value;
        }
        get isBoxed() {
            return this._isBoxed;
        }
        set isBoxed(value) {
            this._isBoxed = value;
        }
        get xMargin() {
            return this._xMargin;
        }
        set xMargin(value) {
            this._xMargin = value;
        }
        get yMargin() {
            return this._yMargin;
        }
        set yMargin(value) {
            this._yMargin = value;
        }
        get w() {
            if (!super.w)
                return this._computeWidthHeight().w;
            else
                return super.w;
        }
        set w(n) {
            super.w = n;
        }
        get h() {
            if (!super.h)
                return this._computeWidthHeight().h;
            else
                return super.h;
        }
        set h(n) {
            super.h = n;
        }
        get value() {
            let result = "";
            let comma = "";
            for (let child of this.children) {
                let itemChild = child;
                if (itemChild.value) {
                    result += comma + itemChild.value;
                    comma = ",";
                }
            }
            return result;
        }
    }
    exports.Group = Group;
});
define("Jed/Label", ["require", "exports", "Jed/Item", "Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_4, Utils_10, Abilities_9, Graphics_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Label = exports._Label = void 0;
    /**
     * Label has a value and a label which are the same value
     */
    class _Label extends Item_4.Item {
    }
    exports._Label = _Label;
    ;
    ;
    (0, Utils_10.applyMixins)(_Label, [Abilities_9.Draggable]);
    class Label extends _Label {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value, label);
            this.options.fontStyle = Graphics_4.GfxParms.BOLD;
            this.options.textBaseline = "bottom";
            this.options.borderColor = "";
        }
        // --- Overrides --- //
        draw(enable = true) {
            this._updateGparms(enable);
            let x = this.X;
            let y = this.Y;
            let w = this.W;
            let h = this.H;
            let rectX = x;
            let rectY = y;
            if (this.options.textAlign === "center") {
                rectX -= w / 2;
            }
            else if (this.options.textAlign === "right") {
                rectX -= w;
            }
            this.gfx.clipRect(rectX, rectY, w, h);
            // this.gfx.rect(rectX, rectY, w, h);
            // this.gfx.text(this.label, rectX, y, w, h);
            this.gfx.textRect(this.label, rectX, rectY, w, h);
            this.gfx.restore();
        }
        get label() {
            return super.label;
        }
        set label(s) {
            super.label = s;
            super.value = s;
        }
        get value() {
            return super.value;
        }
        set value(s) {
            super.label = s;
            super.value = s;
        }
    }
    exports.Label = Label;
});
define("Jed/Radio", ["require", "exports", "Jed/Item", "Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_5, Utils_11, Abilities_10, Graphics_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Radio = exports._Radio = void 0;
    class _Radio extends Item_5.Item {
    }
    exports._Radio = _Radio;
    ;
    ;
    (0, Utils_11.applyMixins)(_Radio, [Abilities_10.Draggable, Abilities_10.Selectable, Abilities_10.Hoverable]);
    class Radio extends _Radio {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this._isChecked = false;
        }
        // --- Public Methods --- //
        go() {
            return false;
        }
        // --- Overrides --- //
        draw(enable = true) {
            let gparms = this.gfx.gparms;
            this._updateGparms(enable);
            if (this.isSelected)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = this.options.backgroundColor;
            let boxX = this.X + 1;
            let boxY = this.Y + 1;
            let boxW = this.gfx.gparms.fontSize;
            let boxH = boxW + 2;
            let r = boxW / 2;
            let textX = boxX + boxW + 2;
            let textY = boxY;
            let textW = this.W - boxW - 2;
            let textH = boxH;
            this.gfx.gparms.textBaseline = Graphics_5.GfxParms.BOTTOM;
            this.gfx.clipRect(this.X, this.Y, this.W, this.H);
            this.gfx.circle(boxX + r, boxY + r, r);
            this.gfx.text(this.label, textX, textY, textW, textH);
            this.gfx.restore();
        }
        // --- onActions  --- //
        onSelect() {
            return this.go();
        }
        get isChecked() {
            return this._isChecked;
        }
        set isChecked(value) {
            this._isChecked = value;
            this.isSelected = value;
        }
    }
    exports.Radio = Radio;
});
define("Jed/Slider", ["require", "exports", "Playfield/Abilities/index", "Utils/index", "Playfield/Graphics/index", "Jed/Item"], function (require, exports, Abilities_11, Utils_12, Graphics_6, Item_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Slider = exports._Slider = void 0;
    class _Slider extends Item_6.Item {
    }
    exports._Slider = _Slider;
    ;
    ;
    (0, Utils_12.applyMixins)(_Slider, [Abilities_11.Draggable, Abilities_11.Hoverable]);
    function inormalize(r, multiplier) {
        if (r <= 1.0)
            return (0, Utils_12.int)(r * multiplier);
        return (0, Utils_12.int)(r);
    }
    class Slider extends _Slider {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value, label);
            this._margins = new Utils_12.Margins();
            this._cursor = new Utils_12.Rect();
            this._rcursor = new Utils_12.Rect();
            this._ratio = new Utils_12.Ratio();
            this._vslide = true;
            this._hslide = true;
            this._text = "";
            this._minW = 10;
            this._minH = 10;
            this._cursorBorderRadius = 10;
            this._isSliding = false;
            this._margins.Margins(4, 4, 4, 4); // top, right, bottom, left
            this.cursorSize(0.5, 0.5);
            this.cursorMove(0.5, 0.5);
            this.options.textBaseline = Graphics_6.GfxParms.MIDDLE;
            this.options.textAlign = Graphics_6.GfxParms.CENTER;
            this.isDraggable = true;
        }
        onSlide(rx, ry, pfEvent) {
        }
        cursorMove(rx, ry) {
            let x = inormalize(rx, this.dw) + this._margins.left;
            let y = inormalize(ry, this.dh) + this._margins.top;
            this._cursor.move(x, y);
            this._rcursor.move(rx, ry);
        }
        cursorSize(rw, rh) {
            let dw = this.W - this._margins.left - this._margins.right;
            let dh = this.H - this._margins.top - this._margins.bottom;
            let w = inormalize(rw, dw) || this._cursor.w; // preserve old width if rw == 0
            let h = inormalize(rh, dh) || this._cursor.h; // preserve old height if rh == 0
            w = Math.max(w, this._minW);
            h = Math.max(h, this._minH);
            this._cursor.size(w, h);
            this.cursorMove(this._rcursor.x, this._rcursor.y);
            this._rcursor.size(rw || this._rcursor.w, rh || this._rcursor.h);
        }
        _drawContainer() {
            this.gfx.gparms.fillColor = this.options.containerColor;
            this.gfx.rect(this.X, this.Y, this.W, this.H);
        }
        _drawCursor() {
            let c = this._cursor;
            if (this.isDragging) {
                this.gfx.gparms.fillColor = this.options.selectColor;
            }
            else if (this.isHovering) {
                this.gfx.gparms.fillColor = this.options.hoverColor;
            }
            else {
                this.gfx.gparms.fillColor = this.options.backgroundColor;
            }
            if (this._vslide && !this._hslide) {
                this.gfx.gparms.textBaseline = Graphics_6.GfxParms.MIDDLE;
                this.gfx.gparms.textAlign = Graphics_6.GfxParms.CENTER;
            }
            this.gfx.gparms.borderRadius = this._cursorBorderRadius;
            this.gfx.textRect(this._text, this.X + c.x, this.Y + c.y, c.w, c.h);
        }
        draw(enable = true) {
            this._updateGparms(enable);
            this.gfx.clipRect(this.X, this.Y, this.W, this.H);
            this._drawContainer();
            this._drawCursor();
            this.gfx.restore();
        }
        onGrab(dx, dy, pfEvent) {
            let c = this._cursor;
            if ((0, Utils_12.between)(c.x, dx, c.x + c.w) && (0, Utils_12.between)(c.y, dy, c.y + c.h)) {
                this._isSliding = true;
                super.onGrab(dx, dy, pfEvent);
                return true;
            }
            this._isSliding = false;
            return super.onGrab(dx, dy, pfEvent);
        }
        onDrag(dx, dy, pfEvent) {
            if (this._isSliding) {
                let c = this._cursor;
                let xmax = this.dw + this._margins.left;
                let ymax = this.dh + this._margins.top;
                if (this._hslide)
                    c.x = (0, Utils_12.limit)(this._margins.left, c.x + dx, xmax);
                if (this._vslide)
                    c.y = (0, Utils_12.limit)(this._margins.top, c.y + dy, ymax);
                this._rcursor.move(this.rx, this.ry);
                this.onSlide(this.rx, this.ry, pfEvent);
                pfEvent.isActive = false;
            }
            else {
                super.onDrag(dx, dy, pfEvent);
            }
        }
        onDrop(pfEvent) {
            super.onDrop(pfEvent);
            this._isSliding = false;
        }
        // --- Accessors --- //
        get text() {
            return this._text;
        }
        set text(s) {
            this._text = s;
        }
        get dw() {
            return this.w - this._margins.left - this._margins.right - this._cursor.w;
        }
        get dh() {
            return this.h - this._margins.top - this._margins.bottom - this._cursor.h;
        }
        get rx() {
            if (this.dw === 0)
                return this._rcursor.x;
            return (this._cursor.x - this._margins.left) / this.dw;
        }
        get ry() {
            if (this.dh === 0)
                return this._rcursor.y;
            return (this._cursor.y - this._margins.top) / this.dh;
        }
        get margins() {
            return this._margins;
        }
        set margins(margins) {
            this._margins = margins;
        }
        get cursor() {
            return this._cursor;
        }
        set cursor(cursor) {
            this._cursor = cursor;
        }
        get hslide() {
            return this._hslide;
        }
        set hslide(value) {
            this._hslide = value;
        }
        get vslide() {
            return this._vslide;
        }
        set vslide(value) {
            this._vslide = value;
        }
    }
    exports.Slider = Slider;
});
define("Jed/Text", ["require", "exports", "Jed/Item", "Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_7, Utils_13, Abilities_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Text = exports._Text = void 0;
    class _Text extends Item_7.Item {
    }
    exports._Text = _Text;
    ;
    ;
    (0, Utils_13.applyMixins)(_Text, [Abilities_12.Draggable, Abilities_12.Editable, Abilities_12.Timer]);
    class Text extends _Text {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value, label);
            this._cursor = 0;
            this._left = 0;
            this._right = 0;
            this._cursorOn = true;
            this._cursorBlinkRate = 500;
            this._nchars = 0;
            this._nchars2 = 0;
            this.options.fontFace = "monospace";
            this.options.fontSize = h;
            this._updateGparms(enable);
            this._nchars = Math.ceil(this.w / this.gfx.boundingBox("m").w);
            this._nchars2 = Math.ceil(this.w / this.gfx.boundingBox("m").w / 2);
            this._left = 0;
            this._right = this._computeRight();
        }
        // --- Overrides --- //
        draw(enable = true) {
            this._blink();
            let gfx = this.gfx;
            this._updateGparms(enable);
            if (this.isFocus)
                this.gfx.gparms.color = this.options.selectColor;
            else
                this.gfx.gparms.color = this.options.textColor;
            gfx.clipRect(this.X, this.Y, this.W, this.H);
            let value = this.value.substring(this._left);
            if (this.isFocus)
                value = value.replaceAll(" ", '\uA788'); // \u00B7
            gfx.rect(this.X, this.Y, this.W, this.H);
            gfx.text(value, this.X, this.Y, this.W, this.H);
            // gfx.textRect(value, this.X, this.Y, this.W, this.H);
            this._drawCursor();
            gfx.restore();
        }
        // --- onActions --- //
        onArrowLeft() {
            this._cursorInc(-1);
        }
        onArrowRight() {
            this._cursorInc(+1);
        }
        onBackspace() {
            if (this._cursor > 0) {
                let c = this._cursor;
                let left = this.value.substring(0, c - 1);
                let right = this.value.substring(c);
                this.value = left + right;
                this._cursorInc(-1);
                this.log(left, right, this._cursor, this.value);
            }
        }
        onKey(key) {
            let c = this._cursor;
            this.value = this.value.substring(0, c) + key + this.value.substring(c);
            this._cursorInc(+1);
        }
        onFocus(pfEvent) {
            super.onFocus(pfEvent);
            this._startCursorBlinking();
            pfEvent.isActive = false;
        }
        onUnfocus() {
            this._stopCursorBlinking();
        }
        onGrab(dx, dy, pfEvent) {
            this.onFocus(pfEvent);
            return super.onGrab(dx, dy, pfEvent);
        }
        // --- protected Methods --- //
        _blink() {
            if (!this.isTimedOut)
                return;
            this._cursorOn = !this._cursorOn;
            this.startTimer(this._cursorBlinkRate);
        }
        _startCursorBlinking() {
            this._cursorOn = true;
            this.startTimer(this._cursorBlinkRate);
        }
        _stopCursorBlinking() {
            this._cursorOn = false;
        }
        _drawCursor() {
            if (!this.isFocus)
                return;
            if (!this._cursorOn)
                return;
            let gfx = this.gfx;
            let valueBB = gfx.boundingBox(this.value.substring(this._left, this._cursor));
            let charBB = gfx.boundingBox("M");
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
            // gfx.gparms.fillColor = "";
            gfx.rect(x0 - 1, y0 + 1, 3, charBB.h - 2);
        }
        _computeRight() {
            // let gfx = this.playfield.gfx;
            // let right = this._left;
            // for(let i=this._left; i<=this.value.length; i++) {
            //     let bb = gfx.boundingBox(this.value.substring(this._left, i));
            //     right = i;
            //     if (bb.w > this.w) break;
            // }
            let right = this._left + this._nchars2 * 2;
            if (right >= this.value.length)
                right = this.value.length - 1;
            return right;
        }
        _computeLeft() {
            // let gfx = this.playfield.gfx;
            // let left = this._right;
            // for(let i=this._right; i>=0; i--) {
            //     let bb = gfx.boundingBox(this.value.substring(i, this._right));
            //     if (bb.w > this.w) break;
            //     left = i;
            // }
            let left = this._right - this._nchars2 * 2 + 1;
            if (left < 0)
                left = 0;
            return left;
        }
        _cursorInc(delta) {
            this._cursor += delta;
            this._startCursorBlinking();
            this._cursorOn = true;
            if (this._cursor < 0)
                this._cursor = 0;
            if (this._cursor > this.value.length)
                this._cursor = this.value.length;
            this._left = this._cursor - this._nchars2;
            if (this._left < 0)
                this._left = 0;
            this._right = this._left + this._nchars;
            if (this._right > this.value.length)
                this._right = this.value.length;
            if (this._right === this.value.length)
                this._left = Math.max(this._right - this._nchars + 1, 0);
            this.log(this._left, this._cursor, this._right, this._nchars, this._nchars2);
        }
    }
    exports.Text = Text;
});
define("Jed/index", ["require", "exports", "Jed/Text", "Jed/Button", "Jed/Checkbox", "Jed/Radio", "Jed/Label", "Jed/Group", "Jed/Slider"], function (require, exports, Text_1, Button_1, Checkbox_1, Radio_1, Label_1, Group_1, Slider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Slider = exports.Group = exports.Label = exports.Radio = exports.Checkbox = exports.Button = exports.Text = void 0;
    Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return Text_1.Text; } });
    Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return Button_1.Button; } });
    Object.defineProperty(exports, "Checkbox", { enumerable: true, get: function () { return Checkbox_1.Checkbox; } });
    Object.defineProperty(exports, "Radio", { enumerable: true, get: function () { return Radio_1.Radio; } });
    Object.defineProperty(exports, "Label", { enumerable: true, get: function () { return Label_1.Label; } });
    Object.defineProperty(exports, "Group", { enumerable: true, get: function () { return Group_1.Group; } });
    Object.defineProperty(exports, "Slider", { enumerable: true, get: function () { return Slider_1.Slider; } });
});
// https://github.com/Daikalos/Clone_Super-Mario/tree/aea7acfc39495a597beefa7552205bbda22d0473/Super-Mario/Super-Mario/Content/Sprites
define("Playfield/Image", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
define("Playfield/Shapes/BoxTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Utils/index", "Playfield/Abilities/index"], function (require, exports, ShapeTile_1, Utils_14, Abilities_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTile = exports._BoxTile = void 0;
    class _BoxTile extends ShapeTile_1.ShapeTile {
    }
    exports._BoxTile = _BoxTile;
    ;
    ;
    (0, Utils_14.applyMixins)(_BoxTile, [Abilities_13.Draggable, Abilities_13.Selectable, Abilities_13.Clickable]);
    class BoxTile extends _BoxTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._colors = ["", "red", "orange", "green", "blue", "indigo", "violet"];
            this._color = 0;
            this._color = (0, Utils_14.int)((0, Utils_14.random)(0, this._colors.length));
        }
        // --- Overrides ---//
        draw(enable = true) {
            if (this.isSelected)
                this.gfx.gparms.borderColor = "black";
            else
                this.gfx.gparms.borderColor = "";
            this.gfx.gparms.fillColor = "";
            this._colors[this._color];
            console.log(this.gfx.gparms.fillColor, this._color, this._colors);
            this.gfx.rect(this.x, this.y, this.w, this.h);
            super.draw(enable);
        }
        // --- onActions --- //
        onGrab(dx, dy, event) {
            this.toFront();
            super.onGrab(dx, dy, event);
            return true;
        }
        onClick() {
            this._color = (this._color + 1) % this._colors.length;
            this.warn(this._color);
        }
        onDrop(event) {
            this.toFront();
            super.onDrop(event);
        }
        onTick() {
        }
    }
    exports.BoxTile = BoxTile;
});
define("Playfield/Shapes/CircleTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Abilities/index", "Utils/index"], function (require, exports, ShapeTile_2, Abilities_14, Utils_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = exports._CircleTile = void 0;
    class _CircleTile extends ShapeTile_2.ShapeTile {
    }
    exports._CircleTile = _CircleTile;
    ;
    ;
    (0, Utils_15.applyMixins)(_CircleTile, [Abilities_14.Draggable, Abilities_14.Selectable]);
    class CircleTile extends _CircleTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._dx = 0;
            this._dy = 0;
        }
        // --- Overrides --- //
        inBounds(x, y) {
            let dx = this.X - x;
            let dy = this.Y - y;
            let dr = dx * dx + dy * dy;
            let dw = this.w * this.w;
            if (dr <= dw)
                return this;
        }
        draw(enable = true) {
            this.gfx.gparms.borderColor = "black";
            this.gfx.gparms.fillColor = "gray";
            this.gfx.circle(this.X, this.Y, this.W);
            if (this.isSelected && this._dx && this._dy) {
                let oldColor = this.gfx.gparms.fillColor;
                this.gfx.gparms.fillColor = "red";
                let r = Math.floor(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
                this.playfield.gfx.circle(this.X, this.Y, r);
                this.gfx.gparms.fillColor = oldColor;
            }
            super.draw(enable);
        }
        // --- onActions --- //
        onGrab(dx, dy, event) {
            this._dx = this.X - event.x;
            this._dy = this.Y - event.y;
            this.toFront();
            this.isSelected = true;
            return super.onGrab(dx, dy, event);
        }
        onDrop() {
            this.toFront();
            this._dx = 0;
            this._dy = 0;
            this.isSelected = false;
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
define("Test/GUIEditor", ["require", "exports", "Playfield/index", "Browser/index", "Jed/index", "Utils/index", "Jed/Item"], function (require, exports, Playfield_6, Browser_1, Jed, Utils_16, Item_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    Jed = __importStar(Jed);
    class TestClass {
        constructor() {
            this.isEditMode = true;
            this.groupItem = null;
            this.logger = new Utils_16.Logger().Logger("info", false);
            this._playfieldApp = new Browser_1.BrowserPlayfieldApp("#playfield", 1.0);
            this._playfield = this._playfieldApp.playfield;
        }
        log(...args) {
            this.logger.log(...args);
        }
        makeUnDraggable(item) {
            item.isDraggable = false;
        }
        makeDraggable(item) {
            item.isDraggable = true;
        }
        addItem() {
            let buttonClicked = Playfield_6.Tile.cast(this);
            let that = buttonClicked.data;
            let x = 10;
            let y = 10;
            let w = 200;
            let h = 30;
            let item;
            if (buttonClicked.name.includes("Button")) {
                that.log("add button");
                item = new Jed.Button("button-" + (TestClass.counter++), that.right, x, y, w, h);
            }
            else if (buttonClicked.name.includes("Checkbox")) {
                that.log("add checkox");
                item = new Jed.Checkbox("checkbox-" + (TestClass.counter++), that.right, x, y, w, h);
            }
            else if (buttonClicked.name.includes("Group")) {
                that.log("add group");
                let name = "group-" + (TestClass.counter++);
                item = new Jed.Group(name, that.right, x, y, 0, 0, "greg");
                that.groupItem = item;
            }
            else if (buttonClicked.name.includes("Label")) {
                that.log("add label");
                item = new Jed.Label("label-" + (TestClass.counter++), that.right, x, y, 0, 0);
            }
            else if (buttonClicked.name.includes("Text")) {
                that.log("add text");
                let name = "text-" + (TestClass.counter++);
                item = new Jed.Text(name, that.right, x, y, w, h, name);
            }
            else if (buttonClicked.name.includes("Radio")) {
                that.log("add radio");
                if (that.groupItem)
                    item = new Jed.Radio("radio-" + (TestClass.counter++), that.groupItem, x, y, 0, 0);
                else
                    item = new Jed.Radio("radio-" + (TestClass.counter++), that.right, x, y, 0, 0);
            }
            else if (buttonClicked.name.includes("addVSlider")) {
                that.log("add vslider");
                item = new Jed.Slider("vslider-" + (TestClass.counter++), that.right, x, y, h, w);
                item.hslide = false;
            }
            else if (buttonClicked.name.includes("addHSlider")) {
                that.log("add hslider");
                item = new Jed.Slider("hslider-" + (TestClass.counter++), that.right, x, y, w, h);
                item.vslide = false;
            }
            else if (buttonClicked.name.includes("addSlider")) {
                that.log("add slider");
                item = new Jed.Slider("slider-" + (TestClass.counter++), that.right, x, y, w, w);
            }
            if (item) {
                item.isDraggable = that.isEditMode;
                item.onMenu = that.onMenu.bind(item);
                item.data = that;
                that.populateProperties(item, that);
                that.log(item);
            }
            else {
                that.logger.error("Problem with " + buttonClicked.name, buttonClicked);
            }
        }
        onMenu(pfEvent) {
            let item = Item_8.Item.cast(this);
            let that = item.data;
            that.populateProperties(item, that);
        }
        editMode() {
            let thisTile = Playfield_6.Tile.cast(this);
            let isOn = thisTile.name.includes("on");
            let that = thisTile.data;
            if (isOn) {
                that.right.dfs(that.makeDraggable, this.right);
                that.right.options.backgroundColor = "white";
                thisTile.data.isEditMode = true;
            }
            else {
                that.right.dfs(that.makeUnDraggable, this.right);
                that.right.options.backgroundColor = "#ddd";
                thisTile.data.isEditMode = false;
            }
        }
        setData(obj, data) {
            obj.data = data;
        }
        createAddPanel(parent, that) {
            let x = 10;
            let y = 20;
            let w = 180;
            let h = 30;
            let dy = 40;
            let editMode = new Jed.Group("editMode", this.left, x, y, w, 0, "Edit Mode");
            let editModeOn = new Jed.Radio("on", editMode, 10, 10, 0, 0, "On");
            let editModeOff = new Jed.Radio("off", editMode, 10, 40, 0, 0, "Off");
            editModeOn.go = this.editMode.bind(editModeOn);
            editModeOff.go = this.editMode.bind(editModeOff);
            y = -dy / 2;
            let addButtonGroup = new Jed.Group("addButtonGroup", this.left, x, 130, 0, 0, "Add Item");
            let addButton = new Jed.Button("addButton", addButtonGroup, x, y += dy, w, h, "Add Button");
            let addCheckbox = new Jed.Button("addCheckbox", addButtonGroup, x, y += dy, w, h, "Add Checkbox");
            let addGroup = new Jed.Button("addGroup", addButtonGroup, x, y += dy, w, h, "Add Group");
            let addLabel = new Jed.Button("addLabel", addButtonGroup, x, y += dy, w, h, "Add Label");
            let addRadio = new Jed.Button("addRadio", addButtonGroup, x, y += dy, w, h, "Add Radio");
            let addSlider = new Jed.Button("addSlider", addButtonGroup, x, y += dy, w, h, "Add Slider");
            let addVSlider = new Jed.Button("addVSlider", addButtonGroup, x, y += dy, w, h, "Add VSlider");
            let addHSlider = new Jed.Button("addHSlider", addButtonGroup, x, y += dy, w, h, "Add HSlider");
            let addText = new Jed.Button("addText", addButtonGroup, x, y += dy, w, h, "Add Text");
            this.left.dfs(this.makeUnDraggable);
            this.left.dfs(this.setData, this);
            addButtonGroup.children.forEach((obj) => { obj.go = that.addItem.bind(obj); });
            this._playfield.rootTile.printTree();
            this._playfield.start(0);
            editMode.selectChild(editModeOn);
        }
        makeText(name, parent, x, y, w, h, label) {
            let text = new Jed.Text(name, parent, x, y, w, h, name);
            let title = new Jed.Label(name + "-label", parent, x, y, 100, h, label, label);
            title.options.textAlign = "right";
            return text;
        }
        createPreferencesPanel(parent, that) {
            let x = parent.w / 2;
            let y = 20;
            let w = 200;
            let h = 30;
            let dy = 40;
            let title = new Jed.Label("title", parent, x, y, 0, 0, "Preferences");
            title.options.textAlign = "center";
            let name = this.makeText("name", parent, x, y += dy, w, h, "Name: ");
            let label = this.makeText("label", parent, x, y += dy, w, h, "Label: ");
            let submit = new Jed.Button("submit", parent, x, y += dy, w, h, "Submit");
            submit.x -= submit.w / 2;
            submit.go = that.updateItemProperties.bind(that);
            parent.dfs(this.makeUnDraggable);
            return { title, name, label };
        }
        populateProperties(item, that) {
            that.currentItem = item;
            that.preferences.name.value = item.value;
            that.preferences.label.value = item.label;
        }
        updateItemProperties() {
            this.currentItem.value = this.preferences.label.value;
            this.currentItem.label = this.preferences.label.value;
        }
        GUIEditor() {
            this.root = Playfield_6.RootTile.cast(this._playfield.rootTile);
            this.splitter = new Playfield_6.Splitter("splitter", this.root, 0.65, 0.25);
            this.left = this.splitter.ne;
            this.right = this.splitter.nw;
            this.createAddPanel(this.left, this);
            this.preferences = this.createPreferencesPanel(this.splitter.sw, this);
        }
        run() {
            this.GUIEditor();
        }
    }
    exports.TestClass = TestClass;
    TestClass.counter = 1;
});
define("Test/Test01", ["require", "exports", "Browser/index"], function (require, exports, Browser_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * basic test
     * displays a sqare on the playfield
     *
     */
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_2.BrowserPlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
        }
        run() {
            this._playfield.gfx.rect(10, 10, 100, 100);
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test02", ["require", "exports", "Playfield/Shapes/index", "Browser/index"], function (require, exports, Shapes_1, Browser_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * basic test of the Root Tile and simple shape tiles.
     * square changes color on click
     * circle shows concentric inner circle on click
     * - and has specialized inBounds method
     * both are draggable
     */
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_3.BrowserPlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
        }
        circleTileTest() {
            let parent = this._playfield.rootTile;
            let circleTile = new Shapes_1.CircleTile("circle", parent, parent.w / 2, parent.h / 2, 50, 50);
            let boxTile = new Shapes_1.BoxTile("box", parent, 10, 10, 50, 50);
            this._playfield.start();
        }
        run() {
            this.circleTileTest();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test03", ["require", "exports", "Playfield/Shapes/index", "Browser/index"], function (require, exports, Shapes_2, Browser_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * Group test
     * - circle has left and right circle chilcren
     * - - left and right circles each have two children
     * They all move as a group
     */
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_4.BrowserPlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
        }
        circleTileTest() {
            let parent = this._playfield.rootTile;
            let lcircle = new Shapes_2.CircleTile("left", parent, 175, +75, 50, 50);
            let rcircle = new Shapes_2.CircleTile("right", parent, +75, +75, 50, 50);
            lcircle.gfx.gparms.fillColor = "red";
            rcircle.gfx.gparms.fillColor = "red";
            let llcircle = new Shapes_2.CircleTile("left", lcircle, 150, 50, 50, 50);
            let lrcircle = new Shapes_2.CircleTile("right", lcircle, +50, 50, 50, 50);
            llcircle.gfx.gparms.fillColor = "blue";
            lrcircle.gfx.gparms.fillColor = "blue";
            let rlcircle = new Shapes_2.CircleTile("left", rcircle, 150, 50, 50, 50);
            let rrcircle = new Shapes_2.CircleTile("right", rcircle, +50, 50, 50, 50);
            rlcircle.gfx.gparms.fillColor = "green";
            rrcircle.gfx.gparms.fillColor = "green";
            this._playfield.start();
        }
        run() {
            this.circleTileTest();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test04", ["require", "exports", "Playfield/Shapes/index", "Browser/index", "Utils/index"], function (require, exports, Shapes_3, Browser_5, Utils_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    function bounce() {
        this.x += this.DX;
        this.y += this.DY;
        if (this.x + this.w > this.playfield.w || this.x < 0)
            this.DX = -this.DX;
        if (this.y + this.h > this.playfield.h || this.y < 0)
            this.DY = -this.DY;
    }
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_5.BrowserPlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
        }
        tenthousandTestTile() {
            let parent = this._playfield.rootTile;
            let max = 10;
            for (let i = 0; i < max; i++) {
                for (let j = 0; j < 1000; j++) {
                    let x = (0, Utils_17.random)(0, this._playfield.w);
                    let y = (0, Utils_17.random)(0, this._playfield.h);
                    let r = (0, Utils_17.random)(10, 50);
                    let DX = (0, Utils_17.random)(-10, 10);
                    let DY = (0, Utils_17.random)(-10, 10);
                    let box = new Shapes_3.BoxTile("box", parent, x, y, r, r);
                    box.onTick = bounce.bind(box);
                    box.isSelected = true;
                    box.DX = DX;
                    box.DY = DY;
                }
            }
            max *= 1000;
            let fps = 15;
            let delay = Math.floor(1000 / fps);
            this._playfield.start(1);
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
        run() {
            this.tenthousandTestTile();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test05", ["require", "exports", "Browser/index", "Jed/index", "Utils/index"], function (require, exports, Browser_6, Jed_1, Utils_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * Jed Test
     */
    let resultLabel = null;
    let bigSlider = null;
    let hslider = null;
    let vslider = null;
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_6.BrowserPlayfieldApp("#playfield", 2.0);
            this._playfield = this._playfieldApp.playfield;
        }
        jedTest() {
            function makeSliders(parent, x = 10, y = 10, dy = 25) {
                function updateCursor(rx, ry, pfEvent) {
                    hslider.cursorSize(rx, 18);
                    vslider.cursorSize(18, ry);
                    bigSlider.text = `(${(0, Utils_18.int)(bigSlider.rx * 100)},${(0, Utils_18.int)(bigSlider.ry * 100)})`;
                    hslider.text = `${(0, Utils_18.int)(hslider.rx * 100)}`;
                    vslider.text = `${(0, Utils_18.int)(vslider.ry * 100)}`;
                }
                function showValue(rx, ry, pfEvent) {
                    resultLabel.value = this.name + ": " + (0, Utils_18.int)(rx * 100) + "," + (0, Utils_18.int)(ry * 100);
                    if (this.name[0] === 'h')
                        this.text = `${(0, Utils_18.int)(this.rx * 100)}`;
                    if (this.name[0] === 'v')
                        this.text = `${(0, Utils_18.int)(this.ry * 100)}`;
                }
                let sliderW = 30;
                bigSlider = new Jed_1.Slider("bigSlider", parent, x + sliderW * 2, y, 200, 200);
                bigSlider.onSlide = updateCursor.bind(bigSlider);
                hslider = new Jed_1.Slider("hslider", parent, x + sliderW, parent.h - sliderW, parent.w - x - sliderW - 1, sliderW);
                hslider.vslide = false;
                hslider.onSlide = showValue.bind(hslider);
                vslider = new Jed_1.Slider("vslider", parent, x, y, sliderW, y - sliderW - 1);
                vslider.hslide = false;
                vslider.onSlide = showValue.bind(vslider);
                return { bigSlider, hslider, vslider };
            }
            function makeRadioButtons(parent, x = 10, y = 10, dy = 25) {
                function printValue() {
                    resultLabel.value = ("Radio Value: " + this.name);
                }
                // let buttonGroup = new Group("ButtonGroup", parent, 10, 10, 0, 0, "Radio Buttons");
                let buttonGroup = parent;
                let radio1 = new Jed_1.Radio("Radio-1", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
                let radio2 = new Jed_1.Radio("Radio-2", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
                let radio3 = new Jed_1.Radio("Radio-3", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
                radio1.go = printValue.bind(radio1);
                radio2.go = printValue.bind(radio2);
                radio3.go = printValue.bind(radio3);
                return buttonGroup;
            }
            function makeOneButton(parent, x = 10, y = 10, dy = 25) {
                function printGo() {
                    resultLabel.value = ("Button Value: " + this.name);
                }
                let button1 = new Jed_1.Button("Button1", parent, x, y, 100, 0);
                button1.label = "Hello World";
                button1.value = "Greg Smith";
                button1.isDraggable = false;
                button1.go = printGo.bind(button1);
            }
            function makeTwoButtons(parent, x = 10, y = 10, dy = 25) {
                function printGo() {
                    resultLabel.value = ("Button Value: " + this.name);
                }
                let button2 = new Jed_1.Button("Button2", parent, x, y, 100, 0, "Button  2");
                let button3 = new Jed_1.Button("Button3", parent, x, y += dy, 100, 0, "Button  3");
                let button4 = new Jed_1.Button("Button4", parent, x, y += dy, 100, 0, "Button  4");
                button2.go = printGo.bind(button2);
                button3.go = printGo.bind(button3);
                button4.go = printGo.bind(button4);
            }
            function makeStatus(parent, x = 10, y = 10, dy = 25) {
                let text1 = new Jed_1.Text("textitem-1", parent, x, y, 250, 14, "Hello World 1");
                resultLabel = new Jed_1.Label("ResultLabel", parent, x, y += dy, 200, 14, "Result Value");
            }
            function makeCheckboxes(parent, x = 10, y = 10, dy = 25) {
                function printValue() {
                    resultLabel.value = ("Checkbox Value: " + this.name, this.value);
                }
                let buttonGroup2 = parent;
                // let buttonGroup2 = new Group("ButtonGroup2", parent, 10, 10, 0, 0, "CheckBoxes");
                let checkbox1 = new Jed_1.Checkbox("Checkbox-1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
                let checkbox2 = new Jed_1.Checkbox("Checkbox-2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
                let checkbox3 = new Jed_1.Checkbox("Checkbox-3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
                checkbox1.go = printValue.bind(checkbox1);
                checkbox2.go = printValue.bind(checkbox2);
                checkbox3.go = printValue.bind(checkbox3);
            }
            let root = this._playfield.rootTile;
            makeRadioButtons(root, 10, 10);
            makeCheckboxes(root, 250, 10);
            makeOneButton(root, 10, 100);
            makeTwoButtons(root, 10, 125);
            makeStatus(root, 250, 125);
            makeSliders(root, 0, 250);
            this._playfield.rootTile.printTree();
            this._playfield.start(0);
        }
        run() {
            this.jedTest();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test06", ["require", "exports", "Playfield/index", "Browser/index", "Jed/index", "Utils/index"], function (require, exports, Playfield_7, Browser_7, Jed_2, Utils_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * Jed Test with Splitters and Relative Positioning
     */
    let resultLabel = null;
    let bigSlider = null;
    let hslider = null;
    let vslider = null;
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_7.BrowserPlayfieldApp("#playfield", 1.0);
            this._playfield = this._playfieldApp.playfield;
        }
        jedTest() {
            function fourLabels(name, parent) {
                new Jed_2.Label(name + ".NE", parent.ne, 10, 10, 0, 0, name + ".NE");
                new Jed_2.Label(name + ".NW", parent.nw, 10, 10, 0, 0, name + ".NW");
                new Jed_2.Label(name + ".SE", parent.se, 10, 10, 0, 0, name + ".SE");
                new Jed_2.Label(name + ".SW", parent.sw, 10, 10, 0, 0, name + ".SW");
            }
            function makeSplitter(parent) {
                let splitter = new Playfield_7.Splitter("splitter", parent);
                let splitterNE = new Playfield_7.Splitter("splitterNE", splitter.ne);
                let splitterNW = new Playfield_7.Splitter("splitterNw", splitter.nw);
                let splitterSE = new Playfield_7.Splitter("splitterSE", splitter.se);
                let splitterSW = new Playfield_7.Splitter("splitterSW", splitter.sw);
                fourLabels("label.NE", splitterNE);
                fourLabels("label.NW", splitterNW);
                fourLabels("label.SE", splitterSE);
                fourLabels("label.SW", splitterSW);
                return;
                // new Label("label", splitterNE.ne, 0, 0, 0, 0, "Lable.NE.NE");
                // new Label("label", splitterNE.nw, 0, 0, 0, 0, "Lable.NE.NW");
                // new Label("label", splitterNE.se, 0, 0, 0, 0, "Lable.NE.SE");
                // new Label("label", splitterNE.sw, 0, 0, 0, 0, "Lable.SE.SW");
                // new Label("label", splitterSE.ne, 0, 0, 0, 0, "Lable.SE.NE");
                // new Label("label", splitterSE.nw, 0, 0, 0, 0, "Lable.SE.NW");
                // new Label("label", splitterSE.se, 0, 0, 0, 0, "Lable.SE.SE");
                // new Label("label", splitterSE.sw, 0, 0, 0, 0, "Lable.SE.SW");
                // new Label("label", splitterNW.ne, 0, 0, 0, 0, "Lable.NW.NE");
                // new Label("label", splitterNW.nw, 0, 0, 0, 0, "Lable.NW.NW");
                // new Label("label", splitterNW.se, 0, 0, 0, 0, "Lable.NW.SE");
                // new Label("label", splitterNW.sw, 0, 0, 0, 0, "Lable.SW.SW");
                // new Label("label", splitterSW.ne, 0, 0, 0, 0, "Lable.SW.NE");
                // new Label("label", splitterSW.nw, 0, 0, 0, 0, "Lable.SW.NW");
                // new Label("label", splitterSW.se, 0, 0, 0, 0, "Lable.SW.SE");
                // new Label("label", splitterSW.sw, 0, 0, 0, 0, "Lable.SW.SW");
            }
            function makeSliders(parent, x = 10, y = 10, dy = 25) {
                function updateCursor(rx, ry, pfEvent) {
                    hslider.cursorSize(rx, 18);
                    vslider.cursorSize(18, ry);
                    bigSlider.text = `(${(0, Utils_19.int)(bigSlider.rx * 100)},${(0, Utils_19.int)(bigSlider.ry * 100)})`;
                    hslider.text = `${(0, Utils_19.int)(hslider.rx * 100)}`;
                    vslider.text = `${(0, Utils_19.int)(vslider.ry * 100)}`;
                }
                function showValue(rx, ry, pfEvent) {
                    resultLabel.value = this.name + ": " + (0, Utils_19.int)(rx * 100) + "," + (0, Utils_19.int)(ry * 100);
                    if (this.name[0] === 'h')
                        this.text = `${(0, Utils_19.int)(this.rx * 100)}`;
                    if (this.name[0] === 'v')
                        this.text = `${(0, Utils_19.int)(this.ry * 100)}`;
                }
                let sliderW = 30;
                bigSlider = new Jed_2.Slider("bigSlider", parent, x + sliderW * 2, y, 200, 200);
                bigSlider.onSlide = updateCursor.bind(bigSlider);
                hslider = new Jed_2.Slider("hslider", parent, x + sliderW, parent.h - sliderW, parent.w - x - sliderW - 1, sliderW);
                hslider.vslide = false;
                hslider.onSlide = showValue.bind(hslider);
                vslider = new Jed_2.Slider("vslider", parent, x, y, sliderW, y - sliderW - 1);
                vslider.hslide = false;
                vslider.onSlide = showValue.bind(vslider);
                return { bigSlider, hslider, vslider };
            }
            function makeRadioButtons(parent, x = 10, y = 10, dy = 25) {
                function printValue() {
                    resultLabel.value = ("Radio Value: " + this.name);
                }
                // let buttonGroup = new Group("ButtonGroup", parent, 10, 10, 0, 0, "Radio Buttons");
                let buttonGroup = parent;
                let radio1 = new Jed_2.Radio("Radio-1", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
                let radio2 = new Jed_2.Radio("Radio-2", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
                let radio3 = new Jed_2.Radio("Radio-3", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
                radio1.go = printValue.bind(radio1);
                radio2.go = printValue.bind(radio2);
                radio3.go = printValue.bind(radio3);
                return buttonGroup;
            }
            function makeOneButton(parent, x = 10, y = 10, dy = 25) {
                function printGo() {
                    resultLabel.value = ("Button Value: " + this.name);
                }
                let button1 = new Jed_2.Button("Button1", parent, x, y, 100, 0);
                button1.label = "Hello World";
                button1.value = "Greg Smith";
                button1.isDraggable = false;
                button1.go = printGo.bind(button1);
            }
            function makeTwoButtons(parent, x = 10, y = 10, dy = 25) {
                function printGo() {
                    resultLabel.value = ("Button Value: " + this.name);
                }
                let button2 = new Jed_2.Button("Button2", parent, x, y, 100, 0, "Button  2");
                let button3 = new Jed_2.Button("Button3", parent, x, y += dy, 100, 0, "Button  3");
                let button4 = new Jed_2.Button("Button4", parent, x, y += dy, 100, 0, "Button  4");
                button2.go = printGo.bind(button2);
                button3.go = printGo.bind(button3);
                button4.go = printGo.bind(button4);
            }
            function makeStatus(parent, x = 10, y = 10, dy = 25) {
                let text1 = new Jed_2.Text("textitem-1", parent, x, y, 250, 14, "Hello World 1");
                resultLabel = new Jed_2.Label("ResultLabel", parent, x, y += dy, 200, 14, "Result Value");
            }
            function makeCheckboxes(parent, x = 10, y = 10, dy = 25) {
                function printValue() {
                    resultLabel.value = ("Checkbox Value: " + this.name, this.value);
                }
                let buttonGroup2 = parent;
                // let buttonGroup2 = new Group("ButtonGroup2", parent, 10, 10, 0, 0, "CheckBoxes");
                let checkbox1 = new Jed_2.Checkbox("Checkbox-1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
                let checkbox2 = new Jed_2.Checkbox("Checkbox-2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
                let checkbox3 = new Jed_2.Checkbox("Checkbox-3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
                checkbox1.go = printValue.bind(checkbox1);
                checkbox2.go = printValue.bind(checkbox2);
                checkbox3.go = printValue.bind(checkbox3);
            }
            let root = this._playfield.rootTile;
            // makeRadioButtons(root, 10, 10);
            // makeCheckboxes(root, 250, 10);
            // makeOneButton(root, 10, 100);
            // makeTwoButtons(root, 10, 125);
            // makeStatus(root, 250, 125);
            // makeSliders(root, 0, 250);
            makeSplitter(root);
            this._playfield.rootTile.printTree();
            this._playfield.start(0);
        }
        run() {
            this.jedTest();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/Test07", ["require", "exports", "Playfield/index", "Browser/index", "Jed/index"], function (require, exports, Playfield_8, Browser_8, Jed_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    /**
     * Jed Test with Splitters and Relative Positioning
     * Setting up N/S and E/W splitters only
     */
    let resultLabel = null;
    let bigSlider = null;
    let hslider = null;
    let vslider = null;
    class TestClass {
        constructor() {
            this._playfieldApp = new Browser_8.BrowserPlayfieldApp("#playfield", 1.0);
            this._playfield = this._playfieldApp.playfield;
        }
        jedTest() {
            function fourLabels(name, parent) {
                new Jed_3.Label(name + ".NE", parent.ne, 10, 10, 0, 0, name + ".NE");
                new Jed_3.Label(name + ".NW", parent.nw, 10, 10, 0, 0, name + ".NW");
                new Jed_3.Label(name + ".SE", parent.se, 10, 10, 0, 0, name + ".SE");
                new Jed_3.Label(name + ".SW", parent.sw, 10, 10, 0, 0, name + ".SW");
            }
            function makeSplitter(parent) {
                let splitter = new Playfield_8.Splitter("splitter", parent, 0.5, 0.5);
                let splitterNE = new Playfield_8.Splitter("splitterNE", splitter.ne, 0.5, 0);
                let splitterNW = new Playfield_8.Splitter("splitterNw", splitter.nw, 0, 0.5);
                let splitterSE = new Playfield_8.Splitter("splitterSE", splitter.se, 1, 0.5);
                let splitterSW = new Playfield_8.Splitter("splitterSW", splitter.sw, 0.5, 1);
                fourLabels("label.NE", splitterNE);
                fourLabels("label.NW", splitterNW);
                fourLabels("label.SE", splitterSE);
                fourLabels("label.SW", splitterSW);
                return;
            }
            let root = this._playfield.rootTile;
            makeSplitter(root);
            this._playfield.rootTile.printTree();
            this._playfield.start(0);
        }
        run() {
            this.jedTest();
        }
    }
    exports.TestClass = TestClass;
});
define("Test/TestBrowserFiles", ["require", "exports", "Browser/index"], function (require, exports, Browser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestClass = void 0;
    Browser = __importStar(Browser);
    /**
     * Test File I/O
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
     */
    class TestClass {
        constructor() {
            this._key = "mario";
            this._fname = "/static/images/mario_walking.png";
            this._pollInterval = 1;
            this._files = new Browser.BrowserFiles();
        }
        _checkFileProgress() {
            let file = this._files.get(this._key);
            let keepPolling = false;
            if (!file) {
                console.error("could not locate " + this._key);
            }
            else if (file.isError) {
                console.error("error in loading " + this._key, "error=" + file._error);
            }
            else if (file.isDone) {
                console.log("done loading " + this._key, "bytes loaded: " + file._length);
                let blob = new Blob([file._data]);
                let blobURL = URL.createObjectURL(blob);
                console.log(blobURL);
                let img = new Image(); // Create new img element
                img.src = blobURL;
                file._img = img;
                setTimeout(this.showImage.bind(this), 1);
            }
            else if (file.isInProgress) {
                console.log("still loading " + this._key, "bytes loaded: " + file._length);
                keepPolling = true;
            }
            else {
                console.error("error... unknown file status " + file.status);
            }
            if (!keepPolling)
                clearInterval(this._timerID);
        }
        showImage() {
            let canvas = document.getElementById("playfield");
            console.log(canvas);
            let ctx = canvas.getContext("2d");
            console.log(ctx);
            console.log(canvas.width, canvas.height);
            // ctx.drawImage(this._files.get(this._key)._img, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(this._files.get(this._key)._img, 0, 0);
        }
        loadImage() {
            this._files.load(this._key, this._fname);
            this._timerID = setInterval(this._checkFileProgress.bind(this), this._pollInterval);
        }
        run() {
            this.loadImage();
        }
    }
    exports.TestClass = TestClass;
});
define("Utils/StylesMixins", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Styles = void 0;
    class Styles {
        constructor() {
            this._top = "black";
            this._bottom = "black";
            this._left = "black";
            this._right = "black";
        }
        Styles(top, right, bottom, left) {
            this._top = top;
            this._bottom = bottom;
            this._left = left;
            this._right = right;
            return this;
        }
        // --- Accessors --- //
        get top() {
            return this._top;
        }
        set top(n) {
            this._top = n;
        }
        get right() {
            return this._right;
        }
        set right(n) {
            this._right = n;
        }
        get bottom() {
            return this._bottom;
        }
        set bottom(n) {
            this._bottom = n;
        }
        get left() {
            return this._left;
        }
        set left(n) {
            this._left = n;
        }
    }
    exports.Styles = Styles;
});
//# sourceMappingURL=PlayfieldGraphics.js.map
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/Test04");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});