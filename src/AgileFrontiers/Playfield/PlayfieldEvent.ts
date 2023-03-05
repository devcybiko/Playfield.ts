export class PlayfieldEvent {
     event: any;
     type: string;
     key: string;
     x: number;
     y: number;
     isShift: boolean;
     isControl: boolean;
     isAlt: boolean;
     isOption: boolean;
     isMeta: boolean;
     isCommand: boolean;
     button: string;
     wheelDelta: number;

    constructor(event: any) {
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
        if (event.button === 0) this.button = "select";
        if (event.button === 1) this.button = "middle";
        if (event.button === 2) this.button = "menu";
        this.wheelDelta = event.wheelDelta;
    }
}