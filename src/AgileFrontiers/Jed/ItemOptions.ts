import { TileOptions } from "../Playfield";

export class ItemOptions extends TileOptions {
    fontSize = 24;
    fontFace = "sans-serif";
    fontStyle = "";
    textColor = "black";
    borderColor = "black";
    fillColor = "white";
    selectColor = "red";
    hoverColor = "#c88";
    textAlign = "left" as CanvasTextAlign;
    textBaseline = "top" as CanvasTextBaseline;
    borderRadius = 0;
}