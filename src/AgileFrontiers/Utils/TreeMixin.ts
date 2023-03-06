export class Tree {
    _name: string;
    _parent: Tree;
    _children: Tree[];

    Tree(name: string, parent?: Tree) {
        this._name = name;
        this._children = [];
        if (parent) parent.add(this);
    }

    get parent(): Tree {
        return this._parent;
    }
    get name(): string {
        return this._name;
    }
    get children(): Array<Tree> {
        // return a shallow copy
        return [...this._children];
    }
    add(child: Tree): void {
        child._parent = this;
        this._children.push(child);
    }
    removeChild(child: Tree): Tree {
        let i = this._children.indexOf(child);
        if (i === -1) return null;
        this._children.splice(i, 1);
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
    toFront(obj?: Tree) {
        if (obj) {
            this.removeChild(obj);
            this._children.push(obj);
        } else {
            this.parent.toFront(this);
        }
    }
    toBack(obj?: Tree) {
        if (obj) {
            this.removeChild(obj);
            this._children.splice(0, 0, obj);
        } else {
            this.parent.toBack(this);
        }
    }
}

export type TreeMixin = Tree;
