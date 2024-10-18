import { DrawUtils } from "./utils/DrawUtils.js";
import { Vector2 } from "./Vector2.js";
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";

import { Rectangle } from "./shapes/Rectangle.js";

export class Simulation{
    constructor(ctx){
       this.ctx = ctx; 

       this.testCircle = new Circle(this.ctx,new Vector2(200,200),100,'#11FF88');
       this.testCircle1 = new Circle(this.ctx,new Vector2(350,300),50,'#88FF88');
       this.testPolygon = new Polygon(this.ctx,[
        new Vector2(500,300),
        new Vector2(400,100),
        new Vector2(600,200)

    ],100,'#11FF88');


        this.testRectangle = new Rectangle(this.ctx,new Vector2(200,400),150,50,'#11FF88');

    }

    update(dt){

    }

    draw(){
        // DrawUtils.drawRect(this.ctx, new Vector2(100,100), new Vector2(200,200), '#ff5500');  
        // DrawUtils.drawPoint(this.ctx, new Vector2(100,100), 10, '#0055ff');  
        // DrawUtils.strokePoint(this.ctx, new Vector2(250,100), 20, '#11FF88');  
        // DrawUtils.drawLine(this.ctx, new Vector2(100,350), new Vector2(500,200), '#ff5500'); 
        // DrawUtils.drawArrow(this.ctx, new Vector2(200,350), new Vector2(500,300), '#11FF88'); 

        this.testCircle.draw(this.ctx);
        this.testCircle1.draw(this.ctx);
        this.testPolygon.draw(this.ctx);
        this.testRectangle.draw(this.ctx);
        
    }

    onKeyboardPressed(e){
        console.log('key = ' + e.keyCode + ' ' + e.code);
    }

}