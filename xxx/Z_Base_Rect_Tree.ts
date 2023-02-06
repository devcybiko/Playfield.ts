class Z {
    constructor() {
    }
}
const Z_Base_Rect_Tree = Tree(Rect(Base(Z)));

let z = new Z_Base_Rect_Tree();

z.name("Greg");
console.log(z);