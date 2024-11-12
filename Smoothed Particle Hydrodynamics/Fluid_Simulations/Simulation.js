import { Particle } from "./Particle.js";
import { Vector2 } from "./Vector2.js";
import { DrawUtils } from './DrawUtils.js'
import { FluidHashGrid } from './FluidHashGrid.js';
import { ParticleEmitter } from './ParticleEmitter.js';
import { Spring } from './Spring.js';
import { Circle } from "./shapes/Circle.js";
import { Polygon } from "./shapes/Polygon.js";

export class Simulation{
    constructor(canvas){
        this.canvas = canvas; 
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleEmitters = [];
        this.springs = new Map();
        this.shapes = [];
      
        this.AMOUNT_PARTICLES = 1000;
        this.VELOCITY_DAMPING = 1.0;
        this.GRAVITY = new Vector2(0,1);
        this.REST_DENSITY = 10;
        this.K_NEAR = 3;
        this.K = 0.5;
        this.INTERACTION_RADIUS = 35; 
        
        this.SIGMA = 0.1;
        this.BETA = 0.05;

        this.GAMMA = 0.1;
        this.PLASTICITY = 1.7;
        this.SPRING_STIFFNESS = 0.7;

        this.MAX_STICKY_DISTANCE = this.INTERACTION_RADIUS;
        this.K_STICK = 0.05;

        this.fluidHashGrid = new FluidHashGrid(25);
        this.instantiateParticles();
        this.fluidHashGrid.initialize(this.particles);

        // this.emitter =this.createParticleEmitter(
        //     this.ctx,
        //     new Vector2(canvas.width/2, 100),
        //     new Vector2(0, 1),
        //     50,
        //     1,
        //     5,
        //     50
        // );

        this.rotate = true;

        let circle = new Circle(this.ctx,new Vector2(350,550), 100, "orange");
        let circle2 = new Circle(this.ctx,new Vector2(450,400), 50, "orange");

        let polygon = new Polygon(this.ctx,[
           
            new Vector2(40,320),
            new Vector2(40,300),
            new Vector2(300,350),
            new Vector2(300,370),
          
            
        ],  "orange")


        let polygon1 = new Polygon(this.ctx,[
           
            new Vector2(300,320),
            new Vector2(300,300),
            new Vector2(600,250),
            new Vector2(600,270),
                     
        ],  "orange")

        // let polygon = new Polygon(this.ctx,[
        //     new Vector2(600,600),
        //     new Vector2(800,600),
        //     new Vector2(600,700),
        //     new Vector2(600,700),
        //     new Vector2(500,700)
        // ],  "orange")
 
        this.shapes.push(circle);
        this.shapes.push(circle2);
        this.shapes.push(polygon);
        this.shapes.push(polygon1);

    }

    handleStickyness(dt){
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            for (let j = 0; j < this.shapes.length; j++) {
                let nearstVec = this.shapes[j].getNearestVector(particle.position, this.MAX_STICKY_DISTANCE);
                if(nearstVec != null && nearstVec.Length2() >= 0){
                    let disctance = nearstVec.Length();
                    let stickyTerm = dt * this.K_STICK * disctance * (1- disctance/this.MAX_STICKY_DISTANCE) * -1;
                    nearstVec.Normalize()
                    let stikyVector = Vector2.Scale(nearstVec, stickyTerm);
                    particle.position = Vector2.Add(particle.position,stikyVector);
                }
            }
        }
    } 


    handleOneWayCoupling(){
        for (let i = 0; i < this.particles.length; i++) {
           let particle = this.particles[i];
           for (let j = 0; j < this.shapes.length; j++) {
                let dir = this.shapes[j].getDirectionOut(particle.position);
                if(dir != null){
                    particle.position = Vector2.Add(particle.position, dir);
                } 
           }            
        }
    }    
    
    getShapeAt(pos){
        for (let i = 0; i <  this.shapes.length; i++) {
            if(this.shapes[i].isPointInside(pos)){
                return this.shapes[i];
            }
        }

        return null;
    }

    createParticleEmitter(ctx, position, direction, size, spawnInterval, amount, velocity){
        let emitter = new ParticleEmitter(ctx, position, direction, size, spawnInterval, amount, velocity);
        this.particleEmitters.push(emitter);

        return emitter;
    }

    instantiateParticles(){
        let offsetBetweenParticles = 10;
        let offsetAllParticles = new Vector2(100,100);

        let xparticles = Math.sqrt(this.AMOUNT_PARTICLES);
        let yparticles = xparticles;

        for (let x = 0; x < xparticles; x++) {
           for (let y = 0; y <yparticles; y++) {
                let position = new Vector2(x*offsetBetweenParticles + offsetAllParticles.x,
                    y*offsetBetweenParticles + offsetAllParticles.y);
               
               this.particles.push(new Particle(position));
               //this.particles[this.particles.length-1].color = "#25b0ff";   
               this.particles[this.particles.length-1].color = "rgb(50 165 255)";                     
            }
        }
    }

    neighbourSearch(mousePos){
        this.fluidHashGrid.clearGrid();
        this.fluidHashGrid.mapParticleToCell();     
    }

    // Algorithm 1 
    update(dt,mousePos){
       
       
        if(this.rotate){
            // if(this.particleEmitters.length){
            //     this.particleEmitters[0].spawn(dt, this.particles);
            //     this.emitter.rotate(0.01 * Math.random());  
            // }           
        }  

       this.applyGravity(dt); // line 1 - 3
       this.viscosity(dt);
       this.predictPosition(dt);// line 6 - 10
            
       this.neighbourSearch(mousePos); 
       
       this.adjustSprings(dt);
       this.springDisplacement(dt); 

       this.doubleDensityRelaxation(dt); // line 16
      
       this.handleStickyness(dt);
       this.handleOneWayCoupling();

       this.worldBoundary();
       
       this.couputeNextVelocity(dt);// line 18 - 20
    }

    adjustSprings(dt){
        for (let i = 0; i < this.particles.length; i++) {
            let neigbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            let particleA = this.particles[i];

            for (let j = 0; j < neigbours.length; j++) {
                
                let particleB = this.particles[neigbours[j]];
                if(particleA == particleB) continue;

                let springId = i + neigbours[j] * this.particles.length;
                 if(this.springs.has(springId)){
                        continue;
                     }
                
                let rij = Vector2.Sub(particleB.position , particleA.position);
                let rijLength = rij.Length();
                let q = rijLength / this.INTERACTION_RADIUS;

                if(q < 1){
                    //let newSpring = new Spring(i,neigbours[j], this.INTERACTION_RADIUS);
                    let newSpring = new Spring(i,neigbours[j], rijLength);
                    this.springs.set(springId, newSpring);
                }
            }            
        }

        for (let [key,spring] of this.springs) {
            let pi = this.particles[spring.particleAIdx];
            let pj = this.particles[spring.particleBIdx];

            let rij = Vector2.Sub(pi.position, pj.position).Length();
            let Lij = spring.length;
            let d = this.GAMMA * Lij;

            if(rij > Lij + d){
                spring.length += dt * this.PLASTICITY * (rij - Lij - d);
            }else if(rij < Lij - d){
                spring.length -= dt * this.PLASTICITY * (Lij - d - rij);
            }

            if(spring.length > this.INTERACTION_RADIUS){
                this.springs.delete(key);    
            }
        }
    }

    springDisplacement(dt){
        let dtSquared = dt * dt;

        for(let [key,spring] of this.springs){
            let pi = this.particles[spring.particleAIdx];
            let pj = this.particles[spring.particleBIdx];
           
            let rij = Vector2.Sub(pi.position, pj.position);
            let distanse = rij.Length();

            if(distanse < 0.0001){
                continue;
            }

            rij.Normalize();
            let displacementTerm = dtSquared * this.SPRING_STIFFNESS * 
            (1 - spring.length/this.INTERACTION_RADIUS) * (spring.length - distanse);

            rij = Vector2.Scale(rij, displacementTerm * 0.5);
            pi.position = Vector2.Add(pi.position, rij);
            pj.position = Vector2.Sub(pj.position, rij);

        }
    }


    viscosity(dt){
        for (let i = 0; i < this.particles.length; i++) {
           let neigbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
           let particleA = this.particles[i];
           
           for (let j = 0; j < neigbours.length; j++) {
                let particleB = this.particles[neigbours[j]];
                if(particleA == particleB) {continue};

                let rij = Vector2.Sub(particleB.position , particleA.position);
                let velocityA = particleA.velocity;
                let velocityB = particleB.velocity;
                let q = rij.Length()/ this.INTERACTION_RADIUS;

                if(q < 1){
                    rij.Normalize();
                    let u = Vector2.Sub(velocityA,velocityB).Dot(rij);

                    if(u > 0){
                        let ITerm = dt * (1-q) * (this.SIGMA * u + this.BETA  * u * u);
                        let I = Vector2.Scale(rij, ITerm);

                        particleA.velocity = Vector2.Sub(particleA.velocity, Vector2.Scale(I, 0.5));
                        particleB.velocity = Vector2.Add(particleB.velocity, Vector2.Scale(I, 0.5));
                    }

                }

           }
        }
    }

    worldBoundary(){
        for (let i = 0; i < this.particles.length; i++) {
             let p =this.particles[i];
             let pos = p.position;
             let prevPos = p.prevPosotion;
             
             if(pos.x < 0 + p.size * 0.5 ){
                p.position.x = p.size * 0.5; 
                this.particles[i].velocity.x *= -1; 
             }
             if(pos.y < 0 + p.size * 0.5){
                p.position.y = p.size * 0.5; 
                this.particles[i].velocity.y *= -1;
             }
             if(pos.x > this.canvas.width - p.size * 0.5){
                p.position.x = this.canvas.width - p.size * 0.5; 
                this.particles[i].velocity.x *= -1;
             } 
             if(pos.y > this.canvas.height -  p.size * 0.5){
                p.position.y = this.canvas.height - p.size * 0.5; 
                this.particles[i].velocity.y *= -1;
             }
            
        }
    }

    predictPosition(dt){
        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].prevPosotion = this.particles[i].position.Copy();
          this.particles[i].position = Vector2.Add(this.particles[i].position, 
            Vector2.Scale(this.particles[i].velocity, dt * this.VELOCITY_DAMPING));
        }
    }

    couputeNextVelocity(dt){
        for (let i = 0; i < this.particles.length; i++) {
           let p = this.particles[i]; 
           p.velocity = Vector2.Scale(Vector2.Sub(p.position, p.prevPosotion), 1/ dt );           
        }
    }

    applyGravity(dt){
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i]; 
            p.velocity = Vector2.Add(p.velocity, Vector2.Scale(this.GRAVITY, dt));           
         }
	}

    doubleDensityRelaxation(dt){
        for (let i = 0; i < this.particles.length; i++) {
            
            let density = 0;
            let densityNear = 0;
            let neigbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
            let particleA = this.particles[i];

            for (let j = 0; j < neigbours.length; j++) {
                let particleB =this.particles[neigbours[j]];
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
                let particleB = this.particles[neigbours[j]];
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

        console.log(this.particles.length)

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            let colorV = p.velocity.Copy();
            let colorI = colorV.Length() * 0.05;
            let R = 255 * colorI;
            let G = 165 + 165 * colorI;
            let B = 255 - R;  
            p.color = `rgb(`+ R + ` `+G+` `+ B+`)`;
            DrawUtils.drawPoint(this.ctx,p.position, p.size, p.color)
     
        }

        for (let i = 0; i < this.particleEmitters.length; i++) {
           this.particleEmitters[i].draw();     
        }

        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].draw();     
         }

       
    }
}