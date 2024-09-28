import { Vector2 } from "../Vector2.js";
import { DrawUtils } from '../DrawUtils.js'

export class Shape{
    constructor(ctx,vertices){
        this.vertices = vertices;
        this.color = 'green';
        this.ctx = ctx;


        if(new.target === Shape){
            throw new TypeError("ХЗ");
        }
    }

    isPointInside(position){
        let isInside = false;
        for (let i = 0; i < this.vertices.length; i++) {
            let vertex = this.vertices[i];
            let normal  = this.normals[i];

            let vertToPoint = Vector2.Sub(position, vertex );
            let dot = vertToPoint.Dot(normal);

            if(dot > 0) return false;
            else isInside = true;            
        }

        return isInside;
    }

    getDirectionOut(pos){

        let bestNormal = null;
        let smallest = -Number.MAX_VALUE;

        for (let i = 0; i < this.vertices.length; i++) {
           let vertex = this.vertices[i];  
           let normal  = this.normals[i];

           let vertToPoint = Vector2.Sub(pos, vertex);
           let dot = vertToPoint.Dot(normal);

           if(dot >= 0){
                return null
           }else if(dot > smallest){
                smallest = dot;
                bestNormal = normal.Copy();
           }
        }
        
        if(!bestNormal){
            return null;
        }

        return Vector2.Scale(bestNormal, smallest * -1);

    }
 

    moveBy(delta){
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vector2.Add(this.vertices[i], delta);
        }
    }

    draw(){
        for (let i = 1; i < this.vertices.length; i++) {
            DrawUtils.drawLine(this.ctx,this.vertices[i-1], this.vertices[i], this.color, 1);
        }
        DrawUtils.drawLine(this.ctx,this.vertices[this.vertices.length-1], this.vertices[0], this.color, 1);
    }

}