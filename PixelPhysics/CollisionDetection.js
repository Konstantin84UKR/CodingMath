import { Vector2 } from "./Vector2.js";

export class CollisionDetection{
   
    static circleVsCircle(shapeCircleA,shapeCircleB){
        const centroidA = shapeCircleA.centroid;
        const centroidB = shapeCircleB.centroid;

        const direction = Vector2.Sub(centroidB,centroidA);
        const circleRadiusA = shapeCircleA.radius;
        const circleRadiusB = shapeCircleB.radius;

        const dubleRadius = (circleRadiusB + circleRadiusA);

        if(direction.Length2() < dubleRadius*dubleRadius ){
            return true
        }else{
            return false
        }
    } 

}