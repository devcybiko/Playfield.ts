import { TileOptions } from "../Playfield";

export class ItemOptions extends TileOptions {
    fontSize = 16;
    fontFace = "sans-serif";
    fontStyle = "";
    backgroundColor = "";
    foregroundColor = "black";
    containerColor = "gray";
    textColor = "black";
    borderColor = "black";
    selectColor = "red";
    hoverColor = "#c88";
    textAlign = "left" as CanvasTextAlign;
    textBaseline = "top" as CanvasTextBaseline;
    borderRadius = 0;
}