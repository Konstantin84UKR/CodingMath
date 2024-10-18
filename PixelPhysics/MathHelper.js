import { Vector2 } from "./Vector2.js";

export class MathHelper{
    
    static calcCentroid(vertices){
        let A = this.calcArea(vertices);
        let length = vertices.length;
        let Cx = 0;
        let Cy = 0;

        for (let i = 0; i < length; i++) {
           let i_next = this.Index(i+1,length);
           Cx += (vertices[i].x + vertices[i_next].x) * 
           (vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y)
        }

        Cx/=(6*A);

        for (let i = 0; i < length; i++) {
            let i_next = this.Index(i+1,length);
            Cy += (vertices[i].y + vertices[i_next].y) * 
            (vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y)
         }
 
         Cy/=(6*A);


         return new Vector2(Cx,Cy);
    }

    static calcArea(vertices){
        let A = 0;
        let length = vertices.length;

        for (let i = 0; i < length; i++) {
           let i_next = this.Index(i+1,length);

           A += vertices[i].x * vertices[i_next].y - vertices[i_next].x * vertices[i].y;
        }

        return A/2;
    }

    static Index(idx, arraySize){
        return (idx + arraySize)%arraySize;
    }
}