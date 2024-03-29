import { TileOptions } from "../Playfield";

export class ItemOptions extends TileOptions {
    fontSize = 10;
    fontFace = "sans-serif";
    fontStyle = "";
    override backgroundColor = "white";
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