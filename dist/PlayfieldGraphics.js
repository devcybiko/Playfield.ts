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
define("Playfield/Utils/RectMixin", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/TreeMixin", ["require", "exports"], function (require, exports) {
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
define("Playfield/Utils/index", ["require", "exports", "Playfield/Utils/Mixins", "Playfield/Utils/Functions", "Playfield/Utils/RectMixin", "Playfield/Utils/TreeMixin", "Playfield/Utils/LoggerMixin"], function (require, exports, Mixins_1, Functions_1, RectMixin_1, TreeMixin_1, LoggerMixin_1) {
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
define("Playfield/Graphics/GfxParms", ["require", "exports"], function (require, exports) {
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
define("Playfield/Graphics/Gfx", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Browser/GfxBrowser", ["require", "exports", "Playfield/Graphics/GfxParms"], function (require, exports, GfxParms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxBrowser = void 0;
    class GfxBrowser {
        constructor(canvasId) {
            this._canvas = document.querySelector(canvasId); // canvasId
            this._ctx = this._canvas.getContext("2d");
            this._gparms = new GfxParms_1.GfxParms();
            this._ctx.fontKerning = "none";
            this._ctx.letterSpacing = "1px";
            this._ctx.textRendering = "geometricPrecision";
        }
        get width() {
            return this._canvas.width;
        }
        get height() {
            return this._canvas.height;
        }
        get canvas() {
            return this._canvas;
        }
        rect(x, y, w, h, _gparms = this._gparms) {
            if (_gparms.fillColor) {
                this._ctx.fillStyle = _gparms.fillColor;
                this._ctx.fillRect(_gparms.dx + x, _gparms.dy + y, w, h);
            }
            if (_gparms.borderColor) {
                this._ctx.strokeStyle = _gparms.borderColor;
                this._ctx.strokeRect(_gparms.dx + x, _gparms.dy + y, w, h);
            }
        }
        ellipse(x, y, w, h, _gparms = this._gparms) {
            if (_gparms.fillColor) {
                this._ctx.beginPath();
                this._ctx.ellipse(_gparms.dx + x + w / 2, _gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this._ctx.fillStyle = _gparms.fillColor;
                this._ctx.fill();
            }
            if (_gparms.borderColor) {
                this._ctx.beginPath();
                this._ctx.ellipse(_gparms.dx + x + w / 2, _gparms.dy + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
                this._ctx.strokeStyle = _gparms.borderColor;
                this._ctx.stroke();
            }
        }
        circle(x, y, r, _gparms = this._gparms) {
            this.ellipse(x - r, y - r, r * 2, r * 2, _gparms);
        }
        line(x0, y0, x1, y1, _gparms0 = this._gparms, _gparms1 = _gparms0) {
            this._ctx.beginPath();
            this._ctx.strokeStyle = _gparms0.borderColor;
            this._ctx.moveTo(_gparms0.dx + x0, _gparms0.dy + y0);
            this._ctx.lineTo(_gparms1.dx + x1, _gparms1.dy + y1);
            this._ctx.stroke();
        }
        text(msg, x = 0, y = 0, _gparms = this._gparms, w) {
            this._ctx.fillStyle = _gparms.color;
            this._ctx.font = _gparms.font;
            this._ctx.textAlign = _gparms.textAlign;
            this._ctx.textBaseline = _gparms.textBaseline;
            this._ctx.fillText(msg, _gparms.dx + x, _gparms.dy + y, w);
        }
        textRect(msg, x = 0, y = 0, w, h, _gparms = this._gparms) {
            this._ctx.font = _gparms.font;
            let boundingBox = this.boundingBox(msg, _gparms);
            if (!w)
                w = boundingBox.w;
            if (!h)
                h = boundingBox.h;
            this.rect(x, y, w, h, _gparms);
            this.text(msg, x, y, _gparms, w);
        }
        boundingBox(msg, _gparms = this._gparms) {
            this._ctx.font = _gparms.font;
            let boundingBox = this._ctx.measureText(msg);
            return { w: Math.floor(boundingBox.width + 0.5), h: _gparms.fontSize };
        }
        clipRect(x = 0, y = 0, w = this._ctx.canvas.width, h = this._ctx.canvas.height, _gparms = this._gparms) {
            this.save();
            let region = new Path2D();
            region.rect(x + _gparms.dx, y + _gparms.dy, w, h);
            this._ctx.clip(region);
        }
        save() {
            this._ctx.save();
        }
        restore() {
            this._ctx.restore();
        }
    }
    exports.GfxBrowser = GfxBrowser;
});
define("Playfield/Graphics/index", ["require", "exports", "Browser/GfxBrowser", "Playfield/Graphics/GfxParms"], function (require, exports, GfxBrowser_1, GfxParms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GfxParms = exports.GfxBrowser = void 0;
    Object.defineProperty(exports, "GfxBrowser", { enumerable: true, get: function () { return GfxBrowser_1.GfxBrowser; } });
    Object.defineProperty(exports, "GfxParms", { enumerable: true, get: function () { return GfxParms_2.GfxParms; } });
});
define("Playfield/PlayfieldEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEvent = void 0;
    class PlayfieldEvent {
        constructor(event) {
            this.event = event;
            this.type = event.type;
            this.key = event.key;
            this.isShift = event.shiftKey;
            this.isControl = event.ctrlKey;
            this.isAlt = event.altKey;
            this.isOption = event.altKey;
            this.isMeta = event.metaKey;
            this.isCommand = event.metaKey;
            this.x = event.offsetX;
            this.y = event.offsetY;
            if (event.button === 0)
                this.button = "select";
            if (event.button === 1)
                this.button = "middle";
            if (event.button === 2)
                this.button = "menu";
            this.wheelDelta = event.wheelDelta;
        }
    }
    exports.PlayfieldEvent = PlayfieldEvent;
});
define("Playfield/Tile", ["require", "exports", "Playfield/Utils/index", "Playfield/Graphics/index"], function (require, exports, Utils_1, Graphics_1) {
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
            this.Logger();
            this._gparms = new Graphics_1.GfxParms();
            this._playfield = playfield;
            this._tabOrder = this.parent ? this.parent.children.indexOf(this) : 0;
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
        onTick() {
            this.children.forEach(child => child.onTick());
            return true;
        }
        onEvent(pfEvent) {
            this.children.forEach(child => child.onEvent(pfEvent));
            return true;
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
            this.isDraggable = true;
            return this;
        }
        onGrab(pfEvent) {
            return false;
        }
        onDrag(dx, dy, pfEvent) {
            let that = this;
            if (that.rmove)
                that.rmove(dx, dy);
            return true;
        }
        onDrop(pfEvent) {
            return false;
        }
        // --- Accessors --- //
        get isDraggable() {
            return this._isDraggable;
        }
        set isDraggable(value) {
            this._isDraggable = value;
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
            this._logger = this;
            return this;
        }
        dragEvent(pfEvent, child) {
            if (pfEvent.type === "mousemove")
                return this._dragChild(pfEvent, child);
            else if (pfEvent.type === "mousedown")
                return this._grabChild(pfEvent, child);
            else if (pfEvent.type === "mouseup")
                return this._dropChild(pfEvent, child);
        }
        _dragChild(pfEvent, child) {
            if (this._dragObj) {
                this._dragObj.onDrag(pfEvent.x - this._dragX, pfEvent.y - this._dragY, pfEvent);
                this._dragX = pfEvent.x;
                this._dragY = pfEvent.y;
                return true;
            }
            return false;
        }
        _grabChild(pfEvent, child) {
            let tileChild = child;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                this._dropChild(pfEvent, child);
                this._dragObj = child;
                this._dragX = pfEvent.x;
                this._dragY = pfEvent.y;
                child.onGrab(pfEvent);
                return true;
            }
            return false;
        }
        _dropChild(pfEvent, child) {
            if (this._dragObj) {
                this._dragObj.onDrop(pfEvent);
                this._dragObj = null;
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
            this._isSelected = false;
            this._isSelectable = true;
            return this;
        }
        onSelect() {
            return false;
        }
        onUnselect() {
            return false;
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
        selectEvent(pfEvent, child) {
            let treeChild = child;
            if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
                if (pfEvent.type === "mousedown" && this._selectedObj != child)
                    this._selectChild(pfEvent, child);
            }
        }
        _selectChild(pfEvent, child) {
            this._unselectChild(pfEvent, child);
            this._selectedObj = child;
            child.isSelected = true;
            child.onSelect();
            return true;
        }
        _unselectChild(pfEvent, child) {
            if (this._selectedObj) {
                this._selectedObj.isSelected = false;
                this._selectedObj.onUnselect();
                this._selectedObj = null;
                return true;
            }
            return false;
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
        onPress(pfEvent) {
            return true;
        }
        onRelease(pfEvent) {
            return true;
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
        pressEvent(pfEvent, child) {
            let treeChild = child;
            if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
                if (pfEvent.type === "mousedown") {
                    child.isPressed = true;
                    child.onPress(pfEvent);
                }
            }
            if (pfEvent.type === "mouseup" && child.isPressed) {
                child.isPressed = false;
                child.onPress(pfEvent);
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
            return this;
        }
        onClick(pfEvent) {
            return false;
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
        clickEvent(pfEvent, child) {
            if (pfEvent.type === "mousedown") {
                let tileChild = child;
                if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                    child.onClick(pfEvent);
                }
            }
            return true;
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
        onHovering(pfEvent) {
            return false;
        }
        onEnter(pfEvent) {
            return false;
        }
        onExit(pfEvent) {
            return false;
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
        hoverEvent(pfEvent, child) {
            let treeChild = child;
            if (pfEvent.type === "mousemove") {
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
                return true;
            }
            return false;
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
        onKey(key, pfEvent) {
            return true;
        }
        onArrowLeft(pfEvent) {
            return true;
        }
        onArrowRight(pfEvent) {
            return true;
        }
        onBackspace(pfEvent) {
            return true;
        }
        onBackSpace(pfEvent) {
            // this is the wrong method
            // you should be using onBackspace(), above
            // this is purposely mispelled with upper-case "S"
            // to force a compile-time error
            // if you attempt to override it.
            return true;
        }
        onFocus() {
            return true;
        }
        onUnfocus() {
            return true;
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
        editorEvent(pfEvent, child) {
            if (pfEvent.type === "mousedown")
                return this._focusChild(pfEvent, child);
            else if (pfEvent.type === "keydown")
                return this._dispatchKey(pfEvent, child);
        }
        _focusChild(pfEvent, child) {
            let tileChild = child;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                this._unfocusChild(pfEvent, child);
                this._focusObj = child;
                child.isFocus = true;
                child.onFocus();
                return true;
            }
        }
        _unfocusChild(pfEvent, child) {
            if (this._focusObj) {
                this._focusObj.isFocus = false;
                this._focusObj.onUnfocus();
                this._focusObj = null;
                return true;
            }
            return false;
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
                return true;
            }
            return false;
        }
        _nextChild(direction, pfEvent) {
            if (!this._focusObj)
                return true;
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
            return false;
        }
        // -- Accessors --- //
        get focusObj() {
            return this._focusObj;
        }
    }
    exports.Editor = Editor;
});
define("Playfield/Abilities/RepeatableMixin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeatable = void 0;
    class Repeatable {
        Repeatable(delay) {
            this.isRepeatable = true;
            this._delay = delay;
            return this;
        }
        startRepeat(delay) {
            if (delay !== undefined)
                this._delay = delay;
            this.stopRepeat();
            this._timerId = setInterval(this.onRepeat.bind(this), this._delay, this);
        }
        stopRepeat() {
            if (this._timerId)
                clearInterval(this._timerId);
            this._timerId = null;
        }
        onRepeat() {
            return false;
        }
        // --- Accessors --- //
        get isRepeatable() {
            return this._isRepeatable;
        }
        set isRepeatable(value) {
            this._isRepeatable = value;
        }
        get delay() {
            return this._delay;
        }
        set delay(value) {
            this._delay = value;
        }
    }
    exports.Repeatable = Repeatable;
});
define("Playfield/Abilities/index", ["require", "exports", "Playfield/Abilities/DraggerMixin", "Playfield/Abilities/DraggableMixin", "Playfield/Abilities/SelectableMixin", "Playfield/Abilities/SelecterMixin", "Playfield/Abilities/PresserMixin", "Playfield/Abilities/PressableMixin", "Playfield/Abilities/ClickerMixin", "Playfield/Abilities/ClickableMixin", "Playfield/Abilities/HovererMixin", "Playfield/Abilities/HoverableMixin", "Playfield/Abilities/EditableMixin", "Playfield/Abilities/EditorMixin", "Playfield/Abilities/RepeatableMixin"], function (require, exports, DraggerMixin_1, DraggableMixin_1, SelectableMixin_1, SelecterMixin_1, PresserMixin_1, PressableMixin_1, ClickerMixin_1, ClickableMixin_1, HovererMixin_1, HoverableMixin_1, EditableMixin_1, EditorMixin_1, RepeatableMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeatable = exports.Editor = exports.Editable = exports.Hoverable = exports.Hoverer = exports.Clickable = exports.Clicker = exports.Pressable = exports.Presser = exports.Selecter = exports.Selectable = exports.Draggable = exports.Dragger = void 0;
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
    Object.defineProperty(exports, "Repeatable", { enumerable: true, get: function () { return RepeatableMixin_1.Repeatable; } });
});
define("Playfield/RootTile", ["require", "exports", "Playfield/Tile", "Playfield/Abilities/index", "Playfield/Utils/index"], function (require, exports, Tile_1, Abilities_1, Utils_2) {
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
    (0, Utils_2.applyMixins)(_RootTile, [Abilities_1.Clicker, Abilities_1.Selecter, Abilities_1.Presser, Abilities_1.Dragger, Utils_2.Logger, Abilities_1.Editor, Abilities_1.Hoverer]);
    class RootTile extends _RootTile {
        constructor(x, y, w, h, playfield) {
            super("_root", null, x, y, w, h, playfield);
            this.Dragger();
            this.Selecter();
            this.Logger();
        }
        draw() {
            this.redrawChildren();
        }
        onEvent(pfEvent) {
            let children = this.children.reverse();
            for (let _child of children) {
                let child = _child;
                if (child.isHoverable)
                    this.hoverEvent(pfEvent, child);
                if (child.isDraggable)
                    this.dragEvent(pfEvent, child);
                if (child.isSelectable)
                    this.selectEvent(pfEvent, child);
                if (child.isClickable)
                    this.clickEvent(pfEvent, child);
                if (child.isPressable)
                    this.pressEvent(pfEvent, child);
                if (child.isFocusable)
                    this.editorEvent(pfEvent, child);
                child.onEvent(pfEvent);
            }
            return true;
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
        getEvent() {
            return this._eventQueue.shift();
        }
        pushEvent(pfEvent) {
            this._eventQueue.push(pfEvent);
        }
    }
    exports.EventQueue = EventQueue;
});
define("Playfield/Playfield", ["require", "exports", "Playfield/Utils/index", "Playfield/Graphics/index", "Playfield/RootTile"], function (require, exports, Utils_3, Graphics_2, RootTile_1) {
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
            this._delay = 0;
            this._timerId = 0;
            this._gfx = gfx;
            this._eventQueue = eventQueue;
            this._gparms = new Graphics_2.GfxParms();
            this.Rect(0, 0, this._gfx.width, this._gfx.height);
            this._rootTile = new RootTile_1.RootTile(0, 0, this.w, this.h, this);
        }
        clear() {
            this.gfx.rect(0, 0, this._gfx.width, this._gfx.height, this.gparms);
        }
        redraw() {
            this.clear();
            this.tile.redraw();
        }
        tick() {
            clearTimeout(this._timerId);
            let now = Date.now();
            let extra = now - this._lastTime;
            this.handleEvents();
            this.tile.onTick(); // process all ticks
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
        handleEvents() {
            let that = this;
            function next() {
                return that._eventQueue.getEvent();
            }
            for (let pfEvent = next(); pfEvent; pfEvent = next()) {
                this._rootTile.onEvent(pfEvent);
            }
        }
        // --- Accessors --- //
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
    }
    exports.Playfield = Playfield;
});
define("Playfield/index", ["require", "exports", "Playfield/Playfield", "Playfield/Tile", "Playfield/EventQueue", "Playfield/PlayfieldEvent"], function (require, exports, Playfield_1, Tile_2, EventQueue_1, PlayfieldEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEvent = exports.EventQueue = exports.Tile = exports.Playfield = void 0;
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_2.Tile; } });
    Object.defineProperty(exports, "EventQueue", { enumerable: true, get: function () { return EventQueue_1.EventQueue; } });
    Object.defineProperty(exports, "PlayfieldEvent", { enumerable: true, get: function () { return PlayfieldEvent_1.PlayfieldEvent; } });
});
define("Browser/CanvasEventPump", ["require", "exports", "Playfield/Utils/index", "Playfield/index"], function (require, exports, Utils_4, Playfield_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CanvasEventPump = void 0;
    class CanvasEventPump {
        constructor(canvas, eventQueue) {
            this._logger = new Utils_4.Logger();
            this._eventQueue = eventQueue;
            this._registerEventHandlers(canvas);
        }
        _registerEventHandlers(canvas) {
            canvas.addEventListener('mousedown', this._handler.bind(this));
            canvas.addEventListener('mousemove', this._handler.bind(this));
            canvas.addEventListener('mouseup', this._handler.bind(this));
            canvas.addEventListener('wheel', this._handler.bind(this));
            addEventListener("keydown", this._handler.bind(this));
            addEventListener("keyup", this._handler.bind(this));
        }
        _handler(event) {
            let pfEvent = new Playfield_2.PlayfieldEvent(event);
            this._eventQueue.pushEvent(pfEvent);
        }
    }
    exports.CanvasEventPump = CanvasEventPump;
});
define("Browser/PlayfieldApp", ["require", "exports", "Playfield/Graphics/index", "Playfield/index", "Browser/CanvasEventPump"], function (require, exports, Graphics_3, Playfield_3, CanvasEventPump_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldApp = void 0;
    class PlayfieldApp {
        constructor(canvasId = "#playfield") {
            this._gfx = new Graphics_3.GfxBrowser(canvasId);
            this._eventQueue = new Playfield_3.EventQueue();
            this._canvasEventPump = new CanvasEventPump_1.CanvasEventPump(this._gfx.canvas, this._eventQueue);
            this._playfield = new Playfield_3.Playfield(this._gfx, this._eventQueue);
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
    exports.PlayfieldApp = PlayfieldApp;
});
define("Browser/index", ["require", "exports", "Browser/CanvasEventPump"], function (require, exports, CanvasEventPump_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CanvasEventPump = void 0;
    Object.defineProperty(exports, "CanvasEventPump", { enumerable: true, get: function () { return CanvasEventPump_2.CanvasEventPump; } });
});
define("Jed/ItemOptions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemOptions = void 0;
    class ItemOptions {
        constructor() {
            this.fontSize = 24;
            this.fontFace = "sans-serif";
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
define("Jed/Item", ["require", "exports", "Playfield/index", "Playfield/Utils/index", "Playfield/Abilities/index", "Jed/ItemOptions"], function (require, exports, Playfield_4, Utils_5, Abilities_2, ItemOptions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = exports._Item = void 0;
    class _Item extends Playfield_4.Tile {
    }
    exports._Item = _Item;
    ;
    ;
    (0, Utils_5.applyMixins)(_Item, [Abilities_2.Draggable, Abilities_2.Selectable]);
    class Item extends _Item {
        constructor(name, parent, x, y, w, h, value = "", text = "") {
            super(name, parent, x, y, w, h);
            this.Draggable();
            this.Selectable();
            this._value = value;
            this._options = new ItemOptions_1.ItemOptions;
            this._options.text = text || value;
            this._options.fontSize = h;
        }
        _updateGparms() {
            this.gparms.fillColor = this.options.fillColor;
            this.gparms.color = this.options.textColor;
            this.gparms.borderColor = this.options.borderColor;
            this.gparms.fontSize = this.options.fontSize;
            this.gparms.fontFace = this.options.fontFace;
            this.gparms.textAlign = this.options.textAlign;
            this.gparms.textBaseline = this.options.textBaseline;
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
define("Jed/ButtonItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_1, Utils_6, Abilities_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonItem = exports._ButtonItem = void 0;
    class _ButtonItem extends Item_1.Item {
    }
    exports._ButtonItem = _ButtonItem;
    ;
    ;
    (0, Utils_6.applyMixins)(_ButtonItem, [Abilities_3.Draggable, Abilities_3.Pressable, Abilities_3.Hoverable]);
    class ButtonItem extends _ButtonItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value);
            this._label = "";
            this.Draggable();
            this.Pressable();
            this.Hoverable();
            this.Logger();
            this.isDraggable = false;
            this._label = label || value;
        }
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
        draw() {
            let gfx = this._playfield.gfx;
            this._updateGparms();
            if (this.isHovering && this.isPressed)
                this.gparms.fillColor = this.options.selectColor;
            else if (this.isHovering && !this.isPressed)
                this.gparms.fillColor = this.options.hoverColor;
            else
                this.gparms.fillColor = this.options.fillColor;
            gfx.clipRect(this.x, this.y, this.w, this.h);
            gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
            gfx.restore();
        }
        onRelease() {
            if (this.isHovering)
                this.go();
            return true;
        }
        go() {
            window.alert(this.value);
            return true;
        }
    }
    exports.ButtonItem = ButtonItem;
});
define("Jed/LabelItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_2, Utils_7, Abilities_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelItem = exports._LabelItem = void 0;
    class _LabelItem extends Item_2.Item {
    }
    exports._LabelItem = _LabelItem;
    ;
    ;
    (0, Utils_7.applyMixins)(_LabelItem, [Abilities_4.Draggable]);
    class LabelItem extends _LabelItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value);
            this.Draggable();
            this.Logger();
            this.options.fontSize = h;
            this._updateGparms();
            this._label = label;
        }
        draw() {
            let gfx = this._playfield.gfx;
            this._updateGparms();
            let w = this.w;
            let h = this.h;
            let x = this.x;
            let y = this.y;
            if (w < 0) {
                this.gparms.textAlign = "right";
                w = -w;
                x -= w;
            }
            gfx.clipRect(x, y, w, h, this.gparms);
            // gfx.rect(x, y, w, h);
            gfx.text(this._label, this.x, y, this.gparms, w);
            gfx.restore();
        }
    }
    exports.LabelItem = LabelItem;
});
define("Jed/TextItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_3, Utils_8, Abilities_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextItem = exports._TextItem = void 0;
    class _TextItem extends Item_3.Item {
    }
    exports._TextItem = _TextItem;
    ;
    ;
    (0, Utils_8.applyMixins)(_TextItem, [Abilities_5.Draggable, Abilities_5.Editable, Abilities_5.Repeatable]);
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
            this.Repeatable(this._cursorBlinkRate);
            this.options.fontFace = "monospace";
            this.options.fontSize = h;
            this._updateGparms();
            this._nchars = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w);
            this._nchars2 = Math.ceil(this.w / this._playfield.gfx.boundingBox("m", this.gparms).w / 2);
            this._left = 0;
            this._right = this.computeRight();
        }
        _startCursorBlinking() {
            this._cursorOn = true;
            this.startRepeat(this._cursorBlinkRate);
        }
        _stopCursorBlinking() {
            this._cursorOn = false;
            this.stopRepeat();
        }
        onRepeat() {
            this.blink();
            return true;
        }
        blink() {
            this._cursorOn = !this._cursorOn;
        }
        drawCursor() {
            if (!this.isFocus)
                return;
            if (!this._cursorOn)
                return;
            let gfx = this._playfield.gfx;
            let valueBB = gfx.boundingBox(this.value.substring(this._left, this._cursor), this.gparms);
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
            let gfx = this._playfield.gfx;
            this._updateGparms();
            if (this.isFocus)
                this.gparms.color = this.options.selectColor;
            else
                this.gparms.color = this.options.textColor;
            gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
            let value = this.value.substring(this._left);
            if (this.isFocus)
                value = value.replaceAll(" ", '\uA788'); // \u00B7
            gfx.textRect(value, this.x, this.y, this.w, this.h, this.gparms);
            this.drawCursor();
            gfx.restore();
        }
        computeRight() {
            // let gfx = this._playfield.gfx;
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
        computeLeft() {
            // let gfx = this._playfield.gfx;
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
        cursorInc(delta) {
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
        onArrowLeft() {
            this.cursorInc(-1);
            return true;
        }
        onArrowRight() {
            this.cursorInc(+1);
            return true;
        }
        onBackspace() {
            if (this._cursor > 0) {
                let c = this._cursor;
                let left = this.value.substring(0, c - 1);
                let right = this.value.substring(c);
                this.value = left + right;
                this.cursorInc(-1);
                this.log(left, right, this._cursor, this.value);
                return true;
            }
            return false;
        }
        onKey(key) {
            let c = this._cursor;
            this.value = this.value.substring(0, c) + key + this.value.substring(c);
            this.cursorInc(+1);
            return true;
        }
        onFocus() {
            super.onFocus();
            this.toFront();
            this._startCursorBlinking();
            return true;
        }
        onUnfocus() {
            this._stopCursorBlinking();
            return true;
        }
    }
    exports.TextItem = TextItem;
});
define("Jed/ToggleItem", ["require", "exports", "Jed/Item", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, Item_4, Utils_9, Abilities_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToggleItem = exports._ToggleItem = void 0;
    class _ToggleItem extends Item_4.Item {
    }
    exports._ToggleItem = _ToggleItem;
    ;
    ;
    (0, Utils_9.applyMixins)(_ToggleItem, [Abilities_6.Draggable, Abilities_6.Clickable, Abilities_6.Hoverable]);
    class ToggleItem extends _ToggleItem {
        constructor(name, parent, x, y, w, h, value = "", label = "") {
            super(name, parent, x, y, w, h, value);
            this._label = "";
            this._isOn = false;
            this.Draggable();
            this.Clickable();
            this.Logger();
            this.isDraggable = false;
            this._label = label || value;
        }
        get label() {
            return this._label;
        }
        set label(value) {
            this._label = value;
        }
        get isOn() {
            return this._isOn;
        }
        set isOn(value) {
            this._isOn = value;
        }
        get value() {
            if (this.isOn)
                return super.value;
            else
                return "";
        }
        set value(s) {
            super.value = s;
        }
        draw() {
            let gfx = this._playfield.gfx;
            this._updateGparms();
            if (this.isOn)
                this.gparms.fillColor = this.options.selectColor;
            else if (this.isHovering)
                this.gparms.fillColor = this.options.hoverColor;
            else
                this.gparms.fillColor = "white";
            gfx.clipRect(this.x, this.y, this.w, this.h);
            gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
            gfx.restore();
        }
        onClick() {
            this.isOn = !this.isOn;
            this.go();
            return true;
        }
        go() {
            window.alert(this.value);
            return true;
        }
    }
    exports.ToggleItem = ToggleItem;
});
define("Jed/index", ["require", "exports", "Jed/TextItem", "Jed/ButtonItem", "Jed/ToggleItem", "Jed/LabelItem"], function (require, exports, TextItem_1, ButtonItem_1, ToggleItem_1, LabelItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelItem = exports.ToggleItem = exports.ButtonItem = exports.TextItem = void 0;
    Object.defineProperty(exports, "TextItem", { enumerable: true, get: function () { return TextItem_1.TextItem; } });
    Object.defineProperty(exports, "ButtonItem", { enumerable: true, get: function () { return ButtonItem_1.ButtonItem; } });
    Object.defineProperty(exports, "ToggleItem", { enumerable: true, get: function () { return ToggleItem_1.ToggleItem; } });
    Object.defineProperty(exports, "LabelItem", { enumerable: true, get: function () { return LabelItem_1.LabelItem; } });
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
define("Playfield/Shapes/BoxTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Utils/index", "Playfield/Abilities/index"], function (require, exports, ShapeTile_1, Utils_10, Abilities_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTile = exports._BoxTile = void 0;
    class _BoxTile extends ShapeTile_1.ShapeTile {
    }
    exports._BoxTile = _BoxTile;
    ;
    ;
    (0, Utils_10.applyMixins)(_BoxTile, [Abilities_7.Draggable, Abilities_7.Selectable]);
    class BoxTile extends _BoxTile {
        constructor(name, parent, x, y, w, h) {
            super(name, parent, x, y, w, h);
            this._colors = ["red", "orange", "green", "blue", "indigo", "violet"];
            this._color = 0;
            this.Draggable();
            this.Selectable();
            this.gparms.fillColor = this._colors[2];
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
            // if (this.isSelected) this.gparms.borderColor = "black";
            // else this.gparms.borderColor = "";
            // this.gparms.fillColor = this._colors[this._color];
            this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
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
define("Playfield/Shapes/CircleTile", ["require", "exports", "Playfield/Shapes/ShapeTile", "Playfield/Abilities/index", "Playfield/Utils/index"], function (require, exports, ShapeTile_2, Abilities_8, Utils_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleTile = exports._CircleTile = void 0;
    class _CircleTile extends ShapeTile_2.ShapeTile {
    }
    exports._CircleTile = _CircleTile;
    ;
    ;
    (0, Utils_11.applyMixins)(_CircleTile, [Abilities_8.Draggable, Abilities_8.Selectable]);
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
            if (this.isSelected)
                this.gparms.borderColor = "black";
            else
                this.gparms.borderColor = "";
            this.gparms.fillColor = "gray";
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
define("Test/BoxTestTile", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxTestTile = void 0;
    class BoxTestTile extends Playfield_5.Tile {
        constructor(name, parent, x, y, w, h = w) {
            super(name, parent, x, y, w, h);
            this.gparms.borderColor = "red";
            this.gparms.color = "blue";
            this.gparms.fillColor = "green";
        }
        draw() {
            this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        }
        onTick() {
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
define("Test/PlayfieldTest", ["require", "exports", "Test/CircleTestTile", "Test/BoxTestTile", "Playfield/Utils/index", "Playfield/Shapes/index", "Jed/index", "Browser/PlayfieldApp"], function (require, exports, CircleTestTile_1, BoxTestTile_2, Utils_12, Shapes_1, Jed_1, PlayfieldApp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldTest = void 0;
    class PlayfieldTest {
        constructor() {
            this._playfieldApp = new PlayfieldApp_1.PlayfieldApp();
            this._playfield = this._playfieldApp.playfield;
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
                    let x = (0, Utils_12.random)(0, this._playfield.w);
                    let y = (0, Utils_12.random)(0, this._playfield.h);
                    let r = (0, Utils_12.random)(10, 50);
                    let DX = (0, Utils_12.random)(-10, 10);
                    let DY = (0, Utils_12.random)(-10, 10);
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
            let boxTile = new Shapes_1.BoxTile("box", parent, (0, Utils_12.random)(0, 1000), (0, Utils_12.random)(0, 1000), 50, 50);
            let circleTile = new Shapes_1.CircleTile("circle", parent, 50, 50, 50, 50);
            let boxTile2 = new Shapes_1.BoxTile("box", parent, 200, 200, 50, 50);
            let fps = 16;
            this._playfield.start(Math.floor(1 / fps * 1000));
        }
        jedTest() {
            let x = 110;
            let y = 10;
            let parent = this._playfield.tile;
            let textItem1 = new Jed_1.TextItem("textitem-1", parent, x, y, 250, 14, "Hello World 1");
            let lablItem1 = new Jed_1.LabelItem("Label-1", parent, x - 10, y, -100, 14, "Label-1", "Label-1");
            let textItem2 = new Jed_1.TextItem("textitem-2", parent, x, y += 50, 100, 14, "Hello World 2");
            let lablItem2 = new Jed_1.LabelItem("Label-2", parent, x - 100, y, 100, 14, "Label-2", "Label-2");
            let textItem3 = new Jed_1.TextItem("textitem-3", parent, x, y += 50, 100, 14, "Hello World 3");
            let textItem4 = new Jed_1.TextItem("textitem-4", parent, x, y += 50, 100, 14, "Hello World 4 ");
            let buttonItem1 = new Jed_1.ButtonItem("ButtonItem", parent, x, y += 50, 45, 14);
            buttonItem1.label = "Hello World";
            buttonItem1.value = "Greg Smith";
            let toggleItem = new Jed_1.ToggleItem("ToggleItem", parent, x, y += 50, 45, 14);
            toggleItem.label = "goodbye friends";
            toggleItem.value = "gerg htims";
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
 