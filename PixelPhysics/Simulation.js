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
       this.testCircleA = new Circle(this.ctx,new Vector2(200,200),100,'#11FF88');
       this.testPolygon = new Polygon(this.ctx,[
        new Vector2(500,300),
        new Vector2(400,100),
        new Vector2(600,200)
    ],'#11FF88');


        this.testRectangle = new Rectangle(this.ctx,new Vector2(200,400),150,50,'#11FF88');

    }

    update(dt){
       const result = CollisionDetection.circleVsCircle(this.testCircleA,this.testCircleB);
       if(result){
            this.testCircleB.color = "#FFFF00"; 
            this.testCircleA.color = "#FFFF00"; 
       }else{
            this.testCircleB.color = "#11FF88"; 
            this.testCircleA.color = "#11FF88"; 
       }
    }

    draw(){
        // DrawUtils.drawRect(this.ctx, new Vector2(100,100), new Vector2(200,200), '#ff5500');  
        // DrawUtils.drawPoint(this.ctx, new Vector2(100,100), 10, '#0055ff');  
        // DrawUtils.strokePoint(this.ctx, new Vector2(250,100), 20, '#11FF88');  
        // DrawUtils.drawLine(this.ctx, new Vector2(100,350), new Vector2(500,200), '#ff5500'); 
        // DrawUtils.drawArrow(this.ctx, new Vector2(200,350), new Vector2(500,300), '#11FF88'); 

        this.testCircleA.draw(this.ctx);
        this.testCircleB.draw(this.ctx);
      
        this.testPolygon.draw(this.ctx);
        this.testRectangle.draw(this.ctx);
        
    }

    onKeyboardPressed(e){
        console.log('key = ' + e.keyCode + ' ' + e.code -+ ' ' + e.key);

        this.moveSpeed = 5;

        switch (e.key) {
           
            case "a": this.testCircleA.move(new Vector2(-this.moveSpeed,0));	break;	
            case "d": this.testCircleA.move(new Vector2(this.moveSpeed,0));	break;	
			case "s": this.testCircleA.move(new Vector2(0,this.moveSpeed));	break;	
			case "w": this.testCircleA.move(new Vector2(0,-this.moveSpeed));	break;	
			case "e": this.testCircleA.rotate(0.05);	break;	
			case "q": this.testCircleA.rotate(-0.05);	break;	
			
			case "ArrowRight":  this.testCircleB.move(new Vector2(this.moveSpeed,0));	break;
			case "ArrowLeft":   this.testCircleB.move(new Vector2(-this.moveSpeed,0));	break;	
			case "ArrowDown":   this.testCircleB.move(new Vector2(0,this.moveSpeed));	break;	
			case "ArrowUp":     this.testCircleB.move(new Vector2(0,-this.moveSpeed));	break;	
			case ".":           this.testCircleB.rotate(0.05);		break;	
			case ",":           this.testCircleB.rotate(-0.05);	break;	

            default:
                break;
        }
    }

}