import { DrawUtils } from "../utils/DrawUtils.js";
import { Vector2 } from "../Vector2.js";
import { Shape } from "./Shape.js";

export class Circle extends Shape{
    constructor(ctx , position, radius, color){
        super(ctx,[new Vector2(position.x,position.y), new Vector2(position.x + radius, position.y)]);
        this.color = color; 
        this.position = position;
        this.radius = radius;   
        this.setCentroid(position);          
    }

    isPointInside(pos){
        let distanse = Vector2.Sub(pos, this.position).Length();
        return distanse < this.radius;
    }

    getNearestVector(position, affectDistance){
        let direction  = Vector2.Sub(position, this.position);
        let length = direction.Length();
        if(length < this.radius + affectDistance){
            direction.Normalize();
            direction = Vector2.Scale(direction, this.radius + affectDistance - length);
            return direction; 
        }else{
            return null
        }
      
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
        super.draw(this.ctx);
        DrawUtils.strokePoint(this.ctx, this.position, this.radius, this.color, 1);
        DrawUtils.drawPoint(this.ctx,this.centroid, 5 , "#ffffff");
    }
}