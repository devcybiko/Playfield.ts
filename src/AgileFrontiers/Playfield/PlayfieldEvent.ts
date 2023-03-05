export class PlayfieldEvent {
     event: any;
    //  type: string;

     // mouse events
     x: number;
     y: number;
     isMove: boolean;
     isPress: boolean;
     isRelease: boolean;
     isMenu: boolean;
     isMenuRelease: boolean;

     // keyboard events
     key: string;
     isKeyDown: boolean;
     isKeyUp: boolean;
     isShift: boolean;
     isControl: boolean;
     isAlt: boolean;
     isOption: boolean;
     isMeta: boolean;
     isCommand: boolean;
    //  button: string;

    // gestures
     swipe: number;
     isSwipeLeft: boolean;
     isSwipeRight: boolean;

    constructor(event: any) {
        this.event = event;
        // this.type = event.type;

        // mouse events
        this.x = event.offsetX;
        this.y = event.offsetY;
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
        // if (event.button === 0) this.button = "select";
        // if (event.button === 1) this.button = "middle";
        // if (event.button === 2) this.button = "menu";

        // gestures
        this.swipe = event.wheelDelta;
        this.isSwipeLeft = event.wheelDelta < 0;
        this.isSwipeRight = event.wheelDelta > 0;
    }
}