import { Vector } from "./Vector.js";


export class Particle {

	constructor({x, y, speed, direction, grav}){

    this.x = x;
    this.y = y;
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
    this.mass = 1.0;
    this.radius = 0;
		this.friction = 1;
    this.bounce = 0.5;

    this.gravity = grav || 0; // гравитация в низ экрана

}
    
	accelerate({ax,ay}){
    this.vx += ax;
    this.vy += ay;
	}

	update(){
    this.accelerate({ax: 0, ay:this.gravity});
		this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
	}

	angleTo(p2){
    return Math.atan2(p2.y - this.y, p2.x - this.x);
	}

	distanceTo(p2){
    const dx = p2.x - this.x; 
    const dy = p2.y - this.y; 

		return Math.sqrt(dx * dx + dy * dy);
  }

	gravityTo(p2){

    const dx = p2.x - this.x;
    const dy = p2.y - this.y;
    const distSQ = dx * dx + dy * dy;
    const dist = Math.sqrt(distSQ);
    const force = p2 / distSQ;
    const ax = dx / dist * force;
    const ay = dy / dist * force;

    this.vx += ax;
    this.vy += ay;

		// const dist = this.distanceTo(p2);
    // let grav = new Vector(0,0);
    // grav.setLength(p2.mass / (dist * dist));
    // grav.setAngle(this.angleTo(p2));
    // this.velocity.addTo(grav);

  }
}