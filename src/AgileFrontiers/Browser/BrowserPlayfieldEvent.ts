export class BrowserPlayfieldEvent {
    private _event: any;
    private _isActive: boolean;

    // mouse events
    private _x: number;
    private _y: number;
    private _isMove: boolean;
    private _isPress: boolean;
    private _isRelease: boolean;
    private _isMenu: boolean;
    private _isMenuRelease: boolean;
    private _isMouseEvent: boolean;

    // keyboard events
    private _key: string;
    private _isKeyDown: boolean;
    private _isKeyUp: boolean;
    private _isShift: boolean;
    private _isControl: boolean;
    private _isAlt: boolean;
    private _isOption: boolean;
    private _isMeta: boolean;
    private _isCommand: boolean;
    private _isKeyboardEvent: boolean;

    // gestures
    private _swipe: number;
    private _isSwipeRight: boolean;
    private _isSwipeLeft: boolean;

    constructor(event: any, ratio = 1.0) {
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
    get event(): any {
        return this._event;
    }
     set event(value: any) {
        this._event = value;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    public get isMove(): boolean {
        return this._isMove;
    }
    public set isMove(value: boolean) {
        this._isMove = value;
    }
    public get isPress(): boolean {
        return this._isPress;
    }
    public set isPress(value: boolean) {
        this._isPress = value;
    }
    public get isRelease(): boolean {
        return this._isRelease;
    }
    public set isRelease(value: boolean) {
        this._isRelease = value;
    }
    public get isMenu(): boolean {
        return this._isMenu;
    }
    public set isMenu(value: boolean) {
        this._isMenu = value;
    }
    public get isMenuRelease(): boolean {
        return this._isMenuRelease;
    }
    public set isMenuRelease(value: boolean) {
        this._isMenuRelease = value;
    }

    public get key(): string {
        return this._key;
    }
    public set key(value: string) {
        this._key = value;
    }
    public get isKeyDown(): boolean {
        return this._isKeyDown;
    }
    public set isKeyDown(value: boolean) {
        this._isKeyDown = value;
    }
    public get isKeyUp(): boolean {
        return this._isKeyUp;
    }
    public set isKeyUp(value: boolean) {
        this._isKeyUp = value;
    }
    public get isShift(): boolean {
        return this._isShift;
    }
    public set isShift(value: boolean) {
        this._isShift = value;
    }
    public get isControl(): boolean {
        return this._isControl;
    }
    public set isControl(value: boolean) {
        this._isControl = value;
    }
    public get isAlt(): boolean {
        return this._isAlt;
    }
    public set isAlt(value: boolean) {
        this._isAlt = value;
    }
    public get isOption(): boolean {
        return this._isOption;
    }
    public set isOption(value: boolean) {
        this._isOption = value;
    }
    public get isMeta(): boolean {
        return this._isMeta;
    }
    public set isMeta(value: boolean) {
        this._isMeta = value;
    }
    public get isCommand(): boolean {
        return this._isCommand;
    }
    public set isCommand(value: boolean) {
        this._isCommand = value;
    }
    public get swipe(): number {
        return this._swipe;
    }
    public set swipe(value: number) {
        this._swipe = value;
    }
    public get isSwipeLeft(): boolean {
        return this._isSwipeLeft;
    }
    public set isSwipeLeft(value: boolean) {
        this._isSwipeLeft = value;
    }
    public get isSwipeRight(): boolean {
        return this._isSwipeRight;
    }
    public set isSwipeRight(value: boolean) {
        this._isSwipeRight = value;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }
    public get isMouseEvent(): boolean {
        return this._isMouseEvent;
    }
    public set isMouseEvent(value: boolean) {
        this._isMouseEvent = value;
    }
    public get isKeyboardEvent(): boolean {
        return this._isKeyboardEvent;
    }
    public set isKeyboardEvent(value: boolean) {
        this._isKeyboardEvent = value;
    }

}