import {vec2} from '../../common/wgpu-matrix.module.js';

export class Particle{
    constructor(radius, mass, pos, vel,id){
        this.radius = radius;
        this.mass = mass;
        this.pos = vec2.clone(pos);
        this.vel = vec2.clone(vel);
        this.fillStyle = "#ff8855";
        this.marker = false;
        this.id = id;

        this.density = 0;
        this.densityNear = 0;

        this.pressure = 0;
        this.pressureNear = 0;
    }
    simulate(dt, gravity) {
        
    }
} 
