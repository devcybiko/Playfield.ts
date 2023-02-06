import {Base} from "./Base";
import {Rect} from "./Rect";
import {Tree} from "./Tree";


class _BaseRectTree {
    constructor() {
    }
} 

export const BaseRectTree = Base(Rect(Tree(_BaseRectTree)));