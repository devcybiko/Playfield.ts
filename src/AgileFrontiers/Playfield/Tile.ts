import { Tree, hasTree, Rect, hasRect, between } from "../Utils";
import { Gfx, hasGfx, GfxParms, hasGfxParms } from "../Graphics";
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

export class Tile implements hasTree, hasRect, hasGfx, hasGfxParms {
    _tree: Tree;
    _rect: Rect;
    _playfield: Playfield;
    _gparms: GfxParms;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, playfield = parent._playfield) {
        this._tree = new Tree(name, this);
        this._rect = new Rect(x, y, w, h);
        this._gparms = new GfxParms();
        if (parent) parent.add(this);
        this._playfield = playfield;
    }
    get gfx(): Gfx {
        return this._playfield.gfx;
    }
    get gparms(): GfxParms {
        return this._gparms;
    }
    get name() {
        return this.tree.name;
    }
    get rect(): Rect {
        return this._rect;
    }
    get tree(): Tree {
        return this._tree;
    }
    get x(): number {
        return this.rect.x;
    }
    get y(): number {
        return this.rect.y;
    }
    get w(): number {
        return this.rect.w;
    }
    get h(): number {
        return this.rect.h;
    }
    get X(): number {
        return this.rect.x + this.gparms.dx;
    }
    get Y(): number {
        return this.rect.y + this.gparms.dy;
    }
    get children(): Array<Tile> {
        return this.tree.children.map(child => child.obj);
    }
    get parent(): Tile {
        return this.tree.parentObj;
    }
    add(child: Tile) {
        this.tree.add(child.tree);
        child._playfield = this._playfield;
    }
    inBounds(x: number, y: number): Tile {
        let result =
            between(this.X, x, this.Y + this.w) &&
            between(this.Y, y, this.Y + this.h);
        if (result) return this;
        for (let child of this.children.reverse()) {
            let found = child.inBounds(x, y);
            if (found) return found;
        }
        return null;
    }
    _recompute() {
        if (this.parent) {
            this.gparms.dx = this.parent.X;
            this.gparms.dy = this.parent.Y;
        }
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
        this.redraw();
        for (let child of this.tree.children) {
            child.obj.drawAll();
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
    tick(): void {
        this.tree.children.forEach(child => child.obj.tick());
    }
    go(): void {
        throw new Error("Method not implemented.");
    }
}
