class JedNode {
    public parent: JedNode;
    public name;
    public obj: Playfield | Actor
    public objs: JedNode[];

    constructor(parent: JedNode, name: string) {
        this.name = name;
        this.parent = parent;
        this.objs = [];
    }
}
