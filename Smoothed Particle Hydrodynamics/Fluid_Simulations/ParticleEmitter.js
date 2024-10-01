import { Vector2 } from "./Vector2.js";
import { Particle } from "./Particle.js";
import { DrawUtils } from './DrawUtils.js'

export class ParticleEmitter{
    constructor(ctx,position, direction, size, spawnInterval, amount, velocity){
        this.ctx = ctx;
        this.position = position;
        this.direction = direction;
        this.size = size;
        this.spawnInterval = spawnInterval;
        this.amount = amount;
        this.velocity = velocity;
     
        this.time = 0;     
        
        this.currentParticleIndex = 0;
    }

    spawn(dt,particles){
        let offset = (this.size*2) / this.amount;
        this.time += dt;

        if(this.time > this.spawnInterval){
            
            this.time = 0;   

            for(let i=0; i<this.amount; i++){
            
                let normal = this.direction.GetNormal();
                normal.Normalize();
                let plane =  Vector2.Scale(normal, -this.size);
                let planeStart = Vector2.Add(this.position, plane);
                let position = Vector2.Add(planeStart, Vector2.Scale(normal, offset * i ));


                let normalizedDir = this.direction.Copy();
                normalizedDir.Normalize();

                let particle;
                if(particles.length >=2000){
                    if(this.currentParticleIndex >= 500){
                        this.currentParticleIndex = 0;
                      }                 
                    particle = particles[++this.currentParticleIndex];
                    particle.position = position;
                    particle.velosity = Vector2.Scale(normalizedDir, this.velocity);;
                 
                }else{
                   particle = new Particle(position);                    
                   particle.velosity = Vector2.Scale(normalizedDir, this.velocity);
                   particles.push(particle);
                }
              
                
             
           }
        }
    }

    rotate(angleInRadians){
      
        const cosAngle = Math.cos(angleInRadians); 
        const sinAngle = Math.sin(angleInRadians); 
        const rotationX = this.direction.x * cosAngle - this.direction.y * sinAngle; 
        const rotationY = this.direction.x * sinAngle + this.direction.y * cosAngle; 

        this.direction.x = rotationX;
        this.direction.y = rotationY;

    }

    move(delta){
        this.position = Vector2.Add(this.position, delta);
    }

    draw(){
        let dir = this.direction.Copy();
        dir.Normalize();
        DrawUtils.drawLine(this.ctx,this.position, Vector2.Add(this.position, Vector2.Scale(dir,30)), "orange", 5);
    }

}