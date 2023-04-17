export interface PlayfieldEvent {

    get event(): any;
    set event(value: any);

    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get isMove(): boolean;
    set isMove(value: boolean);
    get isPress(): boolean;
    set isPress(value: boolean);
    get isRelease(): boolean;
    set isRelease(value: boolean);
    get isMenu(): boolean;
    set isMenu(value: boolean);
    get isMenuRelease(): boolean;
    set isMenuRelease(value: boolean);
    get isMouseEvent(): boolean;
    set isMouseEvent(value: boolean);

    get key(): string;
    set key(value: string);
    get isKeyDown(): boolean;
    set isKeyDown(value: boolean);
    get isKeyUp(): boolean;
    set isKeyUp(value: boolean);
    get isShift(): boolean;
    set isShift(value: boolean);
    get isControl(): boolean;
    set isControl(value: boolean);
    get isAlt(): boolean;
    set isAlt(value: boolean);
    get isOption(): boolean;
    set isOption(value: boolean);
    get isMeta(): boolean;
    set isMeta(value: boolean);
    get isCommand(): boolean;
    set isCommand(value: boolean);
    get isKeyboardEvent(): boolean;
    set isKeyboardEvent(value: boolean);

    get swipeX(): number;
    set swipeX(value: number);
    get isSwipeLeft(): boolean;
    set isSwipeLeft(value: boolean);
    get isSwipeRight(): boolean;
    set isSwipeRight(value: boolean);
    get swipeY(): number;
    set swipeY(value: number);
    get isSwipeUp(): boolean;
    set isSwipeUp(value: boolean);
    get isSwipeDown(): boolean;
    set isSwipeDown(value: boolean);
    get isSwipe(): boolean;
    set isSwipe(value: boolean);

    get isActive(): boolean;
    set isActive(value: boolean);
    get counter(): number;
    set counter(n: number);
    get touchedBy(): string[];
    set touchedBy(value: string[]);
    get type(): string;
    set type(value: string);

}