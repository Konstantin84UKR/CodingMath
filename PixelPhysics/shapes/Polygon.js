import { DrawUtils } from "../utils/DrawUtils.js";
import { Vector2 } from "../Vector2.js";
import { Shape } from "./Shape.js";
import { MathHelper } from "../MathHelper.js";

export class Polygon extends Shape{
    constructor(ctx,vertices,color){
        super(ctx,vertices);
        this.color = color;
        this.normals = [];
        this.calculateNormals();
        let centroid = MathHelper.calcCentroid(vertices);
        this._centroid = centroid;
    }

    calculateNormals(){

        this.normals = [];

        for (let i = 0; i < this.vertices.length-1; i++) {
          let direction = Vector2.Sub(this.vertices[i+1], this.vertices[i]);
          let normal = direction.GetNormal();
          normal.Normalize();
          this.normals.push(normal);            
        }

        let direction = Vector2.Sub(this.vertices[0], this.vertices[this.vertices.length-1]);
        let normal = direction.GetNormal();
        normal.Normalize();
        this.normals.push(normal);
    }

    rotate(radiansDelta){
        super.rotate(radiansDelta);
        this.calculateNormals();
    }

    draw(){
        super.draw();
        
        const normalHelperlength = 25;

        for(let i=0; i < this.vertices.length-1;i++){
            let direction = Vector2.Sub(this.vertices[i+1], this.vertices[i]);
            let start = Vector2.Add(this.vertices[i], Vector2.Scale(direction, 0.5));
            let end = Vector2.Add(start, Vector2.Scale(this.normals[i],normalHelperlength));
            DrawUtils.drawLine(this.ctx,start, end, "orange");
        }

        let direction = Vector2.Sub(this.vertices[0], this.vertices[this.vertices.length-1]);
        let start = Vector2.Add(this.vertices[this.vertices.length-1], Vector2.Scale(direction, 0.5));
        let end = Vector2.Add(start, Vector2.Scale(this.normals[this.vertices.length-1],normalHelperlength));
        DrawUtils.drawLine(this.ctx,start, end, "orange");

        DrawUtils.drawPoint(this.ctx,this.centroid, 5 , this.color);

    }
}