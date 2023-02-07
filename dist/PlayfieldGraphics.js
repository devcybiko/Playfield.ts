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
        constructor(module, logLevel = "error") {
            this.level = "log";
            this.module = module;
            this.level = logLevel;
        }
        setLogLevel(level) {
            this.level = level;
        }
        info(...args) {
            // most verbose
            if (["info"].includes(this.level))
                console.log("INFO:", this.module + ": ", ...args);
        }
        log(...args) {
            // less verbose
            if (["info", "log"].includes(this.level))
                console.log("LOG:", this.module + ": ", ...args);
        }
        warn(...args) {
            // less verbose
            if (["info", "log", "warn"].includes(this.level))
                console.log("WARN:", this.module + ": ", ...args);
        }
        error(...args) {
            // always show errors
            console.error("ERROR:", this.module + ": ", ...args);
        }
    }
    exports.Logger = Logger;
});
define("Utils/index", ["require", "exports", "Utils/Logger"], function (require, exports, Logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.snapTo = exports.random = exports.between = exports.Logger = void 0;
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
    function between(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    exports.between = between;
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
define("Graphics/Gfx", ["require", "exports", "Graphics/GfxParms", "Utils/index"], function (require, exports, GfxParms_1, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Gfx = void 0;
    Utils = __importStar(Utils);
    class Gfx {
        constructor(ctx) {
            this.logger = new Utils.Logger("Gfx", "log");
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
define("Mixins/Constructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Mixins/Base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Base = void 0;
    function Base(_base) {
        return class extends _base {
            constructor() {
                super(...arguments);
                this._name = null;
            }
            Base(name) {
                this._name = name;
            }
            name(s) {
                if (s !== undefined)
                    this._name = s;
                return this._name;
            }
        };
    }
    exports.Base = Base;
});
define("Mixins/Tree", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
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
define("Mixins/Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = void 0;
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
            x(xx) {
                if (xx !== undefined)
                    this._x = xx;
                return this._x;
            }
            y(yy) {
                if (yy !== undefined)
                    this._y = yy;
                return this._y;
            }
            w(ww) {
                if (ww !== undefined)
                    this._w = ww;
                return this._w;
            }
            h(hh) {
                if (hh !== undefined)
                    this._h = hh;
                return this._h;
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
define("Mixins/BaseTreeRect", ["require", "exports", "Mixins/Base", "Mixins/Rect", "Mixins/Tree"], function (require, exports, Base_1, Rect_1, Tree_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseRectTree = void 0;
    class _BaseRectTree {
        constructor() {
        }
    }
    exports.BaseRectTree = (0, Base_1.Base)((0, Rect_1.Rect)((0, Tree_1.Tree)(_BaseRectTree)));
});
define("Mixins/index", ["require", "exports", "Mixins/Base", "Mixins/Tree", "Mixins/Rect", "Mixins/BaseTreeRect"], function (require, exports, Base_2, Tree_2, Rect_2, BaseTreeRect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseRectTree = exports.Rect = exports.Tree = exports.Base = void 0;
    Object.defineProperty(exports, "Base", { enumerable: true, get: function () { return Base_2.Base; } });
    Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return Tree_2.Tree; } });
    Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_2.Rect; } });
    Object.defineProperty(exports, "BaseRectTree", { enumerable: true, get: function () { return BaseTreeRect_1.BaseRectTree; } });
});
define("Playfield/Draggable", ["require", "exports", "Utils/index"], function (require, exports, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draggable = void 0;
    Utils = __importStar(Utils);
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
            this.origX = this.obj.x();
            this.origY = this.obj.y();
        }
        drop() {
        }
    }
    exports.Draggable = Draggable;
});
define("Playfield/PlayfieldEventHandler", ["require", "exports", "Utils/index", "Playfield/EventHandler"], function (require, exports, Utils, EventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEventHandler = void 0;
    Utils = __importStar(Utils);
    class PlayfieldEventHandler extends EventHandler_1.EventHandler {
        constructor(playfield, canvas) {
            super(playfield, canvas);
            this.SNAP = 10;
            this.logger = new Utils.Logger("PlayfieldEventHandler", "log");
            this._registerEventHandlers(playfield);
        }
        _registerEventHandlers(playfield) {
            playfield.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
            playfield.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
            playfield.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
            playfield.canvas.addEventListener('wheel', this.handleEvent.bind(this), false);
            document.addEventListener("keydown", this.handleEvent.bind(this));
        }
        handleKeyboardEvent(event) {
            if (this.playfield.focusedObj && this.playfield.focusedObj.eventHandler) {
                this.playfield.focusedObj.eventHandler.handleEvent(event);
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
            playfield.selectObj(obj);
            if (obj) {
                obj.click(event.offsetX, event.offsetY);
                playfield.grabObj(obj, event.offsetX, event.offsetY, !event.shiftKey);
            }
        }
    }
    exports.PlayfieldEventHandler = PlayfieldEventHandler;
});
define("Playfield/Playfield", ["require", "exports", "Utils/index", "Mixins/index", "Graphics/index", "Playfield/PlayfieldEventHandler"], function (require, exports, Utils, Mixins, Graphics_1, PlayfieldEventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Playfield = void 0;
    Utils = __importStar(Utils);
    Mixins = __importStar(Mixins);
    class Playfield extends Mixins.BaseRectTree {
        constructor(canvasId) {
            super();
            this.SNAP = 10;
            this.grabX = 0;
            this.grabY = 0;
            this.gparms = null;
            this.canvas = document.querySelector(canvasId);
            this.ctx = this.canvas.getContext("2d");
            this.Base("_playfield");
            this.Rect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
            this.Tree(null);
            this.logger = new Utils.Logger("Playfield", "info");
            this.gfx = new Graphics_1.Gfx(this.ctx);
            this.selectedObj = null; // mouse object
            this.focusedObj = null; // keyboard object
            this.eventHandler = new PlayfieldEventHandler_1.PlayfieldEventHandler(this, this.canvas);
            this._dragObj = null;
            this.body = document.querySelector('body');
            this.body.playfield = this;
            this.playfield = this;
        }
        selectObj(obj) {
            if (this.selectedObj)
                this.selectedObj.deselect();
            this.selectedObj = obj;
            if (obj !== null)
                obj.select();
        }
        focusObj(obj) {
            if (this.focusedObj)
                this.focusedObj.defocus();
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
            if (obj && obj.draggable) {
                this.dropObj();
                if (toFront)
                    this.toFront(obj);
                else
                    this.toBack(obj);
                this._dragObj = obj;
                this.grabX = x;
                this.grabY = y;
                obj.draggable.grab();
            }
        }
        dragObj(x, y) {
            if (this._dragObj) {
                let dx = x - this.grabX;
                let dy = y - this.grabY;
                this.logger.log(dx, dy);
                this._dragObj.draggable.drag(dx, dy);
            }
        }
        dropObj() {
            if (this._dragObj)
                this._dragObj.draggable.drop();
            this._dragObj = null;
        }
        recompute() {
            //for Actor compatibility
        }
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                return this.logger.error("ERROR: keydown not associated with a playfield");
            if (playfield.selectedObj)
                playfield.selectedObj.keydown(event.key);
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
                if (obj.inBounds(theObj.x(), theObj.y()) ||
                    obj.inBounds(theObj.x() + theObj.w(), theObj.y()) ||
                    obj.inBounds(theObj.x(), theObj.y() + theObj.h()) ||
                    obj.inBounds(theObj.x() + theObj.w(), theObj.y() + theObj.h()))
                    results.push(obj);
            }
            return results;
        }
    }
    exports.Playfield = Playfield;
});
define("Playfield/EventHandler", ["require", "exports", "Utils/index"], function (require, exports, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventHandler = void 0;
    Utils = __importStar(Utils);
    class EventHandler {
        constructor(playfield, obj) {
            this.playfield = playfield;
            this.obj = obj;
            this.logger = new Utils.Logger("EventHandler", "info");
        }
        handleEvent(event) {
            if (event.button !== undefined)
                return this.handleMouseEvent(event);
            else if (event.key !== undefined)
                return this.handleKeyboardEvent(event);
            else
                return this.handleUnknownEvent(event);
        }
        handleUnknownEvent(event) {
            this.logger.error("handleUnknownEvent:", event);
        }
        handleMouseEvent(event) {
            this.logger.info("handleMouseEvent:", event);
            let playfield = this.playfield;
            if (!playfield)
                return this.logger.error('ERROR: mousemove not associated with a playfield');
            if (event.type === "mousedown") {
                if (event.button === 0)
                    return this.MouseDown(event, playfield, this.obj);
                if (event.button === 1)
                    return this.MiddleDown(event, playfield, this.obj);
                if (event.button === 2)
                    return this.MenuDown(event, playfield, this.obj);
            }
            else if (event.type === "mouseup") {
                if (event.button === 0)
                    return this.MouseUp(event, playfield, this.obj);
                if (event.button === 1)
                    return this.MiddleUp(event, playfield, this.obj);
                if (event.button === 2)
                    return this.MenuUp(event, playfield, this.obj);
            }
            else if (event.type === "mousemove") {
                return this.MouseMove(event, playfield, this.obj);
            }
            else if (event.type === "wheel") {
                if (event.wheelDelta >= 0)
                    return this.WheelDown(event, playfield, this.obj, event.wheelDelta);
                if (event.wheelDelta < 0)
                    return this.WheelUp(event, playfield, this.obj, -event.wheelDelta);
            }
            else {
                return this.handleUnknownEvent(event);
            }
        }
        handleKeyboardEvent(event) {
            this.logger.log("handleKeyboardEvent:", event);
            let playfield = this.playfield;
            if (!playfield)
                return this.logger.error('ERROR: mousemove not associated with a playfield');
            let key = event.key;
            if (event.type === "keydown") {
                if (key.length > 1)
                    return this.SpecialKey(event, this.playfield, this.obj);
                else if (key.length === 1 && event.ctrlKey)
                    return this.ControlKey(event, this.playfield, this.obj);
                else if (key.length === 1 && event.metaKey)
                    return this.MetaKey(event, this.playfield, this.obj);
                else if (key.length === 1 && event.altKey)
                    return this.AltKey(event, this.playfield, this.obj);
                else if (key.length === 1)
                    return this.OrdinaryKey(event, this.playfield, this.obj);
                else
                    return this.defaultKey(event, this.playfield, this.obj);
            }
            else
                return this.defaultKey(event, this.playfield, this.obj);
        }
        MouseUp(event, playfield, obj) {
            this.logger.log("MouseUp:", event);
        }
        MouseDown(event, playfield, obj) {
            this.logger.log("MouseDown:", event);
        }
        MenuUp(event, playfield, obj) {
            this.logger.log("MenuUp:", event);
        }
        MenuDown(event, playfield, obj) {
            this.logger.log("MenuDown:", event);
        }
        MiddleUp(event, playfield, obj) {
            this.logger.log("MiddleUp:", event);
        }
        MiddleDown(event, playfield, obj) {
            this.logger.log("MiddleDown:", event);
        }
        WheelUp(event, playfield, obj, delta) {
            this.logger.log("WheelUp:", delta, event);
        }
        WheelDown(event, playfield, obj, delta) {
            this.logger.log("WheelDown:", delta, event);
        }
        MouseMove(event, playfield, obj) {
            this.logger.log("MouseMove:", event);
        }
        OrdinaryKey(event, playfield, obj) {
            this.logger.log("OrdinaryKey:", event);
            let key = event.key;
            if (Utils.between("A", key, "Z"))
                return this.UpperCase(event, this.playfield, this.obj);
            else if (Utils.between("a", key, "z"))
                return this.LowerCase(event, this.playfield, this.obj);
            else if (Utils.between("0", key, "9"))
                return this.Digit(event, this.playfield, this.obj);
            else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key))
                return this.Punctuation(event, this.playfield, this.obj);
            else
                return this.defaultKey(event, this.playfield, this.obj);
        }
        SpecialKey(event, playfield, obj) {
            this.logger.warn("SpecialKey:", event);
            let key = event.key;
            if (key === "ArrowUp")
                return this.ArrowUp(event, this.playfield, this.obj);
            else if (key === "ArrowDown")
                return this.ArrowDown(event, this.playfield, this.obj);
            else if (key === "ArrowLeft")
                return this.ArrowLeft(event, this.playfield, this.obj);
            else if (key === "ArrowRight")
                return this.ArrowRight(event, this.playfield, this.obj);
            else if (key === "ArrowLeft")
                return this.ArrowLeft(event, this.playfield, this.obj);
            else if (key === "Shift")
                return this.Shift(event, this.playfield, this.obj);
            else if (key === "Meta")
                return this.Meta(event, this.playfield, this.obj);
            else if (key === "Alt")
                return this.Alt(event, this.playfield, this.obj);
            else if (key === "Control")
                return this.Control(event, this.playfield, this.obj);
            else if (key === "Backspace")
                return this.Backspace(event, this.playfield, this.obj);
            else if (key[0] === "F")
                return this.FunctionKey(event, this.playfield, this.obj);
            else
                return this.defaultKey(event, this.playfield, this.obj);
        }
        Shift(event, playfield, obj) {
            this.logger.log("Shift:", event);
        }
        Meta(event, playfield, obj) {
            this.logger.log("Meta:", event);
        }
        MetaKey(event, playfield, obj) {
            this.logger.log("MetaKey:", event);
        }
        Alt(event, playfield, obj) {
            this.logger.log("Alt:", event);
        }
        AltKey(event, playfield, obj) {
            this.logger.log("AltKey:", event);
        }
        Control(event, playfield, obj) {
            this.logger.log("Control:", event);
        }
        ControlKey(event, playfield, obj) {
            this.logger.log("ControlKey:", event);
        }
        Backspace(event, playfield, obj) {
            this.logger.log("Backspace:", event);
        }
        UpperCase(event, playfield, obj) {
            this.logger.log("UpperCase:", event);
        }
        LowerCase(event, playfield, obj) {
            this.logger.log("LowerCase:", event);
        }
        Digit(event, playfield, obj) {
            this.logger.log("Digit:", event);
        }
        Punctuation(event, playfield, obj) {
            this.logger.log("Punctuation:", event);
        }
        FunctionKey(event, playfield, obj) {
            this.logger.log("FunctionKey:", event);
        }
        ArrowUp(event, playfield, obj) {
            this.logger.log("ArrowUp:", event);
        }
        ArrowDown(event, playfield, obj) {
            this.logger.log("ArrowDown:", event);
        }
        ArrowLeft(event, playfield, obj) {
            this.logger.log("ArrowLeft:", event);
        }
        ArrowRight(event, playfield, obj) {
            this.logger.log("ArrowRight:", event);
        }
        defaultKey(event, playfield, obj) {
            this.logger.log("unknown keypress:", event.key, event);
        }
    }
    exports.EventHandler = EventHandler;
});
define("Playfield/Actor", ["require", "exports", "Utils/index", "Mixins/index", "Graphics/index"], function (require, exports, Utils, Mixins, Graphics_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Actor = void 0;
    Utils = __importStar(Utils);
    Mixins = __importStar(Mixins);
    class Actor extends Mixins.BaseRectTree {
        constructor(parent, name, x, y, w, h) {
            super();
            this.gparms = new Graphics_2.GfxParms();
            this.Base(name);
            this.Rect(x, y, w, h);
            this.Tree(null);
            parent.add(this);
            this.playfield = parent.playfield;
            this.logger = new Utils.Logger("Actor", "warn");
            this.eventHandler = null;
        }
        X() {
            return this.x() + this.gparms.xOffset;
        }
        Y() {
            return this.y() + this.gparms.yOffset;
        }
        isSelected(selected) {
            if (selected !== undefined)
                this._isSelected = selected;
            return this._isSelected;
        }
        add(obj) {
            super.add(obj);
            obj.playfield = this.parent().playfield;
            obj.gfx = this.parent().gfx;
        }
        move(x, y, w = this.w(), h = this.h()) {
            this.x(x);
            this.y(y);
            this.w(w);
            this.h(h);
        }
        rmove(dx, dy, dw = 0, dh = 0) {
            this.x(this.x() + dx);
            this.y(this.y() + dy);
            this.w(this.w() + dw);
            this.h(this.h() + dh);
        }
        select() {
            this.isSelected(true);
        }
        deselect() {
            this.isSelected(false);
        }
        focus() {
            this.hasFocus = true;
        }
        defocus() {
            this.hasFocus = false;
        }
        inBounds(x, y) {
            let result = Utils.between(this.gparms.xOffset + this.x(), x, this.gparms.xOffset + this.x() + this.w()) &&
                Utils.between(this.gparms.yOffset + this.y(), y, this.gparms.yOffset + this.y() + this.h());
            if (result)
                return this;
            for (let i = this._children.length - 1; i >= 0; i--) {
                let obj = this._children[i];
                let found = obj.inBounds(x, y);
                if (found)
                    return this;
            }
            return null;
        }
        click(x, y) {
            this.logger.log("CLICK! " + this.name() + ": " + x + "," + y);
        }
        keydown(key) {
            if (key === "ArrowUp")
                this.y(this.y() - 10);
            if (key === "ArrowDown")
                this.y(this.y() + 10);
            if (key === "ArrowLeft")
                this.x(this.x() - 10);
            if (key === "ArrowRight")
                this.x(this.x() + 10);
        }
        go() {
        }
        recompute() {
            let parentGparms = this.parent().gparms;
            if (parentGparms) {
                this.gparms.xOffset = this.parent().x() + parentGparms.xOffset;
                this.gparms.yOffset = this.parent().y() + parentGparms.yOffset;
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
define("Playfield/index", ["require", "exports", "Playfield/Actor", "Playfield/Draggable", "Playfield/EventHandler", "Playfield/Playfield", "Playfield/PlayfieldEventHandler"], function (require, exports, Actor_1, Draggable_1, EventHandler_2, Playfield_1, PlayfieldEventHandler_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayfieldEventHandler = exports.Playfield = exports.EventHandler = exports.Draggable = exports.Actor = void 0;
    Object.defineProperty(exports, "Actor", { enumerable: true, get: function () { return Actor_1.Actor; } });
    Object.defineProperty(exports, "Draggable", { enumerable: true, get: function () { return Draggable_1.Draggable; } });
    Object.defineProperty(exports, "EventHandler", { enumerable: true, get: function () { return EventHandler_2.EventHandler; } });
    Object.defineProperty(exports, "Playfield", { enumerable: true, get: function () { return Playfield_1.Playfield; } });
    Object.defineProperty(exports, "PlayfieldEventHandler", { enumerable: true, get: function () { return PlayfieldEventHandler_2.PlayfieldEventHandler; } });
});
define("Jed/Item", ["require", "exports", "Playfield/index"], function (require, exports, Playfield_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = void 0;
    class Item extends Playfield_2.Actor {
        constructor(parent, name, value, x, y, w, h) {
            super(parent, name, x, y, w, h);
            this._value = value;
            this.draggable = new Playfield_2.Draggable(this);
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
                this.w(this.bb.w);
            if (!h)
                this.h(this.bb.h);
        }
        draw() {
            let gfx = this.playfield.gfx;
            // this.bb = gfx.boundingBox(this.value(), this.gparms);
            // this.w = this.bb.w;
            // this.h = this.bb.h;
            gfx.text(this.value(), this.x(), this.y(), this.gparms);
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
            this.draggable = new Playfield_3.Draggable(this);
        }
        draw() {
            super.draw();
            this.gfx.rect(this.x(), this.y(), this.w(), this.h(), this.gparms);
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
            super(parent, name, x, y, w, h, borderColor, fillColor);
            this.gparms.color = color;
        }
        draw() {
            super.draw();
            if (this.isSelected()) {
                this.gfx.line(this.x(), this.y(), this.x() + this.w(), this.y() + this.h(), this.gparms);
                this.gfx.line(this.x() + this.w(), this.y(), this.x(), this.y() + this.h(), this.gparms);
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
            this.values(values);
            this.xbox = new Shapes_1.XBox(this, name + "-checkbox", x, y, w, h, borderColor, fillColor, color);
        }
        click(x, y) {
            super.click(x, y);
            this.logger.log(this.value());
        }
        isChecked(checked) {
            return this.isSelected();
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
            this.labelItem = new LabelItem_1.LabelItem(this, name + "-label", label, 0, 0, ww, hh);
            this.xboxItem = new XBoxItem_1.XBoxItem(this, name + "-checkbox", values, this.labelItem.bb.w, 0, w, h, borderColor, fillColor, color);
            this.values(values);
        }
        isChecked(checked) {
            return this.xboxItem.isChecked();
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
            this.logger = new Utils.Logger("EditItemEventHandler", "info");
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
define("Jed/EditItem", ["require", "exports", "Utils/index", "Jed/Item", "Jed/EditItemEventHandler"], function (require, exports, Utils, Item_4, EditItemEventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditItem = void 0;
    Utils = __importStar(Utils);
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
            this.nchars = Math.ceil(this.w() / this.playfield.gfx.boundingBox("m", this.gparms).w);
            this.nchars2 = Math.ceil(this.w() / this.playfield.gfx.boundingBox("m", this.gparms).w / 2);
            this.left = 0;
            this.right = this.computeRight();
            this._setIntervalTimer();
            this.logger = new Utils.Logger("EditItem", "none");
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
            else if (dw >= this.w())
                dw = this.w() - 1;
            let x0 = this.x() + dw;
            if (x0 <= this.x())
                x0 = this.x() + 1;
            let x1 = x0;
            let y0 = this.y();
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
            gfx.clipRect(this.x(), this.y(), this.w(), this.h(), this.gparms);
            gfx.textRect(this.value().substring(this.left), this.x(), this.y(), this.w(), this.h(), this.gparms);
            this.drawCursor();
            gfx.restore();
        }
        computeRight() {
            // let gfx = this.playfield.gfx;
            // let right = this.left;
            // for(let i=this.left; i<=this._value.length; i++) {
            //     let bb = gfx.boundingBox(this._value.substring(this.left, i));
            //     right = i;
            //     if (bb.w > this.w()) break;
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
            //     if (bb.w > this.w()) break;
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
            this.logger.log(this.left, this.cursor, this.right, this.nchars, this.nchars2);
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
            this.editItem = new EditItem_1.EditItem(this, name + "-editor", value, this.labelItem.w() + 2, 0, w, h);
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
define(function (require) {
    console.log("Main.js...");
    var JedTest = require("Test/JedTest").JedTest;
    console.log(JedTest);
    let main = new JedTest();
 });
 