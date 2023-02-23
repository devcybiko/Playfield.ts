export interface hasTree {
    get tree(): Tree;
}

export class Tree {
    _name: string;
    _obj: any;
    _parent: Tree;
    _children = Array<Tree>();
    constructor(name: string, parent: Tree, obj: any) {
        this._name = name;
        this._obj = obj;
        if (parent) parent.add(this);
    }

    get parent(): Tree {
        return this._parent;
    }
    get parentObj(): any {
        if (this.parent) return this.parent.obj;
        return null;
    }
    get name(): string {
        return this._name;
    }
    get obj(): any {
        return this._obj;
    }
    get children(): Array<Tree> {
        // return a shallow copy
        return [...this._children];
    }
    add(child: Tree): void {
        child._parent = this;
        this._children.push(child);
    }
    dfs(visit: (obj: Tree, ctx: any) => any, ctx?: any): any {
        let stop = visit(this, ctx);
        if (stop) return stop;
        for (let child of this._children) {
            stop = child.dfs(visit, ctx);
            if (stop) return stop;
        }
        return null;
    }
    toFront(obj: Tree) {
        let i = this._children.indexOf(obj);
        if (i === -1) return;
        this._children.splice(i, 1);
        this._children.push(obj);
    }
    toBack(obj: Tree) {
        let i = this._children.indexOf(obj);
        if (i === -1) return;
        this._children.splice(i, 1);
        this._children.splice(0, 0, obj);
    }
}