import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
export class CollisionManifold{
    constructor(depth,normal,penetrationPoint){
        this.depth = depth;
        this.normal = normal;
        this.penetrationPoint = penetrationPoint;
        this.rigiA = null;
        this.rigiB = null;
    }

    resolveCollision(){

        if(this.rigiA.isKinematic && this.rigiB.isKinematic) return;

        let penetrationToCentroidA = Vector2.Sub(this.penetrationPoint, this.rigiA.shape.centroid);
        let penetrationToCentroidB = Vector2.Sub(this.penetrationPoint, this.rigiB.shape.centroid);

        let angularVelocityPenetrationCentroidA = new Vector2(-1 * this.rigiA.angularVelocity * penetrationToCentroidA.y, this.rigiA.angularVelocity * penetrationToCentroidA.x);
        let angularVelocityPenetrationCentroidB = new Vector2(-1 * this.rigiB.angularVelocity * penetrationToCentroidA.y, this.rigiB.angularVelocity * penetrationToCentroidB.x);

        let relativeVelocityA = Vector2.Add(this.rigiA.velocity, angularVelocityPenetrationCentroidA);
        let relativeVelocityB = Vector2.Add(this.rigiB.velocity, angularVelocityPenetrationCentroidB);

        let relativeVelocity = Vector2.Sub(relativeVelocityB, relativeVelocityA);
        let relativeVelocityAlongNormal = relativeVelocity.Dot(this.normal);

        if(relativeVelocityAlongNormal > 0) return;
     
        let e = Math.min(this.rigiA.material.bounce, this.rigiB.material.bounce);
        //let e = (2*this.rigiA.material.bounce*this.rigiB.material.bounce) / (this.rigiA.material.bounce+this.rigiB.material.bounce);
        let pToCentroidCrossNormalA = penetrationToCentroidA.Cross(this.normal);
        let pToCentroidCrossNormalB = penetrationToCentroidB.Cross(this.normal);

        let invMassSum = this.rigiA.invMass + this.rigiB.invMass;

        let rigiAInvInertia = this.rigiA.invInertia;
        let rigiBInvInertia = this.rigiB.invInertia;
        let crossNSum  = pToCentroidCrossNormalA*pToCentroidCrossNormalA * rigiAInvInertia + pToCentroidCrossNormalB*pToCentroidCrossNormalB * rigiBInvInertia;

        let j = -(1+e)*relativeVelocityAlongNormal;
        j = j / (invMassSum + crossNSum);

        let impulseVector = Vector2.Scale(this.normal, j);
        let impulseVectorRigiA = Vector2.Scale(impulseVector, this.rigiA.invMass);
        let impulseVectorRigiB = Vector2.Scale(impulseVector, this.rigiB.invMass);

        this.rigiA.velocity = Vector2.Sub(this.rigiA.velocity,impulseVectorRigiA);
        this.rigiB.velocity = Vector2.Add(this.rigiB.velocity,impulseVectorRigiB);
        this.rigiA.angularVelocity += -pToCentroidCrossNormalA * j * rigiAInvInertia;
        this.rigiB.angularVelocity += pToCentroidCrossNormalB * j * rigiBInvInertia;


        //Friction
        let velocityInNormalDirection = Vector2.Scale(this.normal, relativeVelocity.Dot(this.normal));
		let tangent = Vector2.Sub(relativeVelocity, velocityInNormalDirection);
		tangent = Vector2.Scale(tangent, -1);
		let minFriction = Math.min(this.rigiA.material.friction, this.rigiB.material.friction);
		if(tangent.x > 0.00001 || tangent.y > 0.00001){
			tangent.Normalize();		
			//DrawUtils.drawArrow(this.rigiA.shape.centroid,Vector2.Add(this.rigiA.shape.centroid, Vector2.Scale(tangent,40)),"blue");
		}
		
		let pToCentroidCrossTangentA = penetrationToCentroidA.Cross(tangent);
		let pToCentroidCrossTangentB = penetrationToCentroidB.Cross(tangent);

		let crossSumTangent = pToCentroidCrossTangentA*pToCentroidCrossTangentA * rigiAInvInertia + pToCentroidCrossTangentB*pToCentroidCrossTangentB * rigiBInvInertia;
		let frictionalImpulse = -(1+e)*relativeVelocity.Dot(tangent) * minFriction;
		frictionalImpulse /= (invMassSum + crossSumTangent);
		if(frictionalImpulse > j){
			frictionalImpulse = j;
		}

		let frictionalImpulseVector = Vector2.Scale(tangent, frictionalImpulse);
		
		this.rigiA.velocity = Vector2.Sub(this.rigiA.velocity,Vector2.Scale(frictionalImpulseVector,this.rigiA.invMass));
		this.rigiB.velocity = Vector2.Add(this.rigiB.velocity,Vector2.Scale(frictionalImpulseVector,this.rigiB.invMass));		

		
		this.rigiA.angularVelocity += -pToCentroidCrossTangentA * frictionalImpulse * rigiAInvInertia;		
		this.rigiB.angularVelocity += pToCentroidCrossTangentB * frictionalImpulse * rigiBInvInertia;

	}

    positionalCorrection(){
		let correctionPercentage = 0.1;
		let amountToCorrect = this.depth / (this.rigiA.invMass + this.rigiB.invMass) * correctionPercentage;
		let correctionVector = Vector2.Scale(this.normal, amountToCorrect);

		let rigiAMovement = Vector2.Scale(correctionVector, this.rigiA.invMass*-1);
		let rigiBMovement = Vector2.Scale(correctionVector, this.rigiB.invMass);


		if(!this.rigiA.isKinematic){
			this.rigiA.shape.move(rigiAMovement);
		}
		if(!this.rigiB.isKinematic){
			this.rigiB.shape.move(rigiBMovement);
		}

	}
	
    draw(ctx){
		let startPoint = Vector2.Add(this.penetrationPoint, Vector2.Scale(this.normal,this.depth*-1));
			
		DrawUtils.drawArrow(startPoint,this.penetrationPoint,"blue");
		DrawUtils.drawPoint(this.penetrationPoint,3,"gray");
	}


}