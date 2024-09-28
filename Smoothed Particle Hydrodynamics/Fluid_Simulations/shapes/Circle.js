import { DrawUtils } from "../DrawUtils.js";
import { Vector2 } from "../Vector2.js";
import { Shape } from "./Shape.js";

export class Circle extends Shape{
    constructor(ctx ,position, radius, color){
        super(ctx,[]);
        this.color = color; 
        this.position = position;
        this.radius = radius;               
    }

    isPointInside(pos){
        let distanse = Vector2.Sub(pos, this.position).Length();
        return distanse < this.radius;
    }

    getDirectionOut(pos){
        let direction = Vector2.Sub(pos, this.position);
        if(direction.Length2() < this.radius * this.radius){
            let penetration = this.radius - direction.Length();
            direction.Normalize();
            direction = Vector2.Scale(direction , penetration);
            return direction;
        }else{
            return null;
        }

    }

    moveBy(delta){
        this.position = Vector2.Add(this.position, delta);
    }

    draw(){
        DrawUtils.strokePoint(this.ctx, this.position, this.radius, this.color, 1);
    }
}