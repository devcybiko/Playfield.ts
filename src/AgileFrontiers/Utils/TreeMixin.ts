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

export type TreeMixin = Tree;
