import {Simulation} from './Simulation.js'
import { Vector2 } from "./Vector2.js";
import {DrawUtils} from './DrawUtils.js'

export class Playground{
    constructor(canvas){
        this.simulation = new Simulation(canvas);
        this.canvas = canvas;
        this.mousePos = Vector2.Zero();//this.simulation.particles[0].position;
        this.lastMousePos = Vector2.Zero();
        this.selectedShape = null;
    }

    update(dt){
        this.simulation.update(dt,this.mousePos);
    }

    draw(){
        this.simulation.draw();         
    }

    onMouseMove(position){
        this.lastMousePos = this.mousePos.Copy();
        this.mousePos = position;

        if(this.selectedShape){
            let delta = Vector2.Sub(this.mousePos , this.lastMousePos);
            this.selectedShape.moveBy(delta);
        }
    }
    onMouseDown(button){
      //  console.log('Mouse button pressed: ' + button);
      if(button === 0){
        this.selectedShape = this.simulation.getShapeAt(this.mousePos);
      }
      if(button === 1){
        this.simulation.rotate = !this.simulation.rotate;
      }
    }
    onMouseUp(button){
      //  console.log('Mouse button released: ' + button);
      if(button === 0){
         this.selectedShape = null;
      }
    }
}