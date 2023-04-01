export class Tree {
    protected _name: string;
    protected _fullName: string;
    protected _parent: Tree;
    protected _children: Tree[];

    Tree(name: string, parent?: Tree) {
        this._name = name;
        this._children = [];
        if (parent) parent.addChild(this);
        this.setName();
        return this;
    }

    setName(andTheRest = false): string {
        this._fullName =  this._parent ? this._parent._fullName + "." + this.name : this.name;
        if (andTheRest) {
            for(let child of this._children) {
                child.setName(andTheRest)
            }
        }
        return this._fullName;
    }

    // --- Public Methods --- //

    addChild(child: Tree): void {
        child._parent = this;
        this._children.push(child);
        child._fullName = child.setName();
    }

    root(): Tree {
        let result = (this as unknown as Tree);
        while (result._parent) {
            result = result._parent;
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
            this._parent.removeChild(this);
        }
        this._fullName = this.setName();
        return obj;
    }

    toFront(obj?: Tree) {
        if (obj) {
            this.removeChild(obj);
            this._children.push(obj);
        } else {
            this._parent.toFront(this);
        }
    }

    toBack(obj?: Tree) {
        if (obj) {
            this.removeChild(obj);
            this._children.splice(0, 0, obj);
        } else {
            this._parent.toBack(this);
        }
    }

    depth(): number {
        // GLS - this is not very performant. use with care (mainly for debugging)
        if (this._parent) return this._parent.depth() + 1;
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
    set name(s : string) {
        this._name = s;
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
