import {Constructor} from "./Constructor";

export function Tree<TBase extends Constructor>(_base: TBase) {
    return class extends _base {
        _parent = null as any;
        _children = Array<any>();

        Tree(parent: any) {
            this._parent = parent;
        }
        parent(): any {
            return this._parent;
        }
        add(obj: any): void {
            obj._parent = this;
            this._children.push(obj);
        }
        dfs(visit: (obj: any, ctx: any) => any, ctx?: any): any {
            let stop = visit(this, ctx);
            if (stop) return stop;
            for (let child of this._children) {
                stop = child.dfs(visit, ctx);
                if (stop) return stop;
            }
            return false;
        }
        toFront(obj: any) {
            let i = this._children.indexOf(obj);
            if (i === -1) return;
            this._children.splice(i, 1);
            this._children.push(obj);
        }
        toBack(obj: any) {
            let i = this._children.indexOf(obj);
            if (i === -1) return;
            this._children.splice(i, 1);
            this._children.splice(0, 0, obj);
        }    
    }
}