import { Particle } from "./Particle.js";
import { Vector2 } from "./Vector2.js";
import { DrawUtils } from './DrawUtils.js'
import { FluidHashGrid } from './FluidHashGrid.js'

export class Simulation{
    constructor(canvas){
        this.canvas = canvas; 
        this.ctx = canvas.getContext('2d');
        this.particles = [];
      
        this.AMOUNT_PARTICLES = 2000;
        this.VELOCITY_DAMPING = 1;
        this.GRAVITY = new Vector2(0,1);
        this.REST_DENSITY = 10;
        this.K_NEAR = 3;
        this.K = 0.5;
        this.INTERACTION_RADIUS = 25;        
        
        this.fluidHashGrid = new FluidHashGrid(25);
        this.instantiateParticles();
        this.fluidHashGrid.initialize(this.particles);
    }

    instantiateParticles(){
        let offsetBetweenParticles = 10;
        let offsetAllParticles = new Vector2(150,100);

        let xparticles = Math.sqrt(this.AMOUNT_PARTICLES);
        let yparticles = xparticles;

        for (let x = 0; x < xparticles; x++) {
           for (let y = 0; y <yparticles; y++) {
                let position = new Vector2(x*offsetBetweenParticles + offsetAllParticles.x,
                    y*offsetBetweenParticles + offsetAllParticles.y);
               
               this.particles.push(new Particle(position));
               this.particles[this.particles.length-1].color = "#25b0ff";                       
            }
        }
    }

    neighbourSearch(mousePos){
        this.fluidHashGrid.clearGrid();
        this.fluidHashGrid.mapParticleToCell();     
    }

    // Algorithm 1 
    update(dt,mousePos){
       // console.log('Simulation update');
       this.applyGravity(dt); // line 1 - 3
       this.predictPosition(dt);// line 6 - 10
       this.neighbourSearch(mousePos); 
       this.doubleDensityRelaxation(dt); // line 16
       this.worldBoundary();
       this.couputeNextVelocity(dt);// line 18 - 20
    }

    worldBoundary(){
        for (let i = 0; i < this.particles.length; i++) {
             let p =this.particles[i];
             let pos = p.position;
             let prevPos = p.prevPosotion;
             
             if(pos.x < 0 + p.size * 0.5 ){
                p.position.x = p.size * 0.5; 
                this.particles[i].velosity.x *= -1; 
             }
             if(pos.y < 0 + p.size * 0.5){
                p.position.y = p.size * 0.5; 
                this.particles[i].velosity.y *= -1;
             }
             if(pos.x > this.canvas.width - p.size * 0.5){
                p.position.x = this.canvas.width - p.size * 0.5; 
                this.particles[i].velosity.x *= -1;
             } 
             if(pos.y > this.canvas.height -  p.size * 0.5){
                p.position.y = this.canvas.height - p.size * 0.5; 
                this.particles[i].velosity.y *= -1;
             }
            
        }
    }

    predictPosition(dt){
        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].prevPosotion = this.particles[i].position.Copy();
          this.particles[i].position = Vector2.Add(this.particles[i].position, 
            Vector2.Scale(this.particles[i].velosity, dt * this.VELOCITY_DAMPING));
        }
    }

    couputeNextVelocity(dt){
        for (let i = 0; i < this.particles.length; i++) {
           let p = this.particles[i]; 
           p.velosity = Vector2.Scale(Vector2.Sub(p.position, p.prevPosotion), 1/ dt );           
        }
    }

    applyGravity(dt){
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i]; 
            p.velosity = Vector2.Add(p.velosity, Vector2.Scale(this.GRAVITY, dt));           
         }
	}

    doubleDensityRelaxation(dt){
        for (let i = 0; i < this.particles.length; i++) {
            
            let density = 0;
            let densityNear = 0;
            let neigbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            let particleA = this.particles[i];

            for (let j = 0; j < neigbours.length; j++) {
                let particleB = neigbours[j];
                if(particleA == particleB){
                    continue;
                }
                
                let rij = Vector2.Sub(particleB.position, particleA.position);
                let q = rij.Length()/ this.INTERACTION_RADIUS;

                if(q < 1){
                    let oneMinusQ = (1-q);
                    density += oneMinusQ*oneMinusQ;
                    densityNear += oneMinusQ*oneMinusQ*oneMinusQ;
                }
            }

            let pressure = this.K * (density - this.REST_DENSITY);
            let pressureNear = this.K_NEAR * densityNear;
            let particleADisplacement = Vector2.Zero();

            for (let j = 0; j < neigbours.length; j++) {
                let particleB = neigbours[j];
                if(particleA == particleB){
                    continue;
                }

                let rij = Vector2.Sub(particleB.position, particleA.position);
                let q = rij.Length()/ this.INTERACTION_RADIUS;
                
                if(q < 1){
                    rij.Normalize();
                    let displacementTerm = Math.pow(dt,2) * (pressure * (1-q) + pressureNear * Math.pow(1-q,2));
                    let D = Vector2.Scale(rij, displacementTerm);

                    particleB.position = Vector2.Add(particleB.position, Vector2.Scale(D,0.5));
                    particleADisplacement = Vector2.Sub(particleADisplacement, Vector2.Scale(D,0.5));
                }
            }

            particleA.position = Vector2.Add(particleA.position, particleADisplacement);            
        }
	}


    draw(){

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i]
            DrawUtils.drawPoint(this.ctx,p.position, p.size,  p.color)
            
        }
       
    }
}