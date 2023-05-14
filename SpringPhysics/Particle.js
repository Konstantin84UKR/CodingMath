import { Vector } from "./Vector.js";


export class Particle {

	constructor({x, y, speed, direction, grav}){

    // this.x = x;
    // this.y = y;
    // this.vx = Math.cos(direction) * speed;
    // this.vy = Math.sin(direction) * speed;

    this.position = new Vector(x,y);
    this.positionOld = new Vector(x,y);
    this.velocity = new Vector( Math.cos(direction) * speed,Math.sin(direction) * speed);

    this.mass = 1.0;
    this.radius = 0;
		this.friction = 1;
    this.bounce = 0.5;
    this.sellect = false;

    this.gravity = new Vector(0,grav||0); // гравитация в низ экрана

}
    
	accelerate(accel){
    this.velocity.addTo(accel);
    if(isNaN(this.velocity._x)){
      let s =5;
    }
	}

	update(){
    if(isNaN(this.velocity._x)){
      let s =5;
    }
    if (!this.sellect){
      this.accelerate(this.gravity);
      this.velocity.multiplyBy(this.friction);
      this.position.addTo(this.velocity);

      if(isNaN(this.velocity._x)){
        let s =5;
      }

    }else{
      this.velocity.multiplyBy(0);
      if(isNaN(this.velocity._x)){
        let s =5;
      }

    }
  
    if(isNaN(this.velocity._x)){
      let s =5;
    }
	}

	angleTo(p2){
    // return Math.atan2(p2.y - this.y, p2.x - this.x);

    return Math.atan2(p2.position.getY() - this.position.getY(),
    p2.position.getX() - this.position.getX());
	}

	distanceTo(p2){
    // const dx = p2.x - this.x; 
    // const dy = p2.y - this.y; 

		// return Math.sqrt(dx * dx + dy * dy);

    const dx = p2.position.getX() - this.position.getX(); 
    const dy = p2.position.getY() - this.position.getY(); 

		return Math.sqrt(dx * dx + dy * dy);
  }

  distanceToVector(p2){
    
    const dx = p2.getX() - this.position.getX(); 
    const dy = p2.getY() - this.position.getY(); 

		return Math.sqrt(dx * dx + dy * dy);
  }

	gravityTo(p2){

    // const dx = p2.x - this.x;
    // const dy = p2.y - this.y;
    // const distSQ = dx * dx + dy * dy;
    // const dist = Math.sqrt(distSQ);
    // const force = p2 / distSQ;
    // const ax = dx / dist * force;
    // const ay = dy / dist * force;

    // this.vx += ax;
    // this.vy += ay;

		const dist = this.distanceTo(p2);
    let grav = new Vector(0,0);
    grav.setLength(p2.mass / (dist * dist));
    grav.setAngle(this.angleTo(p2));
    this.velocity.addTo(grav);

    if(isNaN(this.velocity._x)){
      let s =5;
    }

  }
}