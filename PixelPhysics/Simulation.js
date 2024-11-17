import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";

import { Rectangle } from "./shapes/Rectangle.js";
import { CollisionDetection } from "./CollisionDetection.js";
import { Rigidbody } from "./Rigidbody.js";
export class Simulation{
    constructor(ctx,worldSize){
       this.worldSize = worldSize;
       this.ctx = ctx; 
       this.gravity = new Vector2(0,100);
       this.rigidBodies = [];
       this.createBoundary(); 

       this.colors = {
            staticBodyColor: "#88ffff",
            dimamicBodyColor: "#88ff88",
            dimamicBodyColor2: "#ffff88",

       } 

      
       this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx, new Vector2(350,500), 200,200,this.colors.staticBodyColor ),0));
       this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx, new Vector2(230,100), 200,100,this.colors.dimamicBodyColor),10));
       this.rigidBodies.push( new Rigidbody(new Circle(this.ctx, new Vector2(550,300),50.0,this.colors.dimamicBodyColor),5));
       this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx, new Vector2(480,100), 200,100,this.colors.dimamicBodyColor),10));
       
      

    }

    createBoundary(){
        this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx,new Vector2(this.worldSize.x/2,-50), this.worldSize.x,100,"#ffffff"),0));
		this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx,new Vector2(this.worldSize.x/2,this.worldSize.y+50), this.worldSize.x,100,"#ffffff"),0));
		this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx,new Vector2(-50,this.worldSize.y/2), 100,this.worldSize.y,"#ffffff"),0));
		this.rigidBodies.push(new Rigidbody(new Rectangle(this.ctx,new Vector2(this.worldSize.x+50,this.worldSize.y/2), 100,this.worldSize.y,"#ffffff"),0));
	}
	
	
	draw(ctx){
		for(let i=0; i<this.rigidBodies.length;i++){
			this.rigidBodies[i].getShape().draw(ctx);
		}
	}	
	
	onKeyboardPressed(evt){
		let force = 10000;
		
		switch(evt.key){
			case "d": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(force,0));	break;	
			case "a": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(-force,0));	break;	
			case "s": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(0,force));	break;	
			case "w": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(0,-force));	break;	
			//case "r": this.rigidBodys[0].rotate(0.05);	break;	
			//case "q": this.rigidBodys[0].rotate(-0.05);	break;	
			
			case "ArrowRight": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(force,0));	break;
			case "ArrowLeft": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(-force,0));	break;	
			case "ArrowDown": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(0,force));	break;	
			case "ArrowUp": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(0,-force));	break;	
			//case ".": this.rigidBodys[1].rotate(0.05);		break;	
			//case ",": this.rigidBodys[1].rotate(-0.05);	break;	
		}

    }

    update(dt){

        for (let i = 0; i < this.rigidBodies.length; i++) {

            let body = this.rigidBodies[i];
          
            body.update(dt); 
            let gravitationForce = Vector2.Scale(this.gravity, this.rigidBodies[i].mass); 
            body.addForce(gravitationForce);       

            
        }

        for (let i = 0; i < this.rigidBodies.length; i++) {
            for (let j = 0; j < this.rigidBodies.length; j++) {
                if(i != j){
                    let rigiA = this.rigidBodies[i];
                    let rigiB = this.rigidBodies[j];
                    let collisionManifold = CollisionDetection.checkCollisions(rigiA,rigiB);
                    if (collisionManifold != null){
                        collisionManifold.resolveCollision();
                        collisionManifold.positionalCorrection();
                    }                    
                }
            }
        }
        
    }

    draw(){
        for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodies[i].getShape().draw(this.ctx);            
         }         
    }

    onKeyboardPressed(e){
       // console.log('key = ' + e.keyCode + ' ' + e.code -+ ' ' + e.key);

        let force = 5000;

        switch (e.key) {
                    

            case "d": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(force,0));	break;	
			case "a": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(-force,0));	break;	
			case "s": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(0,force));	break;	
			case "w": this.rigidBodies[this.rigidBodies.length-2].addForce(new Vector2(0,-force));	break;	
			//case "r": this.rigidBodys[0].rotate(0.05);	break;	
			//case "q": this.rigidBodys[0].rotate(-0.05);	break;	
			
			case "ArrowRight": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(force,0));	break;
			case "ArrowLeft": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(-force,0));	break;	
			case "ArrowDown": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(0,force));	break;	
			case "ArrowUp": this.rigidBodies[this.rigidBodies.length-1].addForce(new Vector2(0,-force));	break;	
			//case ".": this.rigidBodys[1].rotate(0.05);		break;	
			//case ",": this.rigidBodys[1].rotate(-0.05);	break;	


            default:
                break;
        }
    }

}