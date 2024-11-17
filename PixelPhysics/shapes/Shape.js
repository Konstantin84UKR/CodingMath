import { MathHelper } from "../MathHelper.js";
import { Vector2 } from "../Vector2.js";
import { DrawUtils } from '../utils/DrawUtils.js'

export class Shape{
    constructor(ctx,vertices){
        this.vertices = vertices;
        this.color = 'green';
        this.ctx = ctx;
        this._centroid = null;


        if(new.target === Shape){
            throw new TypeError("ХЗ");
        }
    }

    // setCentroid(position){
    //     this.centroid = position;
    // }
    
    get centroid(){
       return this._centroid;     
    }
    
    set centroid(v){
        this._centroid = v;     
    }

    setColor(c){
        this.color = c;     
    }

    getNearestVector(position, affectDistance){
        
        let bestNormal = null;
        let smallest = Number.MAX_VALUE;
        for (let i = 0; i < this.normals.length; i++) {
            let vertex = this.vertices[i]; 
            let nextVertex = this.vertices[(i+1) % this.normals.length]; 
            let normal  = this.normals[i];


            let edge = Vector2.Sub(nextVertex, vertex);
            let edgeLength = edge.Length();
            edge.Normalize();
            let vertexToPartical = Vector2.Sub(position, vertex);
            let betweenVerticlesDot = vertexToPartical.Dot(edge);

            if(betweenVerticlesDot > 0 && betweenVerticlesDot < edgeLength){
                let disctanceFromEdge = vertexToPartical.Dot(normal);
                if(disctanceFromEdge < smallest && disctanceFromEdge > 0 
                    && disctanceFromEdge < affectDistance){
                    smallest = disctanceFromEdge;
                    bestNormal = normal.Copy();    
                }
            }

        }   

        if(bestNormal){
           return Vector2.Scale(bestNormal, smallest);  
        }else{
            return null;
        }

        //return null;
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
 

    move(delta){
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vector2.Add(this.vertices[i], delta);
        }

        this._centroid.Add(delta);
    }

    rotate(radiansDelta){
        for (let i = 0; i < this.vertices.length; i++) {
            let rotated = MathHelper.rotationAroundpoint(this.vertices[i], this._centroid, radiansDelta);
            this.vertices[i] = rotated;
        }
    }

    draw(){
        for (let i = 1; i < this.vertices.length; i++) {
            DrawUtils.drawLine(this.ctx,this.vertices[i-1], this.vertices[i], this.color, 1);
        }
        DrawUtils.drawLine(this.ctx,this.vertices[this.vertices.length-1], this.vertices[0], this.color, 1);
    }
   
}