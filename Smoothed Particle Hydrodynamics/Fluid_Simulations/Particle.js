import {Vector2} from './Vector2.js'

export class Particle{
    constructor(position){
        this.position = position;
        this.prevPosition = position;
        this.velosity = new Vector2(0,0);
        this.size = 6;
    }

}