import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
export class CollisionManifold{
    constructor(depth,normal,penetrationPoint){
        this.depth = depth;
        this.normal = normal;
        this.penetrationPoint = penetrationPoint;
    }

    resolveCollision(){
		
	}

    positionalCorrection(){
		
	}
	
    draw(ctx){
		let startPoint = Vector2.Add(this.penetrationPoint, Vector2.Scale(this.normal,this.depth*-1));
			
		DrawUtils.drawArrow(startPoint,this.penetrationPoint,"blue");
		DrawUtils.drawPoint(this.penetrationPoint,3,"gray");
	}


}