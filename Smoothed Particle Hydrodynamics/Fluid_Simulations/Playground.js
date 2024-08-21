import {Simulation} from './Simulation.js'
import { Vector2 } from "./Vector2.js";
import {DrawUtils} from './DrawUtils.js'

export class Playground{
    constructor(canvas){
        this.simulation = new Simulation(canvas);
        this.canvas = canvas;
    }

    update(dt){
        this.simulation.update(dt);
    }

    draw(){
        this.simulation.draw();  
        
        DrawUtils.drawLine(this.simulation.ctx, new Vector2(0,0), new Vector2(100,100), 'blue', 10);
        DrawUtils.drawLine(this.simulation.ctx, new Vector2(0,0), new Vector2(100,210), "red", 10);
        DrawUtils.drawPoint(this.simulation.ctx, new Vector2(100,100), 20 , "green");
        DrawUtils.strokePoint(this.simulation.ctx, new Vector2(100,100), 22 , "blue");
        DrawUtils.drawRect(this.simulation.ctx, new Vector2(100,100),  new Vector2(50,50) , "blue");

        DrawUtils.drawText(this.simulation.ctx, new Vector2(100,100), 20 , "White" , "Hello");
    }

    onMouseMove(position){
        //position.log();
    }
    onMouseDown(button){
      //  console.log('Mouse button pressed: ' + button);
    }
    onMouseUp(button){
      //  console.log('Mouse button released: ' + button);
    }
}