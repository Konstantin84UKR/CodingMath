import { Vector2 } from "./Vector2.js";
import { CollisionManifold } from "./CollisionManifold.js";
import { MathHelper } from "./MathHelper.js";
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";


export class CollisionDetection{
   
    static checkCollisions(rigiA,rigiB){
        
        let shapeA = rigiA.shape;
        let shapeB = rigiB.shape;
        
        let collisionManifold = null;

        if(shapeA instanceof Circle && shapeB instanceof Circle){
            collisionManifold = this.circleVsCircle(shapeA,shapeB);            
        }else if(shapeA instanceof Polygon && shapeB instanceof Polygon){
            collisionManifold = this.polygonVsPolygon(shapeA,shapeB);
        }else if(shapeA instanceof Circle && shapeB instanceof Polygon) {
            collisionManifold = this.circleVsPolygon(shapeA,shapeB);
        } 

        if(collisionManifold != null){
            collisionManifold.rigiA = rigiA;
            collisionManifold.rigiB = rigiB;
        }


        return collisionManifold;
    }


    static circleVsCircle(shapeA,shapeB){

        const shapeCircleA = shapeA;
        const shapeCircleB = shapeB;

        const centroidA = shapeCircleA.centroid;
        const centroidB = shapeCircleB.centroid;

        const direction = Vector2.Sub(centroidB,centroidA);
        const circleRadiusA = shapeCircleA.radius;
        const circleRadiusB = shapeCircleB.radius;

        const dirLength = direction.Length();
        const depth = dirLength - (circleRadiusB + circleRadiusA);

        if(depth < 0){
            let normal = Vector2.Scale(direction , 1.0/dirLength);
            let penetrationPoint = Vector2.Add(centroidA, Vector2.Scale(normal,circleRadiusA));

            return new CollisionManifold(depth*-1, normal, penetrationPoint);
        }else{
           
            return null;
        }   
    } 

    static polygonVsPolygon(shapePolygonA, shapePolygonB){
        let resultingContact = null;

        let contactPolyA = this.getContactPoint(shapePolygonA,shapePolygonB);
        if(contactPolyA == null){
            return null;
        }
        let contactPolyB = this.getContactPoint(shapePolygonB,shapePolygonA);
       
        if(contactPolyB == null){
            return null;
        }

        console.log(contactPolyA.depth +" <? "+contactPolyB.depth);

        if(contactPolyA.depth < contactPolyB.depth){
            resultingContact = new CollisionManifold(contactPolyA.depth, contactPolyA.normal,contactPolyA.penetrationPoint);
        }else{
            resultingContact = new CollisionManifold(contactPolyB.depth, Vector2.Scale(contactPolyB.normal,-1), contactPolyB.penetrationPoint); 
        }
        
        return resultingContact;
    }

    static getContactPoint(shapePolygonA, shapePolygonB) {
        let contact = null;
        let minimunPenetration = Number.MAX_VALUE;

        for (let i = 0; i < shapePolygonA.normals.length; i++) {
            let pointOnEdge = shapePolygonA.vertices[i];
            let normalOnEdge = shapePolygonA.normals[i];

            let supportPoint = this.findSupportPoint(normalOnEdge, pointOnEdge, shapePolygonB.vertices);
            if (supportPoint == null) {
                return null;
            }
            if (supportPoint.penetrationDepth < minimunPenetration) {
                minimunPenetration = supportPoint.penetrationDepth;
                contact = new CollisionManifold(minimunPenetration, normalOnEdge, supportPoint.vertex);
            }
        }

        return contact;
    }

    static findSupportPoint(normalOnEdge, pointOnEdge, otherPolygonVertices){
        let currentDeepestPenetration = 0;
        let supportPoint = null;

        for (let i = 0; i < otherPolygonVertices.length; i++) {
           let vertice = otherPolygonVertices[i];
           let verticeToPointEdge = Vector2.Sub(vertice,pointOnEdge);
           let penetrationDepth =  verticeToPointEdge.Dot(Vector2.Scale(normalOnEdge,-1));
           
           if(penetrationDepth > currentDeepestPenetration){
                currentDeepestPenetration = penetrationDepth;
                supportPoint = new SupportPoint(vertice, currentDeepestPenetration);
           }
        }
        return supportPoint;
    }

    static circleVsPolygon(shapeA,shapeB){
        let shapeCircle = shapeA;
        let shapePolygon = shapeB;

        let contact = this.circleVsPolygonEdges(shapeCircle,shapePolygon);
        if(contact){
            return contact;
        }
        else {
            return this.circleVsPolygonCorners(shapeCircle,shapePolygon);
        }
    }

    static circleVsPolygonEdges(shapeCircle, shapePolygon){
        let verticesLength = shapePolygon.vertices.length;
        let circleCentroid = shapeCircle.centroid;
        let nearestEdgeVertex = null;
        let nearEdgeNormal = null;

        for (let i = 0; i < verticesLength; i++) {
            let currVertex = shapePolygon.vertices[i];
            let currNormal = shapePolygon.normals[i];
            let nextVertex = shapePolygon.vertices[MathHelper.Index(i+1,verticesLength)];
            
            let vertToCircle = Vector2.Sub(circleCentroid,currVertex);
            let dirToNext = Vector2.Sub(nextVertex,currVertex);
            let dirToNextLength = dirToNext.Length();
            dirToNext.Normalize();

            let circleDirToNextProjection = vertToCircle.Dot(dirToNext);
            let circleDirToNormalProjection = vertToCircle.Dot(currNormal);
            if(circleDirToNormalProjection>=0 && circleDirToNextProjection > 0 &&circleDirToNextProjection < dirToNextLength){
                nearEdgeNormal = currNormal;
                nearestEdgeVertex = currVertex;  
            }
        }

        if(nearEdgeNormal == null || nearEdgeNormal == null){
            return null;
        }
       

        let vertexToCircle = Vector2.Sub(circleCentroid, nearestEdgeVertex);
        let projectionToEdgeNormal = nearEdgeNormal.Dot(vertexToCircle);

        if(projectionToEdgeNormal - shapeCircle.radius < 0){
            let penetrotion = projectionToEdgeNormal - shapeCircle.radius;
            let penetrationPoint = Vector2.Add(circleCentroid, Vector2.Scale(nearEdgeNormal,shapeCircle.radius*-1));
            return new CollisionManifold(penetrotion*-1,Vector2.Scale(nearEdgeNormal,-1),penetrationPoint);
        }

        return null;
    }

    static circleVsPolygonCorners(shapeCircle, shapePolygon){
        let verticesLength = shapePolygon.vertices.length;
        for (let i = 0; i < verticesLength; i++) {
           let currVertex = shapePolygon.vertices[i];
           let dirToCentroidCircle = Vector2.Sub(currVertex,shapeCircle.centroid);
           if(dirToCentroidCircle.Length2() < shapeCircle.radius * shapeCircle.radius){
                let penetration = shapeCircle.radius - dirToCentroidCircle.Length();
                dirToCentroidCircle.Normalize();
                return new CollisionManifold(penetration, Vector2.Scale(dirToCentroidCircle,1),currVertex);
           }
        }
        return null;
    }

}

export class SupportPoint{
	constructor(vertex, penetrationDepth){
		this.vertex = vertex;
		this.penetrationDepth = penetrationDepth;
	}
}
