function foo(obj) {
    console.log(JSON.stringify(obj.form.getReport(), null, 2));
}

function bar(obj) {
    console.log(JSON.stringify(obj.form.getJSON(), null, 2));
}

function slider(obj) {
    console.log(obj.rx, obj.ry);
}

function log(obj) {
    console.log(obj.name, obj.value);
}

let formStrings = [
    "Text|  Text 01|    Text 01|    10| 50| 50| 20| Text 01||log(obj)",
    "Label| Label 01|   Label 01|   10| 10| 50| 20| Label 01||log(obj)",
    "Label| Label 02|   Label 02|   10| 30| 50| 20| Label 02||log(obj)",
    "Button| Button 03| Button 03|   10| 80| 50| 20| Button 03||foo(obj)",
    "Group| !Group 07|   Group 07|   10|200| 50| 20| Group 07||log(obj)",
    "Menu| !Menu 08|   Menu 08|   10|230| 50| 20| Menu 08||log(obj)",
    "MenuItem|!MenuItem 01|   MenuItem 01|   10|10| 50| 20| xxx|Menu 08|log(obj)",
    "MenuItem| !MenuItem 02|   MenuItem 02|   10|20| 50| 20| yyy|Menu 08|log(obj)",
    "Checkbox| Checkbox 04|   Checkbox 04|   10|10| 50| 20| Checkbox 04| Group 07|log(obj)",
    "Checkbox| Checkbox 05|   Checkbox 05|   10|40| 50| 20| Checkbox 04| Group 07|log(obj)",
    "Radio| Radio 05|   Radio 05|   10|70| 50| 20| Radio 05| Group 07|log(obj)",
    "Radio| Radio 06|   Radio 06|   10|110| 50| 20| Radio 05| Group 07|log(obj)",
    "Slider| Slider 02|   Slider 02|   100|50| 100| 75| horizontal||slider(obj)",
    "Slider| Slider 02|   Slider 02|   100|150| 100| 75| vertical||slider(obj)",
]

let formObjects = [
    {
        type: "Label",
        name: "Label xx",
        value: "Label xx",
        x: 100,
        y: 10,
        w: 50,
        h: 20,
        go: "log(obj)"
    }
]
