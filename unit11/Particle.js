import { Vector } from "./Vector.js";


export class Particle {
    constructor(x,y,speed, direction){
       this.position = new Vector(x,y);
       this.velocity = new Vector(0, 0); 
       this.mass = 1.0;
       this.velocity.setLength(speed);
       this.velocity.setAngle(direction);
    }
    
    accelerate(accel){
        this.velocity.addTo(accel);
    }

    update(){
        this.position.addTo(this.velocity);
    }

    angleTo(p2){
        return Math.atan2(p2.position.getY() - this.position.getY(),
        p2.position.getX() - this.position.getX());
    }

    distanceTo(p2){
       const dx = p2.position.getX() - this.position.getX(); 
       const dy = p2.position.getY() - this.position.getY(); 

       return Math.sqrt(dx * dx + dy * dy);
    }

    gravityTo(p2){
       const dist = this.distanceTo(p2);
       let grav = new Vector(0,0);
       grav.setLength(p2.mass / (dist * dist));
       grav.setAngle(this.angleTo(p2));

       this.velocity.addTo(grav);

    }

}