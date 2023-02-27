import {applyMixins} from "../Utils";

export interface Draggable {
    grab(): boolean;
    drag(dx: number, dy:number): boolean;
    drop(): boolean;
}
