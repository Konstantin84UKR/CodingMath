import { Vector } from "./Vector.js";

export class Stick{
    constructor(p1,p2,separation){

        this.startPoint = p1;
        this.endPoint = p2;
        this.stiffness  = 0.5;
        this.color = '#ff7700';

        if(!separation){
          this.length = this.startPoint.distanceTo(this.endPoint);
        }else{
          this.length = separation;
        }
        

        // const distans = p0.distanceTo(p1);
        // const springForce = (distans - separation) * k;
      
        // const delta = Vector.subtract(p0.position,p1.position);
        // delta.divideBy(distans);
        // delta.multiplyBy(springForce);
        
        // p1.accelerate(delta);
        // delta.multiplyBy(-1);
        // p0.accelerate(delta);
    }

    update(){
         // calculate the distance between two dots
        let delta = Vector.subtract(this.endPoint.position,this.startPoint.position);

        // pythagoras theorem
        let dist = delta.getLength();
        // calculate the resting distance betwen the dots
        let diff = (this.length - dist) / dist * this.stiffness;

        // getting the offset of the points
        diff *= 0.5;
        let offset = Vector.multiplyByScalar(delta,diff);

        // calculate mass
        let mass = this.startPoint.mass + this.endPoint.mass;
        let massP1 = this.startPoint.mass / mass;
        let massP2 = this.endPoint.mass / mass;
        
        // and finally apply the offset with calculated mass
        
        this.startPoint.position = Vector.subtract(this.startPoint.position,Vector.multiplyByScalar(offset,massP1));
        this.endPoint.position = Vector.add(this.endPoint.position,Vector.multiplyByScalar(offset,massP2));

    }
}