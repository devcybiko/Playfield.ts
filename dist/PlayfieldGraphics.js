define("Playfield/Utils/Mixins", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/Functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.limit = exports.int = exports.snapTo = exports.random = exports.inclusive = exports.between = void 0;
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
    function limit(min, value, max) {
        if (value < min)
            value = min;
        if (value > max)
            value = max;
        return value;
    }
    exports.limit = limit;
});
define("Playfield/Utils/LoggerMixin", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/TreeMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
    class Tree {
        Tree(name, parent) {
            this._name = name;
            this._children = [];
            if (parent)
                parent.addChild(this);
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
    }
    exports.Tree = Tree;
});
define("Playfield/Utils/PointMixin", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/RectMixin", ["require", "exports", "Playfield/Utils/PointMixin"], function (require, exports, PointMixin_1) {
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
        }
        RectXY(x0, y0, x1, y1) {
            this.x0 = x0;
            this.y0 = y0;
            this.x1 = x1;
            this.y1 = y1;
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
        sizeXY(x1, y1) {
            this.x1 = x1;
            this.y1 = y1;
        }
        rsizeXY(dx, dy) {
            this.x1 += dx;
            this.y1 += dy;
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
        get x0() {
            return this._x;
        }
        set x0(n) {
            this._x = n;
        }
        get y0() {
            return this._y;
        }
        set y0(n) {
            this._y = n;
        }
        get x1() {
            // if w == 1 then x1 == x0
            return this.x0 + this.w - 1;
        }
        set x1(x1) {
            // if x1 == x0 then w == 1
            this._w = x1 - this.x0 + 1;
        }
        get y1() {
            // if h == 1 then y1 == y0
            return this.y0 + this.h - 1;
        }
        set y1(y1) {
            // if y1 == y0 then h == 1
            this._h = y1 - this._y + 1;
        }
        get p0() {
            let p0 = new PointMixin_1.Point();
            p0.Point(this.x0, this.y0);
            return p0;
        }
        get p1() {
            let p1 = new PointMixin_1.Point();
            p1.Point(this.x1, this.y1);
            return p1;
        }
    }
    exports.Rect = Rect;
});
define("Playfield/Utils/MarginsMixin", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/RatioMixin", ["require", "exports", "Playfield/Utils/Functions"], function (require, exports, Functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ratio = void 0;
    class Ratio {
        Ratio(rmin, rmax, value, imin, imax) {
            this._rmin = rmin;
            this._rmax = rmax;
            this._rdelta = this._rmax - this._rmin;
            this._imin = (0, Functions_1.int)(imin);
            this._imax = (0, Functions_1.int)(imax);
            this._idelta = this._imax - this._imin;
            this.value = value;
        }
        set index(index) {
            this._index = (0, Functions_1.int)(index);
            let percent = (this._index - this._imin) / this._idelta;
            this._value = percent * this._rdelta + this._rmin;
        }
        get index() {
            return this._index;
        }
        set value(value) {
            this._value = value;
            let percent = (this._value - this._rmin) / this._rdelta;
            this._index = (0, Functions_1.int)(percent * this._idelta + this._imin);
        }
        get value() {
            return this._value;
        }
    }
    exports.Ratio = Ratio;
});
define("Playfield/Utils/index", ["require", "exports", "Playfield/Utils/Mixins", "Playfield/Utils/Functions", "Playfield/Utils/LoggerMixin", "Playfield/Utils/TreeMixin", "Playfield/Utils/RectMixin", "Playfield/Utils/PointMixin", "Playfield/Utils/MarginsMixin", "Playfield/Utils/RatioMixin"], function (require, exports, Mixins_1, Functions_2, LoggerMixin_1, TreeMixin_1, RectMixin_1, PointMixin_2, MarginsMixin_1, RatioMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ratio = exports.Margins = exports.Point = exports.Rect = exports.Tree = exports.Logger = exports.limit = exports.int = exports.snapTo = exports.random = exports.inclusive = exports.between = exports.applyMixins = void 0;
    Object.defineProperty(exports, "applyMixins", { enumerable: true, get: function () { return Mixins_1.applyMixins; } });
    Object.defineProperty(exports, "between", { enumerable: true, get: function () { return Functions_2.between; } });
    Object.defineProperty(exports, "inclusive", { enumerable: true, get: function () { return Functions_2.inclusive; } });
    Object.defineProperty(exports, "random", { enumerable: true, get: function () { return Functions_2.random; } });
    Object.defineProperty(exports, "snapTo", { enumerable: true, get: function () { return Functions_2.snapTo; } });
    Object.defineProperty(exports, "int", { enumerable: true, get: function () { return Functions_2.int; } });
    Object.defineProperty(exports, "limit", { enumerable: true, get: function () { return Functions_2.limit; } });
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return LoggerMixin_1.Logger; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return TreeMixin_1.Tree; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return RectMixin_1.Rect; } });
    Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return PointMixin_2.Point; } });
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
            this.dx = 0;
            this.dy = 0;
            this.textAlign = GfxParms.LEFT;
            this.textBaseline = GfxParms.TOP;
            this.fontSize = 24;
            this.fontFace = GfxParms.DEFAULT_FONT;
            this.fontStyle = "";
        }
        clone() {
            let gfxparms = new GfxParms;
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
define("Playfield/Tile", ["require", "exports", "Playfield/Utils/index"], function (require, exports, Utils_1) {
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
        constructor(name, parent, x, y, w, h) {
            super();
            this._tabOrder = 0;
            this.Logger();
            this.Rect(x, y, w, h);
            this.Tree(name, parent);
        }
        // --- Overrides --- //
        addChild(child) {
            super.addChild(child);
            child.playfield = this._playfield;
            child._tabOrder = this.children.indexOf(child);
        }
        // --- Public Methods --- //
        inBoundsChildren(x, y) {
            let found = Tile.null;
            for (let child of this.children) {
                let tileChild = child;
                found = tileChild.inBoundsChildren(x, y);
                if (found)
                    break;
            }
            if (!found)
                found = this.inBounds(x, y);
            return found;
        }
        inBounds(x, y) {
            let found = Tile.null;
            let result = (0, Utils_1.between)(this.X, x, this.X + this.w) &&
                (0, Utils_1.between)(this.Y, y, this.Y + this.h);
            if (result)
                found = this;
            return found;
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
        // --- OnActions --- //
        onTick() {
            this.children.forEach(child => child.onTick());
        }
        onEvent(pfEvent) {
        }
        // --- Private Methods --- //
        _recompute() {
            if (this.parent) {
                this.gfx.gparms.dx = this.parent.X;
                this.gfx.gparms.dy = this.parent.Y;
            }
        }
        // --- Accessors --- //
        get gfx() {
            return this._gfx;
        }
        get X() {
            return this.x + this.gfx.gparms.dx;
        }
        get Y() {
            return this.y + this.gfx.gparms.dy;
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
    }
    exports.Tile = Tile;
    Tile.null = null;
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
define("Playfield/Abilities/DraggerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dragger = void 0;
    ;
    class Dragger {
        Dragger() {
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
            if (this._dragObj) {
                this._dragObj.onDrag(pfEvent.x - this._dragX, pfEvent.y - this._dragY, pfEvent);
                this._dragX = pfEvent.x;
                this._dragY = pfEvent.y;
            }
        }
        _grabChild(pfEvent, child) {
            let tileChild = child;
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
define("Playfield/Abilities/SelectableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selectable = void 0;
    class Selectable {
        Selectable() {
            this._isSelected = false;
            this._isSelectable = true;
            return this;
        }
        // --- onActions --- //
        onSelect() {
        }
        onUnselect() {
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
define("Playfield/Abilities/SelecterMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selecter = void 0;
    ;
    class Selecter {
        Selecter() {
            this._selectedObj = null;
            return this;
        }
        // --- Public Methods --- //
        selectEvent(pfEvent, child) {
            let treeChild = child;
            if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
                if (pfEvent.isPress && this._selectedObj != child)
                    this._selectChild(pfEvent, child);
            }
        }
        // --- Private Methods --- //
        _selectChild(pfEvent, child) {
            this._unselectChild(pfEvent, child);
            this._selectedObj = child;
            child.isSelected = true;
            child.onSelect();
        }
        _unselectChild(pfEvent, child) {
            if (this._selectedObj) {
                this._selectedObj.isSelected = false;
                this._selectedObj.onUnselect();
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
define("Playfield/Abilities/PressableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pressable = void 0;
    class Pressable {
        Pressable() {
            this.isPressed = false;
            this.isPressable = true;
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
define("Playfield/Abilities/PresserMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Presser = void 0;
    ;
    class Presser {
        Presser() {
            return this;
        }
        // --- Public Methods --- //
        pressEvent(pfEvent, child) {
            let treeChild = child;
            if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
                if (pfEvent.isPress) {
                    child.isPressed = true;
                    child.onPress(pfEvent);
                }
            }
            if (pfEvent.isRelease && child.isPressed) {
                child.isPressed = false;
                child.onRelease(pfEvent);
            }
        }
    }
    exports.Presser = Presser;
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
define("Playfield/Abilities/ClickerMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clicker = void 0;
    ;
    class Clicker {
        Clicker() {
            return this;
        }
        // --- Public Methods --- //
        clickEvent(pfEvent, child) {
            if (pfEvent.isPress) {
                let tileChild = child;
                if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                    child.onClick(pfEvent);
                }
            }
        }
    }
    exports.Clicker = Clicker;
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
define("Playfield/Abilities/HovererMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hoverer = void 0;
    ;
    class Hoverer {
        Hoverer() {
            return this;
        }
        // --- Public Methods --- //
        hoverEvent(pfEvent, child) {
            let treeChild = child;
            if (pfEvent.isMove) {
                if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
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
define("Playfield/Abilities/EditorMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = void 0;
    ;
    class Editor {
        Editor() {
            this._focusObj = null;
            return this;
        }
        // --- Public Methods --- //
        editorEvent(pfEvent, child) {
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
        _editorParent() {
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
    exports.Editor = Editor;
});
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
        get isTimer() {
            return this._isTimer;
        }
        set isTimer(value) {
            this._isTimer = value;
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
        get isTimedOut() {
            this._lastTime = Date.now();
            return this._lastTime > this._timeout;
        }
    }
    exports.Timer = Timer;
});
define("Playfield/Abilities/EventDispatcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDispatcher = void 0;
    ;
    class EventDispatcher {
        EventDispatcher() {
            return this;
        }
        // --- Public Methods --- //
        dispatchEventToChildren(pfEvent) {
            let thisTile = this;
            for (let _child of thisTile.children.reverse()) {
                let child = _child;
                if (pfEvent.isActive)
                    this.dispatchEventToChild(pfEvent, child);
            }
        }
        dispatchEventToChild(pfEvent, child) {
            let that = this;
            child.onEvent(pfEvent, child);
            if (!pfEvent.isActive)
                return;
            if (child.isHoverable)
                that.hoverEvent(pfEvent, child);
            if (child.isDraggable)
                that.dragEvent(pfEvent, child);
            if (child.isSelectable)
                that.selectEvent(pfEvent, child);
            if (child.isClickable)
                that.clickEvent(pfEvent, child);
            if (child.isPressable)
                that.pressEvent(pfEvent, child);
            if (child.isFocusable)
                that.editorEvent(pfEvent, child);
        }
    }
    exports.EventDispatcher = EventDispatcher;
});
define("Playfield/Abilities/index", ["require", "exports", "Playfield/Abilities/DraggerMixin", "Playfield/Abilities/DraggableMixin", "Playfield/Abilities/SelectableMixin", "Playfield/Abilities/SelecterMixin", "Playfield/Abilities/PresserMixin", "Playfield/Abilities/PressableMixin", "Playfield/Abilities/ClickerMixin", "Playfield/Abilities/ClickableMixin", "Playfield/Abilities/HovererMixin", "Playfield/Abilities/HoverableMixin", "Playfield/Abilities/EditableMixin", "Playfield/Abilities/EditorMixin", "Playfield/Abilities/Timer", "Playfield/Abilities/EventDispatcher"], function (require, exports, DraggerMixin_1, DraggableMixin_1, SelectableMixin_1, SelecterMixin_1, PresserMixin_1, PressableMixin_1, ClickerMixin_1, ClickableMixin_1, HovererMixin_1, HoverableMixin_1, EditableMixin_1, EditorMixin_1, Timer_1, EventDispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDispatcher = exports.Timer = exports.Editor = exports.Editable = exports.Hoverable = exports.Hoverer = exports.Clickable = exports.Clicker = exports.Pressable = exports.Presser = exports.Selecter = exports.Selectable = exports.Draggable = exports.Dragger = void 0;
    Object.defineProperty(exports, "Dragger", { enumerable: true, get: function () { return DraggerMixin_1.Dragger; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return DraggableMixin_1.Draggable; } });
    Object.defineProperty(exports, "Selectable", { enumerable: true, get: function () { return SelectableMixin_1.Selectable; } });
    Object.defineProperty(exports, "Selecter", { enumerable: true, get: function () { return SelecterMixin_1.Selecter; } });
    Object.defineProperty(exports, "Presser", { enumerable: true, get: function () { return PresserMixin_1.Presser; } });
    Object.defineProperty(exports, "Pressable", { enumerable: true, get: function () { return PressableMixin_1.Pressable; } });
    Object.defineProperty(exports, "Clicker", { enumerable: true, get: function () { return ClickerMixin_1.Clicker; } });
    Object.defineProperty(exports, "Clickable", { enumerable: true, get: function () { return ClickableMixin_1.Clickable; } });
    Object.defineProperty(exports, "Hoverer", { enumerable: true, get: function () { return HovererMixin_1.Hoverer; } });
    Object.defineProperty(exports, "Hoverable", { enumerable: true, get: function () { return HoverableMixin_1.Hoverable; } });
    Object.defineProperty(exports, "Editable", { enumerable: true, get: function () { return EditableMixin_1.Editable; } });
    Object.defineProperty(exports, "Editor", { enumerable: true, get: function () { return EditorMixin_1.Editor; } });
    Object.defineProperty(exports, "Timer", { enumerable: true, get: function () { return Timer_1.Timer; } });
    Object.defineProperty(exports, "EventDispatcher", { enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } });
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Utils/index"], function (require, exports, Tile_1, Abilities_1, Utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootTile = exports._RootTile = void 0;
    class _RootTile extends Tile_1.Tile {
    }
    exports._RootTile = _RootTile;
    ;
    ;
    (0, Utils_2.applyMixins)(_RootTile, [Abilities_1.EventDispatcher, Utils_2.Logger, Abilities_1.Clicker, Abilities_1.Presser, Abilities_1.Selecter, Abilities_1.Dragger, Abilities_1.Editor, Abilities_1.Hoverer]);
    class RootTile extends _RootTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this.Logger();
            this.Clicker();
            this.Presser();
            this.Selecter();
            this.Dragger();
            this.Editor();
            this.Hoverer();
            this.EventDispatcher();
        }
        // --- Overrides --- //
        draw() {
            this.redrawChildren();
        }
        rsize(dx, dy) {
            let child = this.children[0];
            super.rsize(dx, dy);
            if (child.east) { // VSplit found
                child.rsize(dx, dy);
                child.east.rsize(dx, dy);
                child.west.rsize(dx, dy);
            }
            if (child.north) { // HSplit found
                child.rsize(dx, dy);
                child.north.rsize(dx, dy);
                child.south.rsize(dx, dy);
            }
        }
        // --- onActions --- //
        onEvent(pfEvent) {
            if (pfEvent.isMouseEvent && this.inBounds(pfEvent.x, pfEvent.y)) {
                this.dispatchEventToChildren(pfEvent);
            }
            else if (pfEvent.isKeyboardEvent) {
                this.dispatchEventToChildren(pfEvent);
            }
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
define("Playfield/Playfield", ["require", "exports", "Playfield/Tile", "Playfield/Utils/index", "Playfield/RootTile"], function (require, exports, Tile_2, Utils_3, RootTile_1) {
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
            this._rootTile = new RootTile_1.RootTile("_root", Tile_2.Tile.null, 0, 0, this.w, this.h);
            this._rootTile.playfield = this;
        }
        // --- Public Methods --- //
        clear() {
            this.gfx.rect(0, 0, this._gfx.width, this._gfx.height);
        }
        redraw() {
            this.clear();
            this.tile.redraw();
        }
        start(delay = 125) {
            this._delay = delay;
            this._lastTime = Date.now();
            this.redraw();
            if (this._delay >= 0)
                this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
        }
        stop() {
            this._delay = -1;
        }
        // --- Private Methods --- //
        _tick() {
            clearTimeout(this._timerId);
            let now = Date.now();
            let extra = now - this._lastTime;
            this._handleEvents();
            this.tile.onTick(); // process all ticks
            this.redraw(); // redraw the playfield
            this._lastTime = Date.now();
            let delta = this._lastTime - now;
            if (this._delay && (delta > this._delay))
                console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
            this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
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
        get tile() {
            return this._rootTile;
        }
        get gfx() {
            return this._gfx;
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/HSplit", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Abilities/index", "Playfield/Utils/index", "Playfield/RootTile"], function (require, exports, Tile_3, Abilities_2, Abilities_3, Utils_4, RootTile_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HSplit = exports._HSplit = void 0;
    class _HSplit extends Tile_3.Tile {
    }
    exports._HSplit = _HSplit;
    ;
    ;
    (0, Utils_4.applyMixins)(_HSplit, [Abilities_3.Draggable, Abilities_2.EventDispatcher, Utils_4.Logger, Abilities_2.Clicker, Abilities_2.Presser, Abilities_2.Selecter, Abilities_2.Dragger, Abilities_2.Editor, Abilities_2.Hoverer]);
    class HSplit extends _HSplit {
        constructor(name, parent, percent) {
            super(name, parent, 0, 0, 0, 0);
            this._margin = 0;
            this._gutter = 4;
            this._splitHeight = 0;
            if (percent >= 1.0)
                percent = percent / 100.0;
            this.x = 0;
            this.y = 0;
            this.w = parent.w;
            this.h = parent.h;
            this.Logger();
            this.Clicker();
            this.Presser();
            this.Selecter();
            this.Dragger();
            this.Editor();
            this.Hoverer();
            this.EventDispatcher();
            this.Draggable();
            let dh = this.h - this._margin * 2 - this._gutter;
            this._splitHeight = (0, Utils_4.int)(dh * percent);
            let nx = this._margin;
            let ny = this._margin;
            let nw = this.w - this._margin * 2;
            let nh = this._splitHeight;
            let sx = nx;
            let sy = ny + nh + this._gutter / 2;
            let sw = this.w - this._margin * 2;
            let sh = dh - this._splitHeight;
            this._north = new RootTile_2.RootTile("north", this, nx, ny, nw, nh);
            this._south = new RootTile_2.RootTile("south", this, sx, sy, sw, sh);
        }
        // --- Overrides --- //
        addChild(child) {
            if (this.children.length < 2)
                super.addChild(child);
            else
                throw new Error("You must use HSplit.north or HSplit.south");
        }
        draw() {
            this._drawChild(this.north);
            this._drawChild(this.south);
        }
        _drawChild(child) {
            child.gfx.rect(child.x, child.y, child.w, child.h);
            child.gfx.clipRect(child.x, child.y, child.w, child.h);
            child.redraw();
            child.gfx.restore();
        }
        // --- onActions --- //
        onGrab(dx, dy, pfEvent) {
            if ((0, Utils_4.between)(this._margin, dx, this.w - this._margin)
                && (0, Utils_4.between)(this._margin + this._splitHeight, dy, this._margin + this._splitHeight + this._gutter)) {
                return super.onGrab(dx, dy, pfEvent);
            }
            return false;
        }
        onDrag(dx, dy, pfEvent) {
            if (this.isDragging) {
                if (this._splitHeight + dy > this._gutter) {
                    this._north.rsize(0, dy);
                    this._south.rmove(0, dy);
                    this._south.rsize(0, -dy);
                    this._splitHeight += dy;
                }
                return true;
            }
            return false;
        }
        rsize(dx, dy) {
            super.rsize(dx, dy);
            this._north.rsize(0, dy);
            this._south.rmove(0, dy);
            this._south.rsize(0, -dy);
            this._splitHeight += dy;
        }
        onEvent(pfEvent) {
            if (this.inBounds(pfEvent.x, pfEvent.y)) {
                if (!this.isDragging)
                    this.dispatchEventToChildren(pfEvent);
            }
            else {
                if (pfEvent.isKeyboardEvent)
                    this.dispatchEventToChildren(pfEvent);
            }
        }
        get north() {
            return this._north;
        }
        set north(value) {
            this._north = value;
        }
        get south() {
            return this._south;
        }
        set south(value) {
            this._south = value;
        }
    }
    exports.HSplit = HSplit;
});
define("Playfield/VSplit", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Abilities/index", "Playfield/Utils/index", "Playfield/RootTile"], function (require, exports, Tile_4, Abilities_4, Abilities_5, Utils_5, RootTile_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VSplit = exports._VSplit = void 0;
    class _VSplit extends Tile_4.Tile {
    }
    exports._VSplit = _VSplit;
    ;
    ;
    (0, Utils_5.applyMixins)(_VSplit, [Abilities_5.Draggable, Abilities_4.EventDispatcher, Utils_5.Logger, Abilities_4.Clicker, Abilities_4.Presser, Abilities_4.Selecter, Abilities_4.Dragger, Abilities_4.Editor, Abilities_4.Hoverer]);
    class VSplit extends _VSplit {
        constructor(name, parent, percent) {
            super(name, parent, 0, 0, 0, 0);
            this._margin = 0;
            this._gutter = 4;
            this._splitWidth = 0;
            if (percent >= 1.0)
                percent = percent / 100.0;
            this.x = 0;
            this.y = 0;
            this.w = parent.w;
            this.h = parent.h;
            this.Logger();
            this.Clicker();
            this.Presser();
            this.Selecter();
            this.Dragger();
            this.Editor();
            this.Hoverer();
            this.EventDispatcher();
            this.Draggable();
            let dw = this.w - this._margin * 2 - this._gutter;
            this._splitWidth = (0, Utils_5.int)(dw * percent);
            let nx = this._margin;
            let ny = this._margin;
            let nh = this.h - this._margin * 2;
            let nw = this._splitWidth;
            let sy = ny;
            let sx = nx + nw + this._gutter / 2;
            let sh = this.h - this._margin * 2;
            let sw = dw - this._splitWidth;
            this._east = new RootTile_3.RootTile("east", this, nx, ny, nw, nh);
            this._west = new RootTile_3.RootTile("west", this, sx, sy, sw, sh);
        }
        // --- Overrides --- //
        addChild(child) {
            if (this.children.length < 2)
                super.addChild(child);
            else
                throw new Error("You must use VSplit.east or VSplit.west");
        }
        draw() {
            this._drawChild(this.east);
            this._drawChild(this.west);
        }
        _drawChild(child) {
            child.gfx.rect(child.x, child.y, child.w, child.h);
            child.gfx.clipRect(child.x, child.y, child.w, child.h);
            child.redraw();
            child.gfx.restore();
        }
        // --- onActions --- //
        onGrab(dx, dy, pfEvent) {
            if ((0, Utils_5.between)(this._margin, dy, this.h - this._margin)
                && (0, Utils_5.between)(this._margin + this._splitWidth, dx, this._margin + this._splitWidth + this._gutter)) {
                return super.onGrab(dx, dy, pfEvent);
            }
            return false;
        }
        onDrag(dx, dy, pfEvent) {
            if (this.isDragging) {
                if (this._splitWidth + dx > this._gutter) {
                    this._east.rsize(dx, 0);
                    this._west.rmove(dx, 0);
                    this._west.rsize(-dx, 0);
                    this._splitWidth += dx;
                }
            }
        }
        rsize(dx, dy) {
            super.rsize(dx, dy);
            this._east.rsize(dx, 0);
            this._west.rmove(dx, 0);
            this._west.rsize(-dx, 0);
            this._splitWidth += dx;
        }
        onEvent(pfEvent) {
            if (this.inBounds(pfEvent.x, pfEvent.y)) {
                if (!this.isDragging)
                    this.dispatchEventToChildren(pfEvent);
            }
            else {
                if (pfEvent.isKeyboardEvent)
                    this.dispatchEventToChildren(pfEvent);
            }
        }
        get east() {
            return this._east;
        }
        set east(value) {
            this._east = value;
        }
        get west() {
            return this._west;
        }
        set west(value) {
            this._west = value;
        }
    }
    exports.VSplit = VSplit;
});
define("Playfield/Slider", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Utils/index", "Playfield/Graphics/index"], function (require, exports, Tile_5, Abilities_6, Utils_6, Graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Slider = exports._Slider = void 0;
    class _Slider extends Tile_5.Tile {
    }
    exports._Slider = _Slider;
    ;
    ;
    (0, Utils_6.applyMixins)(_Slider, [Abilities_6.Draggable, Abilities_6.Hoverable]);
    function inormalize(r, multiplier) {
        if (r <= 1.0)
            return (0, Utils_6.int)(r * multiplier);
        return (0, Utils_6.int)(r);
    }
    class Slider extends _Slider {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._margins = new Utils_6.Margins();
            this._cursor = new Utils_6.Rect();
            this._rcursor = new Utils_6.Rect();
            this._ratio = new Utils_6.Ratio();
            this._vslide = true;
            this._hslide = true;
            this._text = "";
            this._minW = 10;
            this._minH = 10;
            this.Draggable();
            this.Hoverable();
            this._margins.Margins(4, 4, 4, 4); // top, right, bottom, left
            this.cursorSize(0.5, 0.5);
            this.cursorMove(0.5, 0.5);
            this.gfx.gparms.textBaseline = Graphics_1.GfxParms.MIDDLE;
            this.gfx.gparms.textAlign = Graphics_1.GfxParms.CENTER;
            this.gfx.gparms.fontSize = 12;
        }
        onChange(x, y, pfEvent) {
            console.log("OnChange", x, y);
        }
        cursorMove(rx, ry) {
            let x = inormalize(rx, this.dw) + this._margins.top;
            let y = inormalize(ry, this.dh) + this._margins.left;
            this._cursor.move(x, y);
            this._rcursor.move(rx, ry);
        }
        cursorSize(rw, rh) {
            let dw = this.w - this._margins.left - this._margins.right;
            let dh = this.h - this._margins.top - this._margins.bottom;
            let w = inormalize(rw, dw) || this._cursor.w; // preserve old width if rw == 0
            let h = inormalize(rh, dh) || this._cursor.h; // preserve old height if rh == 0
            w = Math.max(w, this._minW);
            h = Math.max(h, this._minH);
            this._cursor.size(w, h);
            this.cursorMove(this._rcursor.x, this._rcursor.y);
            this._rcursor.size(rw || this._rcursor.w, rh || this._rcursor.h);
        }
        draw() {
            let c = this._cursor;
            this.gfx.clipRect(this.x, this.y, this.w, this.h);
            this.gfx.gparms.fillColor = "#ccc";
            this.gfx.rect(this.x, this.y, this.w, this.h);
            if (this.isDragging) {
                this.gfx.gparms.fillColor = "red";
            }
            else if (this.isHovering) {
                this.gfx.gparms.fillColor = "#c88";
            }
            else {
                this.gfx.gparms.fillColor = "white";
            }
            this.gfx.textRect(this._text, this.x + c.x, this.y + c.y, c.w, c.h);
            this.gfx.restore();
        }
        onGrab(dx, dy, pfEvent) {
            let c = this._cursor;
            if ((0, Utils_6.between)(c.x, dx, c.x + c.w) && (0, Utils_6.between)(c.y, dy, c.y + c.h)) {
                super.onGrab(dx, dy, pfEvent);
                return true;
            }
            return false;
        }
        onDrag(dx, dy, pfEvent) {
            let c = this._cursor;
            let xmax = this.dw + this._margins.left;
            let ymax = this.dh + this._margins.top;
            if (this._hslide)
                c.x = (0, Utils_6.limit)(this._margins.left, c.x + dx, xmax);
            if (this._vslide)
                c.y = (0, Utils_6.limit)(this._margins.top, c.y + dy, ymax);
            this._rcursor.move(this.rx, this.ry);
            this.onChange(this.rx, this.ry, pfEvent);
            pfEvent.isActive = false;
        }
        onDrop(pfEvent) {
            super.onDrop(pfEvent);
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
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile", "Playfield/EventQueue", "Playfield/HSplit", "Playfield/VSplit", "Playfield/Slider"], function (require, exports, Playfield_1, Tile_6, EventQueue_1, HSplit_1, VSplit_1, Slider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Slider = exports.VSplit = exports.HSplit = exports.EventQueue = exports.Tile = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_6.Tile; } });
    Object.defineProperty(exports, "EventQueue", { enumerable: true, get: function () { return EventQueue_1.EventQueue; } });
    Object.defineProperty(exports, "HSplit", { enumerable: true, get: function () { return HSplit_1.HSplit; } });
    Object.defineProperty(exports, "VSplit", { enumerable: true, get: function () { return VSplit_1.VSplit; } });
    Object.defineProperty(exports, "Slider", { enumerable: true, get: function () { return Slider_1.Slider; } });
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
define("Browser/BrowserGfx", ["require", "exports", "Playfield/Graphics/GfxParms"], function (require, exports, GfxParms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserGfx = void 0;
    var PIXEL_RATIO = (function () {
        var ctx = document.createElement("canvas").getContext("2d"), dpr = window.devicePixelRatio || 1, bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    })();
    function createHiDPICanvas(w, h, canvas, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        var can = canvas || document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
    function createHiDPIFromCanvas(canvasId, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        var can = document.querySelector(canvasId);
        can._ratio = ratio;
        can.width = can.width * ratio;
        can.height = can.height * ratio;
        can.style.width = can.width + "px";
        can.style.height = can.height + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
    class BrowserGfx {
        constructor(canvasId) {
            if (canvasId)
                this._init(canvasId);
        }
        _init(canvasId) {
            // this._canvas = createHiDPIFromCanvas(canvasId, 1.0);
            this._canvas = createHiDPIFromCanvas(canvasId);
            this._ctx = this._canvas.getContext("2d");
            this._gparms = new GfxParms_2.GfxParms();
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
        rect(x, y, w, h) {
            if (this.gparms.fillColor) {
                this._ctx.fillStyle = this.gparms.fillColor;
                this._ctx.beginPath();
                if (this.gparms.borderRadius)
                    this._ctx.roundRect(this.gparms.dx + x, this.gparms.dy + y, w, h, this.gparms.borderRadius);
                else
                    this._ctx.rect(this.gparms.dx + x, this.gparms.dy + y, w, h);
                this._ctx.fill();
            }
            if (this.gparms.borderColor) {
                this._ctx.strokeStyle = this.gparms.borderColor;
                this._ctx.beginPath();
                if (this.gparms.borderRadius)
                    this._ctx.roundRect(this.gparms.dx + x, this.gparms.dy + y, w, h, this.gparms.borderRadius);
                else
                    this._ctx.rect(this.gparms.dx + x, this.gparms.dy + y, w, h);
                this._ctx.stroke();
            }
        }
        ellipse(x, y, w, h) {
            if (this.gparms.fillColor) {
                this._ctx.beginPath();
                this._ctx.ellipse(this.gparms.dx + x + w / 2, this.gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this._ctx.fillStyle = this.gparms.fillColor;
                this._ctx.fill();
            }
            if (this.gparms.borderColor) {
                this._ctx.beginPath();
                this._ctx.ellipse(this.gparms.dx + x + w / 2, this.gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this._ctx.strokeStyle = this.gparms.borderColor;
                this._ctx.stroke();
            }
        }
        circle(x, y, r) {
            this.ellipse(x - r, y - r, r * 2, r * 2);
        }
        line(x0, y0, x1, y1) {
            this._ctx.beginPath();
            this._ctx.strokeStyle = this.gparms.borderColor;
            this._ctx.moveTo(this.gparms.dx + x0, this.gparms.dy + y0);
            this._ctx.lineTo(this.gparms.dx + x1, this.gparms.dy + y1);
            this._ctx.stroke();
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
                textX += w;
            }
            else if (this.gparms.textAlign === GfxParms_2.GfxParms.CENTER) {
                textX += w / 2;
            }
            else {
                throw new Error("Unknown textAlign: " + this.gparms.textAlign);
            }
            if (this.gparms.textBaseline === GfxParms_2.GfxParms.TOP) {
                // do nothing
            }
            else if (this.gparms.textBaseline === GfxParms_2.GfxParms.BOTTOM) {
                textY += h;
            }
            else if (this.gparms.textBaseline === GfxParms_2.GfxParms.MIDDLE) {
                textY += h / 2;
            }
            else {
                throw new Error("Unknown textAlign: " + this.gparms.textAlign);
            }
            if (w) {
                this.clipRect(x - 1, y - 1, w + 2, h + 2);
                this._ctx.fillText(msg, this.gparms.dx + textX, this.gparms.dy + textY);
                this.restore();
            }
            else {
                this._ctx.fillText(msg, this.gparms.dx + textX, this.gparms.dy + textY);
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
            this.text(msg, x + 1, y + 1, w, h);
        }
        boundingBox(msg) {
            this._ctx.font = this.gparms.font;
            let boundingBox = this._ctx.measureText(msg);
            return { w: Math.floor(boundingBox.width + 0.5), h: this.gparms.fontSize };
        }
        clipRect(x = 0, y = 0, w = this._ctx.canvas.width, h = this._ctx.canvas.height) {
            this.save();
            let region = new Path2D();
            region.rect(x + this.gparms.dx - 1, y + this.gparms.dy - 2, w + 2, h + 2);
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
            return this._canvas.width;
        }
        get height() {
            return this._canvas.height;
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
        constructor(canvasId = "#playfield") {
            this._gfx = new BrowserGfx_1.BrowserGfx(canvasId);
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
define("Browser/index", ["require", "exports", "Browser/BrowserEventPump", "Browser/BrowserGfx", "Browser/BrowserPlayfieldApp", "Browser/BrowserPlayfieldEvent"], function (require, exports, BrowserEventPump_2, BrowserGfx_2, BrowserPlayfieldApp_1, BrowserPlayfieldEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserPlayfieldEvent = exports.BrowserPlayfieldApp = exports.BrowserGfx = exports.BrowserEventPump = void 0;
    Object.defineProperty(exports, "BrowserEventPump", { enumerable: true, get: function () { return BrowserEventPump_2.BrowserEventPump; } });
    Object.defineProperty(exports, "BrowserGfx", { enumerable: true, get: function () { return BrowserGfx_2.BrowserGfx; } });
    Object.defineProperty(exports, "BrowserPlayfieldApp", { enumerable: true, get: function () { return BrowserPlayfieldApp_1.BrowserPlayfieldApp; } });
    Object.defineProperty(exports, "BrowserPlayfieldEvent", { enumerable: true, get: function () { return BrowserPlayfieldEvent_2.BrowserPlayfieldEvent; } });
});
define("Jed/ItemOptions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemOptions = void 0;
    class ItemOptions {
        constructor() {
            this.fontSize = 24;
            this.fontFace = "sans-serif";
            this.fontStyle = "";
            this.text = "";
            this.label = "";
            this.textColor = "black";
            this.borderColor = "black";
            this.fillColor = "white";
            this.selectColor = "red";
            this.hoverColor = "#c88";
            this.textAlign = "left";
            this.textBaseline = "top";
        }
    }
    exports.ItemOptions = ItemOptions;
});
define("Jed/Item", ["require", "exports", "Playfield/index", "Playfield/Utils/index", "Playfield/Abilities/index", "Jed/ItemOptions", "Playfield/Graphics/index"], function (require, exports, Playfield_3, Utils_7, Abilities_7, ItemOptions_1, Graphics_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = exports._Item = void 0;
    class _Item extends Playfield_3.Tile {
    }
    exports._Item = _Item;
    ;
    ;
    (0, Utils_7.applyMixins)(_Item, [Abilities_7.Draggable]);
    class Item extends _Item {
        constructor(name, parent, x, y, w, h, value = "", text = "") {
            super(name, parent, x, y, w, h);
            this.Draggable();
            this._value = value;
            this._options = new ItemOptions_1.ItemOptions;
            this._options.text = text || value;
            this._options.fontSize = h;
            if (w < 0) {
                this._options.textAlign = Graphics_2.GfxParms.RIGHT;
                this.w = -w;
            }
        }
        _updateGparms() {
            this.gfx.gparms.fillColor = this.options.fillColor;
            this.gfx.gparms.color = this.options.textColor;
            this.gfx.gparms.borderColor = this.options.borderColor;
            this.gfx.gparms.fontSize = this.options.fontSize;
            this.gfx.gparms.fontFace = this.options.fontFace;
            this.gfx.gparms.fontStyle = this.options.fontStyle;
            this.gfx.gparms.textAlign = this.options.textAlign;
            this.gfx.gparms.textBaseline = this.options.textBaseline;
        }
        go() {
            throw Error("Unimplemented feature: 'go()';");
        }
        _recompute() {
            if (this.parent) {
                this.gfx.gparms.dx = this.parent.X + (this.parent.xMargin || 0);
                this.gfx.gparms.dy = this.parent.Y + (this.parent.yMargin || 0);
            }
        }
        // --- Accessors --- //
        get value() {
            return this._value;
        }
        set value(_value) {
            this._value = _value;
        }
        get options() {
            return this._options;
        }
    }
    exports.Item = Item;
});
define("Jed/ButtonItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_1, Utils_8, Abilities_8, Graphics_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonItem = exports._ButtonItem = void 0;
    class _ButtonItem extends Item_1.Item {
    }
    exports._ButtonItem = _ButtonItem;
    ;
    ;
    (0, Utils_8.applyMixins)(_ButtonItem, [Abilities_8.Draggable, Abilities_8.Pressable, Abilities_8.Hoverable]);
    class ButtonItem extends _ButtonItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this._label = "";
            this.Draggable();
            this.Pressable();
            this.Hoverable();
            this.Logger("info", false);
            this.isDraggable = true;
            this._label = label || value || name;
            this.gfx.gparms.borderRadius = 10;
            this.options.textAlign = Graphics_3.GfxParms.CENTER;
            this.gfx.gparms.textAlign = Graphics_3.GfxParms.CENTER;
            this.options.textBaseline = Graphics_3.GfxParms.MIDDLE;
            this.gfx.gparms.textBaseline = Graphics_3.GfxParms.MIDDLE;
            this.gfx.gparms.fontSize = 14;
            this.options.fontSize = 14;
            let bb = this.gfx.boundingBox(label);
            this.w = this.w || bb.w;
            this.h = this.h || bb.h;
        }
        // --- Overrides --- //
        go() {
            return false;
        }
        draw() {
            let gparms = this.gfx.gparms;
            this._updateGparms();
            let x = this.x;
            let y = this.y;
            let bb = this.gfx.boundingBox(this._label);
            let w = this.w || bb.w;
            let h = this.h || bb.h;
            if (this.isHovering && this.isPressed)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering && !this.isPressed)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = this.options.fillColor;
            this.gfx.clipRect(x, y, w, h);
            this.gfx.textRect(this._label, x, y, w, h);
            this.gfx.restore();
        }
        onPress() {
            return true;
        }
        // --- onActions --- //
        onRelease() {
            if (this.isHovering)
                this.go();
            return true;
        }
        // --- Accessors --- //
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
    }
    exports.ButtonItem = ButtonItem;
});
define("Jed/GroupItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_2, Utils_9, Abilities_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupItem = exports._GroupItem = void 0;
    class _GroupItem extends Item_2.Item {
    }
    exports._GroupItem = _GroupItem;
    ;
    ;
    (0, Utils_9.applyMixins)(_GroupItem, [Abilities_9.EventDispatcher, Utils_9.Logger, Abilities_9.Clicker, Abilities_9.Presser, Abilities_9.Selecter, Abilities_9.Dragger, Abilities_9.Editor, Abilities_9.Hoverer]);
    class GroupItem extends _GroupItem {
        constructor(name, parent, x, y, w = 0, h = 0, label) {
            super(name, parent, x, y, w, h, label);
            this.Logger("info", false);
            this.Clicker();
            this.Presser();
            this.Selecter();
            this.Dragger();
            this.Editor();
            this.Hoverer();
            this.EventDispatcher();
            this.Draggable();
            this._isBoxed = true;
            this._xMargin = 10;
            this._yMargin = 10;
            this._label = label;
            this._isResizing = false;
        }
        // --- Overrides --- //
        inBounds(dx, dy) {
            for (let _child of this.children.reverse()) {
                let tileChild = _child;
                if (tileChild.inBounds(dx, dy))
                    return this;
            }
            if (this.isBoxed) {
                let wh = this._computeWidthHeight();
                let result = (0, Utils_9.between)(this.X, dx, this.X + wh.w) &&
                    (0, Utils_9.between)(this.Y - this.gfx.gparms.fontSize / 2, dy, this.Y + wh.h);
                if (result)
                    return this;
            }
            return super.inBounds(dx, dy);
        }
        onEvent(pfEvent) {
            this.dispatchEventToChildren(pfEvent);
        }
        onGrab(dx, dy, pfEvent) {
            super.onGrab(dx, dy, pfEvent);
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
            if (w || h)
                return { w, h };
            for (let child of this.children) {
                child._recompute();
                let rectChild = child;
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
            }
            return { w, h };
        }
        draw() {
            if (this.isBoxed) {
                let wh = this._computeWidthHeight();
                this.gfx.clipRect(this.x, this.y, wh.w, wh.h);
                this.gfx.rect(this.x, this.y, wh.w, wh.h);
                if (this.label) {
                    this.gfx.restore();
                    this.gfx.gparms.fontSize = 12;
                    let labelX = this.x + this.xMargin / 2;
                    let labelY = this.y - this.gfx.gparms.fontSize / 2;
                    let labelW = Math.min(this.gfx.boundingBox(this.label).w, wh.w - this.xMargin);
                    let labelH = this.gfx.gparms.fontSize;
                    let gfx = this.gfx.clone();
                    gfx.gparms.borderColor = "";
                    this.gfx.clipRect(labelX, labelY, wh.w - this.xMargin / 2, wh.h + this.gfx.gparms.fontSize / 2);
                    gfx.rect(labelX, labelY, labelW, labelH);
                    gfx.text(this.label, labelX, labelY, labelW);
                }
                this.redrawChildren();
                this.gfx.restore();
            }
            else {
                this.redrawChildren();
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
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
        get w() {
            if (!super.w)
                return this._computeWidthHeight().w;
            else
                return super.w;
        }
        get h() {
            if (!super.h)
                return this._computeWidthHeight().h;
            else
                return super.h;
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
    exports.GroupItem = GroupItem;
});
define("Jed/CheckboxItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_3, Utils_10, Abilities_10, Graphics_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CheckboxItem = exports._CheckboxItem = void 0;
    class _CheckboxItem extends Item_3.Item {
    }
    exports._CheckboxItem = _CheckboxItem;
    ;
    ;
    (0, Utils_10.applyMixins)(_CheckboxItem, [Abilities_10.Draggable, Abilities_10.Clickable, Abilities_10.Hoverable]);
    class CheckboxItem extends _CheckboxItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this._label = "";
            this._isChecked = false;
            this.Draggable();
            this.Clickable();
            this.Logger();
            this._label = label || value || name;
            this.options.fontSize = 14;
            this.gfx.gparms.fontSize = 14;
            let bb = this.gfx.boundingBox(label);
            this.w = this.w || bb.w + 2 + this.options.fontSize;
            this.h = this.h || bb.h + 2;
        }
        // --- Public Methods --- //
        go() {
            return false;
        }
        // --- Overrides --- //
        draw() {
            let gparms = this.gfx.gparms;
            this._updateGparms();
            if (this.isChecked)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = "white";
            let boxX = this.x;
            let boxY = this.y;
            let boxW = gparms.fontSize;
            let boxH = boxW;
            let textX = boxX + boxW + 2;
            let textY = boxY;
            let textW = this.w - boxW - 2;
            let textH = boxH + 2;
            gparms.textBaseline = Graphics_4.GfxParms.BOTTOM;
            this.gfx.clipRect(this.x, this.y, this.w, this.h);
            this.gfx.rect(boxX, boxY, boxW, boxH);
            this.gfx.text(this._label, textX, textY, textW, textH);
            this.gfx.restore();
        }
        // --- onActions  --- //
        onClick() {
            this.isChecked = !this.isChecked;
            return this.go();
        }
        onUnselect() {
            this.isChecked = false;
            return this.go();
        }
        // --- Accessors --- //
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
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
    exports.CheckboxItem = CheckboxItem;
});
define("Jed/LabelItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_4, Utils_11, Abilities_11, Graphics_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelItem = exports._LabelItem = void 0;
    class _LabelItem extends Item_4.Item {
    }
    exports._LabelItem = _LabelItem;
    ;
    ;
    (0, Utils_11.applyMixins)(_LabelItem, [Abilities_11.Draggable]);
    class LabelItem extends _LabelItem {
        constructor(name, parent, x, y, w, h, value = "") {
            super(name, parent, x, y, w, h, value);
            this.Draggable();
            this.Logger();
            this.options.fontSize = h;
            this.options.fontStyle = Graphics_5.GfxParms.BOLD;
            this._updateGparms();
        }
        // --- Overrides --- //
        draw() {
            this._updateGparms();
            this.gfx.gparms.borderColor = "";
            let w = this.w;
            let h = this.h;
            let x = this.x;
            let y = this.y;
            this.gfx.clipRect(x, y, w, h);
            this.gfx.textRect(this.value, x, y, w, h);
            this.gfx.restore();
        }
    }
    exports.LabelItem = LabelItem;
});
define("Jed/RadioItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index", "Playfield/Graphics/index"], function (require, exports, Item_5, Utils_12, Abilities_12, Graphics_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RadioItem = exports._RadioItem = void 0;
    class _RadioItem extends Item_5.Item {
    }
    exports._RadioItem = _RadioItem;
    ;
    ;
    (0, Utils_12.applyMixins)(_RadioItem, [Abilities_12.Draggable, Abilities_12.Selectable, Abilities_12.Hoverable]);
    class RadioItem extends _RadioItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value || name);
            this._label = "";
            this.Draggable();
            this.Selectable();
            this.Logger();
            this._label = label || value || name;
            this.options.fontSize = 14;
            this.gfx.gparms.fontSize = 14;
            let bb = this.gfx.boundingBox(label);
            this.w = this.w || bb.w + 2 + this.options.fontSize;
            this.h = this.h || bb.h + 2;
        }
        // --- Public Methods --- //
        go() {
            return false;
        }
        // --- Overrides --- //
        draw() {
            let gparms = this.gfx.gparms;
            this._updateGparms();
            if (this.isSelected)
                gparms.fillColor = this.options.selectColor;
            else if (this.isHovering)
                gparms.fillColor = this.options.hoverColor;
            else
                gparms.fillColor = "white";
            let boxX = this.x + 1;
            let boxY = this.y + 1;
            let boxW = this.gfx.gparms.fontSize;
            let boxH = boxW + 2;
            let r = boxW / 2;
            let textX = boxX + boxW + 2;
            let textY = boxY;
            let textW = this.w - boxW - 2;
            let textH = boxH;
            this.gfx.gparms.textBaseline = Graphics_6.GfxParms.BOTTOM;
            this.gfx.clipRect(this.x, this.y, this.w, this.h);
            this.gfx.circle(boxX + r, boxY + r, r);
            this.gfx.text(this._label, textX, textY, textW, textH);
            this.gfx.restore();
        }
        // --- onActions  --- //
        onSelect() {
            return this.go();
        }
        // --- Accessors --- //
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
        get value() {
            if (this.isSelected)
                return super.value;
            else
                return "";
        }
        set value(s) {
            super.value = s;
        }
    }
    exports.RadioItem = RadioItem;
});
define("Jed/TextItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_6, Utils_13, Abilities_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextItem = exports._TextItem = void 0;
    class _TextItem extends Item_6.Item {
    }
    exports._TextItem = _TextItem;
    ;
    ;
    (0, Utils_13.applyMixins)(_TextItem, [Abilities_13.Draggable, Abilities_13.Editable, Abilities_13.Timer]);
    class TextItem extends _TextItem {
        constructor(name, parent, x, y, w, h, value = "") {
            super(name, parent, x, y, w, h, value);
            this._cursor = 0;
            this._left = 0;
            this._right = 0;
            this._cursorOn = true;
            this._cursorBlinkRate = 500;
            this._nchars = 0;
            this._nchars2 = 0;
            this.Draggable();
            this.Editable();
            this.Logger();
            this.Timer();
            this.options.fontFace = "monospace";
            this.options.fontSize = h;
            this._updateGparms();
            this._nchars = Math.ceil(this.w / this.playfield.gfx.boundingBox("m").w);
            this._nchars2 = Math.ceil(this.w / this.playfield.gfx.boundingBox("m").w / 2);
            this._left = 0;
            this._right = this._computeRight();
            this.isDraggable = true;
        }
        // --- Overrides --- //
        draw() {
            this._blink();
            let gfx = this.gfx;
            this._updateGparms();
            if (this.isFocus)
                this.gfx.gparms.color = this.options.selectColor;
            else
                this.gfx.gparms.color = this.options.textColor;
            gfx.clipRect(this.x, this.y, this.w, this.h);
            let value = this.value.substring(this._left);
            if (this.isFocus)
                value = value.replaceAll(" ", '\uA788'); // \u00B7
            gfx.textRect(value, this.x, this.y, this.w, this.h);
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
        // --- Private Methods --- //
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
            gfx.line(x0, y0, x1, y1);
            gfx.line(x0 + 1, y0, x1 + 1, y1);
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
    exports.TextItem = TextItem;
});
define("Jed/index", ["require", "exports", "Jed/TextItem", "Jed/ButtonItem", "Jed/CheckboxItem", "Jed/RadioItem", "Jed/LabelItem", "Jed/GroupItem"], function (require, exports, TextItem_1, ButtonItem_1, CheckboxItem_1, RadioItem_1, LabelItem_1, GroupItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupItem = exports.LabelItem = exports.RadioItem = exports.CheckboxItem = exports.ButtonItem = exports.TextItem = void 0;
    Object.defineProperty(exports, "TextItem", { enumerable: true, get: function () { return TextItem_1.TextItem; } });
    Object.defineProperty(exports, "ButtonItem", { enumerable: true, get: function () { return ButtonItem_1.ButtonItem; } });
    Object.defineProperty(exports, "CheckboxItem", { enumerable: true, get: function () { return CheckboxItem_1.CheckboxItem; } });
    Object.defineProperty(exports, "RadioItem", { enumerable: true, get: function () { return RadioItem_1.RadioItem; } });
    Object.defineProperty(exports, "LabelItem", { enumerable: true, get: function () { return LabelItem_1.LabelItem; } });
    Object.defineProperty(exports, "GroupItem", { enumerable: true, get: function () { return GroupItem_1.GroupItem; } });
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
define("Playfield/Shapes/BoxTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, ShapeTile_1, Utils_14, Abilities_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTile = exports._BoxTile = void 0;
    class _BoxTile extends ShapeTile_1.ShapeTile {
    }
    exports._BoxTile = _BoxTile;
    ;
    ;
    (0, Utils_14.applyMixins)(_BoxTile, [Abilities_14.Draggable, Abilities_14.Selectable]);
    class BoxTile extends _BoxTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._colors = ["red", "orange", "green", "blue", "indigo", "violet"];
            this._color = 0;
            this.Draggable();
            this.Selectable();
            this.gfx.gparms.fillColor = this._colors[2];
        }
        // --- Overrides ---//
        draw() {
            // if (this.isSelected) this.gfx.gparms.borderColor = "black";
            // else this.gfx.gparms.borderColor = "";
            // this.gfx.gparms.fillColor = this._colors[this._color];
            this.playfield.gfx.rect(this.x, this.y, this.w, this.h);
        }
        // --- onActions --- //
        onGrab(dx, dy) {
            this.toFront();
            return true;
        }
        onClick() {
            this._color = (this._color + 1) % this._colors.length;
            this.warn(this._color);
        }
        onDrop() {
            this.toFront();
            return true;
        }
        onTick() {
            return true;
        }
    }
    exports.BoxTile = BoxTile;
});
define("Playfield/Shapes/CircleTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Abilities/index", "Playfield/Utils/index"], function (require, exports, ShapeTile_2, Abilities_15, Utils_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = exports._CircleTile = void 0;
    class _CircleTile extends ShapeTile_2.ShapeTile {
    }
    exports._CircleTile = _CircleTile;
    ;
    ;
    (0, Utils_15.applyMixins)(_CircleTile, [Abilities_15.Draggable, Abilities_15.Selectable]);
    class CircleTile extends _CircleTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._dx = 0;
            this._dy = 0;
            this.Draggable();
        }
        // --- Overrides --- //
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
        draw() {
            if (this.isSelected)
                this.gfx.gparms.borderColor = "black";
            else
                this.gfx.gparms.borderColor = "";
            this.gfx.gparms.fillColor = "gray";
            this.playfield.gfx.circle(this.x, this.y, this.w);
            if (this._dx && this._dy) {
                let oldColor = this.gfx.gparms.fillColor;
                this.gfx.gparms.fillColor = "red";
                let r = Math.floor(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
                this.playfield.gfx.circle(this.x, this.y, r);
                this.gfx.gparms.fillColor = oldColor;
            }
        }
        // --- onActions --- //
        onGrab(dx, dy, event) {
            this._dx = this.X - event.x;
            this._dy = this.Y - event.y;
            this.toFront();
            return true;
        }
        onDrop() {
            this.toFront();
            this._dx = 0;
            this._dy = 0;
            return true;
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
define("Test/BoxTestTile", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTestTile = void 0;
    class BoxTestTile extends Playfield_4.Tile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
            this.gfx.gparms.borderColor = "red";
            this.gfx.gparms.color = "blue";
            this.gfx.gparms.fillColor = "green";
        }
        draw() {
            this.playfield.gfx.rect(this.x, this.y, this.w, this.h);
        }
        onTick() {
            let obj = this;
            this.rmove(obj.DX || 10, obj.DY || 10);
            if (this.X > this.playfield.w || this.X <= 0) {
                if (obj.DX === undefined)
                    this.rmove(-this.x, 0);
                else
                    obj.DX = -obj.DX;
            }
            if (this.Y > this.playfield.h || this.Y <= 0) {
                if (obj.DY === undefined)
                    this.rmove(0, -this.y);
                else
                    obj.DY = -obj.DY;
            }
            // notice - does not move children
            return true;
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
            this.gfx.gparms.borderColor = "red";
            this.gfx.gparms.color = "blue";
            this.gfx.gparms.fillColor = "green";
        }
        draw() {
            this.playfield.gfx.circle(this.x, this.y, this.w);
        }
    }
    exports.CircleTestTile = CircleTestTile;
});
define("Test/PlayfieldTest", ["require", "exports", "Playfield/index", "Test/CircleTestTile", "Test/BoxTestTile", "Playfield/Utils/index", "Playfield/Shapes/index", "Jed/index", "Browser/index"], function (require, exports, Playfield_5, CircleTestTile_1, BoxTestTile_2, Utils_16, Shapes_1, Jed_1, Browser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldTest = void 0;
    let resultLabel = null;
    let slider = null;
    let hslider = null;
    let vslider = null;
    function updateCursor(rx, ry, pfEvent) {
        hslider.cursorSize(rx, 18);
        vslider.cursorSize(0, ry);
        slider.text = `(${(0, Utils_16.int)(slider.rx * 100)},${(0, Utils_16.int)(slider.ry * 100)})`;
        hslider.text = `${(0, Utils_16.int)(hslider.rx * 100)}`;
    }
    function showValue(rx, ry, pfEvent) {
        resultLabel.value = this.name + ": " + (0, Utils_16.int)(rx * 100);
        hslider.text = `${(0, Utils_16.int)(hslider.rx * 100)}`;
    }
    function printGo() {
        resultLabel.value = "Result Label: " + this.name;
    }
    function printValue() {
        this.parent.label = this.parent.value;
    }
    class PlayfieldTest {
        constructor() {
            this._playfieldApp = new Browser_1.BrowserPlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
        }
        boxTest() {
            this._playfield.gfx.rect(10, 10, 100, 100);
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
            lcircle.gfx.gparms.fillColor = "red";
            rcircle.gfx.gparms.fillColor = "red";
            let llcircle = new CircleTestTile_1.CircleTestTile("left", lcircle, -50, 50, 50, 50);
            let lrcircle = new CircleTestTile_1.CircleTestTile("right", lcircle, +50, 50, 50, 50);
            llcircle.gfx.gparms.fillColor = "blue";
            lrcircle.gfx.gparms.fillColor = "blue";
            let rlcircle = new CircleTestTile_1.CircleTestTile("left", rcircle, -50, 50, 50, 50);
            let rrcircle = new CircleTestTile_1.CircleTestTile("right", rcircle, +50, 50, 50, 50);
            rlcircle.gfx.gparms.fillColor = "green";
            rrcircle.gfx.gparms.fillColor = "green";
            this._playfield.start();
        }
        tenthousandTestTile() {
            let parent = this._playfield.tile;
            let max = 100;
            for (let i = 0; i < max; i++) {
                for (let j = 0; j < 1000; j++) {
                    let x = (0, Utils_16.random)(0, this._playfield.w);
                    let y = (0, Utils_16.random)(0, this._playfield.h);
                    let r = (0, Utils_16.random)(10, 50);
                    let DX = (0, Utils_16.random)(-10, 10);
                    let DY = (0, Utils_16.random)(-10, 10);
                    let circle = new BoxTestTile_2.BoxTestTile("circle", parent, x, y, r, r);
                    // circle.gfx.gparms.fillColor = null;
                    circle.DX = DX;
                    circle.DY = DY;
                }
            }
            max *= 1000;
            // let fps = 1;
            // let delay = Math.floor(1000/fps);
            let delay = 0;
            let fps = 1000 / delay;
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
            // for (let i=0; i<10; i++) {
            //     for(let j=0; j<1000; j++) {
            //         let boxTile = new BoxTile("box", parent, random(0,1000), random(0,1000), 50, 50);
            //     }
            // }
            let boxTile = new Shapes_1.BoxTile("box", parent, (0, Utils_16.random)(0, 1000), (0, Utils_16.random)(0, 1000), 50, 50);
            let circleTile = new Shapes_1.CircleTile("circle", parent, 50, 50, 50, 50);
            let boxTile2 = new Shapes_1.BoxTile("box", parent, 200, 200, 50, 50);
            let fps = 16;
            this._playfield.start(Math.floor(1 / fps * 1000));
        }
        jedTest() {
            let x = 10;
            let y = 10;
            let dy = 25;
            let root = this._playfield.tile;
            let vsplit = new Playfield_5.VSplit("vsplit", root, 0.5);
            let veast = vsplit.east;
            let vwest = vsplit.west;
            let hsplit = new Playfield_5.HSplit("hsplit", veast, 0.5);
            let north = hsplit.north;
            let south = hsplit.south;
            let zsplit = new Playfield_5.HSplit("hsplit", vwest, 0.5);
            let east = zsplit.north;
            let west = zsplit.south;
            // north
            let textItem1 = new Jed_1.TextItem("textitem-1", north, x, y += dy, 250, 14, "Hello World 1");
            resultLabel = new Jed_1.LabelItem("ResultLabel", north, x, y += dy, 200, 14, "Result Label");
            // south
            y = 10;
            let buttonItem1 = new Jed_1.ButtonItem("ButtonItem1", south, x, y += dy, 100, 0);
            buttonItem1.label = "Hello World";
            buttonItem1.value = "Greg Smith";
            let buttonItem2 = new Jed_1.ButtonItem("ButtonItem2", south, x, y += dy, 100, 0, "Button Item 2");
            let buttonItem3 = new Jed_1.ButtonItem("ButtonItem3", south, x, y += dy, 100, 0, "Button Item 3");
            buttonItem1.go = printGo.bind(buttonItem1);
            buttonItem2.go = printGo.bind(buttonItem2);
            buttonItem3.go = printGo.bind(buttonItem3);
            // east
            let buttonGroup = new Jed_1.GroupItem("ButtonGroup", east, 10, 10, 0, 0, "Radio Buttons");
            x = 0;
            y = 0;
            let radioItem1 = new Jed_1.RadioItem("RadioItem", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
            let radioItem2 = new Jed_1.RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
            let radioItem3 = new Jed_1.RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
            radioItem1.go = printValue.bind(radioItem1);
            radioItem2.go = printValue.bind(radioItem2);
            radioItem3.go = printValue.bind(radioItem3);
            // west
            let buttonGroup2 = new Jed_1.GroupItem("ButtonGroup2", west, 10, 10, 0, 0, "CheckBoxes");
            x = 10;
            y = 0;
            let checkbox1 = new Jed_1.CheckboxItem("CheckboxItem1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
            let checkbox2 = new Jed_1.CheckboxItem("CheckboxItem2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
            let checkbox3 = new Jed_1.CheckboxItem("CheckboxItem3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
            checkbox1.go = printValue.bind(checkbox1);
            checkbox2.go = printValue.bind(checkbox2);
            checkbox3.go = printValue.bind(checkbox3);
            slider = new Playfield_5.Slider("xxx", north, 30, 20, 200, 200);
            slider.onChange = updateCursor.bind(slider);
            hslider = new Playfield_5.Slider("hslider", north, 20, north.h - 20, north.w - 20 - 1, 20);
            hslider.vslide = false;
            hslider.onChange = showValue.bind(hslider);
            vslider = new Playfield_5.Slider("vslider", north, 1, 1, 20, north.h - 20 - 1);
            vslider.hslide = false;
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
    // main.shapeTest();
    main.jedTest();
});
 