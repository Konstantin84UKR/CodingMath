import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";

import { Rectangle } from "./shapes/Rectangle.js";
import { CollisionDetection } from "./CollisionDetection.js";
import { RigidBody } from "./Rigidbody.js";
export class Simulation{
    constructor(ctx){
       this.ctx = ctx; 
       this.gravity = new Vector2(0,5000);
       
       this.rigidBodys = [];
       this.rigidBodys.push(new RigidBody(new Circle(this.ctx,new Vector2(300,300),100,"#55ff88"),10));
       
       let rigidBounce = new RigidBody(new Circle(this.ctx,new Vector2(600,300),50,"#55ff88"),10);
       rigidBounce.material.bounce = 1.5;
       this.rigidBodys.push(rigidBounce);
    }

    update(dt){

        for (let i = 0; i < this.rigidBodys.length; i++) {

            let body = this.rigidBodys[i];

            body.addForce(this.gravity);
            body.update(dt);            

            if(body.getCenter().y + body.getShape().radius > 720){
                let vel = body.getVelocity();
                body.setVelocity(Vector2.Scale(vel, -1 * body.material.bounce));
            }
        }
        
    }

    draw(){
        for (let i = 0; i < this.rigidBodys.length; i++) {
            this.rigidBodys[i].getShape().draw(this.ctx);            
         }         
    }

    onKeyboardPressed(e){
       // console.log('key = ' + e.keyCode + ' ' + e.code -+ ' ' + e.key);

        let force = 1000;

        switch (e.key) {
           
            case "a": this.rigidBodys[0].addForce(new Vector2(-force,0));	break;	
            case "d": this.rigidBodys[0].addForce(new Vector2(force,0));	break;	
			case "s": this.rigidBodys[0].addForce(new Vector2(0,force));	break;	
			case "w": this.rigidBodys[0].addForce(new Vector2(0,-force));	break;	
			// case "e": this.shapes[0].rotate(0.05);	break;	
			// case "q": this.shapes[0].rotate(-0.05);	break;	
			
			case "ArrowRight":  this.rigidBodys[1].addForce(new Vector2(force,0));	break;
			case "ArrowLeft":   this.rigidBodys[1].addForce(new Vector2(-force,0));	break;	
			case "ArrowDown":   this.rigidBodys[1].addForce(new Vector2(0,force));	break;	
			case "ArrowUp":     this.rigidBodys[1].addForce(new Vector2(0,-force));	break;	
			// case ".":           this.shapes[3].rotate(0.05);		break;	
			// case ",":           this.shapes[3].rotate(-0.05);	break;	

            default:
                break;
        }
    }

}