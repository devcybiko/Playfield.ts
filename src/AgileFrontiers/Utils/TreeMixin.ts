export class Tree {
    protected _name: string;
    protected _fullName: string;
    protected _parent: Tree;
    protected _children: Tree[];

    Tree(name: string, parent?: Tree) {
        this._name = name;
        this._children = [];
        if (parent) parent.addChild(this);
        this._fullName = this._getFullName();
        return this;
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

    removeChild(obj?: Tree): Tree {
        if (obj) {
            let i = this._children.indexOf(obj);
            if (i === -1) return null;
            this._children.splice(i, 1);
            obj._parent = null;    
        } else {
            this.parent.removeChild(this);
        }
        return obj;
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

    depth(): number {
        if (this.parent) return this.parent.depth() + 1;
        return 0;
    }
    printMe() {
        console.log(" | ".repeat(this.depth()), this.name);
    }
    printTree() {
        this.printMe()
        for(let child of this.children) {
            child.printTree();
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
