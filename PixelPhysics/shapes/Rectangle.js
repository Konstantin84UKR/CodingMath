import { Polygon } from "./Polygon.js"
import { Vector2 } from "../Vector2.js";

export class Rectangle extends Polygon{
    constructor(ctx,position, width, heigth, color){
        super(ctx,[
            new Vector2(position.x - width/2, position.y - heigth/2),
            new Vector2(position.x + width/2, position.y - heigth/2),
            new Vector2(position.x + width/2, position.y + heigth/2),
            new Vector2(position.x - width/2, position.y + heigth/2),
        ], color)

        this.position = position;
        this.width = width;
        this.heigth = heigth;
        this.color = color;
    }
}