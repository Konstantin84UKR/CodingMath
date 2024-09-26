import {Simulation} from './Simulation.js'
import { Vector2 } from "./Vector2.js";
import {DrawUtils} from './DrawUtils.js'

export class Playground{
    constructor(canvas){
        this.simulation = new Simulation(canvas);
        this.canvas = canvas;
        this.mousePos = Vector2.Zero();//this.simulation.particles[0].position;
    }

    update(dt){
        this.simulation.update(dt,this.mousePos);
    }

    draw(){
        this.simulation.draw();         
    }

    onMouseMove(position){
        //position.log();
        this.mousePos = position;
    }
    onMouseDown(button){
      //  console.log('Mouse button pressed: ' + button);
    }
    onMouseUp(button){
      //  console.log('Mouse button released: ' + button);
    }
}