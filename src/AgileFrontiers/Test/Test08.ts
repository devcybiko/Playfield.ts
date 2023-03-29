import { Playfield, PlayfieldEvent, Tile, Splitter, Files, File } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import * as Jed from "../Jed";
import { int, random } from "../Utils";
import { BoxTile } from "../Playfield/Shapes";
import {BrowserFiles, BrowserFile } from "../Browser";
/**
 * Jed Test with treeItem
 */

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;
    _files: Files;
    _file: File;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp("#playfield", 1.0);
        this._playfield = this._playfieldApp.playfield;
    }
    loadFileTree(fname: string) {
        this._files = new BrowserFiles();
        this._file = this._files.load("directory", "/static/data/tree.json");
    }
    treeItemTest() {
        let file = this._file.wait();
        console.log(file);
        let root = this._playfield.rootTile;
        let box = new BoxTile("box", root, 100,100,200,200);
        box.isSelected = true;
        let treeItem = new Jed.Tree("tree", root, 100, 100, 0, 0, "Tree Example");
        let a = treeItem.addNode(treeItem._root, "a");
        let aa = treeItem.addNode(a, "aa");
        let aaa = treeItem.addNode(aa, "aaa");
        let aab = treeItem.addNode(aa, "aab");
        let aac = treeItem.addNode(aa, "aac");
        let ab = treeItem.addNode(a, "ab");
        let ac = treeItem.addNode(a, "ac");
        let b = treeItem.addNode(treeItem._root, "b");
        let ba = treeItem.addNode(b, "ba");
        let bb = treeItem.addNode(b, "bb");
        let bc = treeItem.addNode(b, "bc");
        let c = treeItem.addNode(treeItem._root, "c");
        let ca = treeItem.addNode(c, "ca");
        let cb = treeItem.addNode(c, "cb");
        let cc = treeItem.addNode(c, "cc");
        this._playfield.rootTile.printTree();
        this._playfield.start();
    }
    run() {
        this.treeItemTest();
    }
}