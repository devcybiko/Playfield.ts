import { Playfield, PlayfieldEvent, Tile, Splitter, Files, File } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import * as Jed from "../Jed";
import { int, random } from "../Utils";
import { BoxTile } from "../Playfield/Shapes";
import { BrowserFiles, BrowserFile } from "../Browser";
/**
 * Jed Test with treeItem
 */

let _browserFiles = new BrowserFiles();

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;
    _files: Files;
    _file: File;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp("#playfield", 1.0);
        this._playfield = this._playfieldApp.playfield;
    }
    async loadFileTree(): Promise<File> {
        this._files = _browserFiles;
        this._file = this._files.load("directory", "/static/data/tree.json");
        let file = await this._file.wait();
        return file;
    }
    async showFilename(pfEvent: PlayfieldEvent) {
        function fullPathName(treeItem: Jed.TreeItem) {
            let s = treeItem.data.name;
            for (let parent = treeItem.parent as any; parent && parent.data; parent = parent.parent as any) {
                s = `${parent.data.name}/${s}`;
            }
            return s;
        }
        pfEvent.isActive = false;
        let thisTreeItem = this as unknown as Jed.TreeItem;
        let fname = fullPathName(thisTreeItem);
        let file = _browserFiles.load("file", fname);
        file = await file.wait();
        console.log("loaded File")
        console.log(file.string);
        _browserFiles.save(fname, file.string);
    }
    mkdir(node: Jed.TreeItem, dirs: any[]) {
        for (let dir of dirs) {
            if (dir.type === "directory") {
                let item = node.addNode(dir.name, dir);
                item.onClick = this.showFilename.bind(item);
                this.mkdir(item, dir.contents);
            } else if (dir.type === "file") {
                let item = node.addNode(dir.name, dir);
                item.onClick = this.showFilename.bind(item);
            } else {
                console.log("ignoring", dir);
            }
        }
    }
    threeTreeItems(node: Jed.TreeItem, aa: string, bb: string, cc: string) {
        let a = node.addNode(aa, aa);
        let b = node.addNode(bb, bb);
        let c = node.addNode(cc, cc);
        return [a, b, c];
    }
    simpleScenerio(tree: Jed.Tree) {
        let [a, b, c] = this.threeTreeItems(tree.treeRoot, "a", "b", "c");
        this.threeTreeItems(a, "aa", "ab", "ac");
        this.threeTreeItems(b, "ba", "bb", "bc");
        this.threeTreeItems(c, "ca", "cb", "cc");
    }
    async treeItemTest() {
        let file = await this.loadFileTree();
        let dirs = file.json;
        let root = this._playfield.rootTile;
        let tree = new Jed.Tree("tree", root, 100, 100, 0, 0, "Tree Example");
        // this.simpleScenerio(tree);
        this.mkdir(tree.treeRoot, dirs);
        this._playfield.rootTile.printTree();
        this._playfield.start(1000 / 60);
    }
    run() {
        this.treeItemTest();
    }
}