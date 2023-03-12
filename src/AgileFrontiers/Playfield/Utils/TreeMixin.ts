export class Tree {
    private _name: string;
    private _fullName: string;
    private _parent: Tree;
    private _children: Tree[];

    Tree(name: string, parent?: Tree) {
        this._name = name;
        this._children = [];
        if (parent) parent.addChild(this);
        this._fullName = this._getFullName();
    }

    _getFullName(): string {
        let parentFullName = this.parent ? this.parent._fullName + "." : "";
        return parentFullName + this.name;
    }

    // --- Public Methods --- //

    addChild(child: Tree): void {
        child._parent = this;
        this._children.push(child);
    }

    root(): Tree {
        let result = (this as unknown as Tree);
        while (result.parent) {
            result = result.parent;
        }
        return result;

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
            let i = this._children.indexOf(obj);
            if (i === -1) return;
            this._children.splice(i, 1);
            this._children.push(obj);
        } else {
            this.parent.toFront(this);
        }
    }

    toBack(obj?: Tree) {
        if (obj) {
            let i = this._children.indexOf(obj);
            if (i === -1) return;
            this._children.splice(i, 1);
            this._children.splice(0, 0, obj);
        } else {
            this.parent.toBack(this);
        }
    }

    // --- Accessors --- //

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
    get fullName(): string {
        return this._fullName;
    }

}

export type TreeMixin = Tree;
