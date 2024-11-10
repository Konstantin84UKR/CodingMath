import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";

import { Rectangle } from "./shapes/Rectangle.js";
import { CollisionDetection } from "./CollisionDetection.js";

export class Simulation{
    constructor(ctx){
       this.ctx = ctx; 

      this.testCircleB = new Circle(this.ctx,new Vector2(350,300),50,'#11FF88');
    //    this.testCircleA = new Circle(this.ctx,new Vector2(200,200),100,'#11FF88');
    //    this.testPolygon = new Polygon(this.ctx,[
    //     new Vector2(500,300),
    //     new Vector2(400,100),
    //     new Vector2(600,200)
    // ],'#11FF88');


    //     this.testRectangle = new Rectangle(this.ctx,new Vector2(200,400),150,50,'#11FF88');

       this.shapes = new Array();

        this.shapes.push(new Rectangle(this.ctx, new Vector2(300,400),200,290,'#11FF88'));
		this.shapes.push(new Rectangle(this.ctx,new Vector2(600,400),150,150,'#11FF88'));
		this.shapes.push(new Circle(this.ctx,new Vector2(50,300),80,'#11FF88'));
        this.shapes.push(new Circle(this.ctx,new Vector2(350,600),50,'#11FF88'));
        
        this.collisionManifold = null;

    }

    update(dt){
    //    const result = CollisionDetection.circleVsCircle(this.testCircleA,this.testCircleB);
    //    if(result){
    //         this.testCircleB.color = "#FFFF00"; 
    //         this.testCircleA.color = "#FFFF00"; 
    //    }else{
    //         this.testCircleB.color = "#11FF88"; 
    //         this.testCircleA.color = "#11FF88"; 
    //    }

     for (let i = 0; i < this.shapes.length; i++) {

        for (let j = 0; j < this.shapes.length; j++) {
            if(i===j){
                continue;
            }            
            
            let objectA = this.shapes[i];
            let objectB = this.shapes[j];

            let result = CollisionDetection.checkCollisions(objectA,objectB);
            if(result != null){
                 console.log(result);

            }
           
            if(result){
                objectA.setColor("red");
                objectB.setColor("red");
                this.collisionManifold = result;

                let push = Vector2.Scale(result.normal, result.depth * 0.5);
                objectB.move(push);
                push = Vector2.Scale(result.normal, result.depth * -0.5);
                objectA.move(push);
            }else{
                objectA.setColor('#11FF88');
                objectB.setColor('#11FF88');
                this.collisionManifold = null;  
            }
        }
        
     }   
        
    }

    draw(){
        // DrawUtils.drawRect(this.ctx, new Vector2(100,100), new Vector2(200,200), '#ff5500');  
        // DrawUtils.drawPoint(this.ctx, new Vector2(100,100), 10, '#0055ff');  
        // DrawUtils.strokePoint(this.ctx, new Vector2(250,100), 20, '#11FF88');  
        // DrawUtils.drawLine(this.ctx, new Vector2(100,350), new Vector2(500,200), '#ff5500'); 
        // DrawUtils.drawArrow(this.ctx, new Vector2(200,350), new Vector2(500,300), '#11FF88'); 

        // this.testCircleA.draw(this.ctx);
        // this.testCircleB.draw(this.ctx);
      
        // this.testPolygon.draw(this.ctx);
        // this.testRectangle.draw(this.ctx);

        for(let i=0; i<this.shapes.length;i++){
			this.shapes[i].draw(this.ctx);
		}
		
		if(this.collisionManifold){
			this.collisionManifold.draw(this.ctx);
			//,,console.log("draw");
		}

        
    }

    onKeyboardPressed(e){
       // console.log('key = ' + e.keyCode + ' ' + e.code -+ ' ' + e.key);

        this.moveSpeed = 5;

        switch (e.key) {
           
            case "a": this.shapes[0].move(new Vector2(-this.moveSpeed,0));	break;	
            case "d": this.shapes[0].move(new Vector2(this.moveSpeed,0));	break;	
			case "s": this.shapes[0].move(new Vector2(0,this.moveSpeed));	break;	
			case "w": this.shapes[0].move(new Vector2(0,-this.moveSpeed));	break;	
			case "e": this.shapes[0].rotate(0.05);	break;	
			case "q": this.shapes[0].rotate(-0.05);	break;	
			
			case "ArrowRight":  this.shapes[3].move(new Vector2(this.moveSpeed,0));	break;
			case "ArrowLeft":   this.shapes[3].move(new Vector2(-this.moveSpeed,0));	break;	
			case "ArrowDown":   this.shapes[3].move(new Vector2(0,this.moveSpeed));	break;	
			case "ArrowUp":     this.shapes[3].move(new Vector2(0,-this.moveSpeed));	break;	
			case ".":           this.shapes[3].rotate(0.05);		break;	
			case ",":           this.shapes[3].rotate(-0.05);	break;	

            default:
                break;
        }
    }

}