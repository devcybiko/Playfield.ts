import { Tree, hasTree, Rect, hasRect, between } from "../Utils";
import { GfxParms } from "../Graphics";
import {Playfield, hasPlayfield} from "./Playfield";
/**
 * A Tile is a rectangular item on a Playfield.
 * It can draw itself on the Playfield
* It has its own set of GfxParms (font, colors, x/y offset)`       
 * it can move around
 * it is hierarcically organized so is drawn relative to its parent
 */

export interface hasTile {
    get tile(): Tile;
}

export class Tile implements hasTree, hasRect {
    _tree: Tree;
    _rect: Rect;
    _playfield: Playfield;
    _gparms: GfxParms;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, playfield = parent._playfield) {
        this._tree = new Tree(name, parent ? parent.tree : null, this);
        this._rect = new Rect(x, y, w, h);
        this._gparms = new GfxParms();
        this._playfield = playfield;
    }
    get rect(): Rect {
        return this._rect;
    }
    get tree(): Tree {
        return this._tree;
    }
    get gparms(): GfxParms {
        return this._gparms;
    }
    inBounds(x: number, y: number): Tile {
        let result =
            between(this.gparms.xOffset + this.rect.x, x, this.gparms.xOffset + this.rect.x + this.rect.w) &&
            between(this.gparms.yOffset + this.rect.y, y, this.gparms.yOffset + this.rect.y + this.rect.h);
        if (result) return this;
        for (let child of this.tree.children.reverse()) {
            let found = child.obj.inBounds(x, y);
            if (found) return found;
        }
        return null;
    }
    _recompute() {
        let parentTile = this.tree.parentObj as Tile;
        if (parentTile) {
            let parentGparms = parentTile.gparms;
            this.gparms.xOffset = parentTile.rect.x + parentGparms.xOffset;
            this.gparms.yOffset = parentTile.rect.y + parentGparms.yOffset;
        }
    }
    add(tile: Tile) {
        this.tree.add(tile.tree);
        tile._playfield = this._playfield;
    }
    move(x: number, y: number) {
        this.rect.x = x;
        this.rect.y = y;
    }
    rmove(dx: number, dy: number) {
        this.rect.x += dx;
        this.rect.y += dy;
    }
    size(w: number, h: number) {
        this.rect.w = w;
        this.rect.h = h;
    }
    rsize(dw: number, dh: number) {
        this.rect.w += dw;
        this.rect.h += dh;
    }
    drawAll(): void {
        this._recompute();
        this.draw();
        for (let child of this.tree.children) {
            child.obj.drawAll();
        }
    }
    draw() {
        throw new Error("Method not implemented.");
    }
    tick(): void {
        throw new Error("Method not implemented.");
    }
    go(): void {
        throw new Error("Method not implemented.");
    }
}
