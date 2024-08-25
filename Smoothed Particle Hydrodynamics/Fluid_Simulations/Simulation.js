import { Particle } from "./Particle.js";
import { Vector2 } from "./Vector2.js";
import { DrawUtils } from './DrawUtils.js'
import { FluidHashGrid } from './FluidHashGrid.js'

export class Simulation{
    constructor(canvas){
        this.canvas = canvas; 
        this.ctx = canvas.getContext('2d');
        this.fluidHashGrid = new FluidHashGrid(25);


        this.particles = [];
        this.AMOUNT_PARTICLES = 1000;
        this.VELOCITY_DAMPING = 1;
        
        this.instantiateParticles();
        this.fluidHashGrid.initialize(this.particles);
    }

    instantiateParticles(){
        let offsetBetweenParticles = 15;
        let offsetAllParticles = new Vector2(750,100);

        let xparticles = Math.sqrt(this.AMOUNT_PARTICLES);
        let yparticles = xparticles;

        for (let x = 0; x < xparticles; x++) {
           for (let y = 0; y <yparticles; y++) {
                let position = new Vector2(x*offsetBetweenParticles + offsetAllParticles.x,
                    y*offsetBetweenParticles + offsetAllParticles.y);
               
               this.particles.push(new Particle(position));
                    // Почему не заполнить скорость в партикле сразу?
               this.particles[this.particles.length-1].velosity = Vector2.Scale(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()),200);
                                    
            }
        }
    }

    neighbourSearch(mousePos){
        this.fluidHashGrid.clearGrid();
        this.fluidHashGrid.mapParticleToCell();

        //let gridHashId = this.fluidHashGrid.getGridFromPos(mousePos);
        this.particles[0].position = mousePos.Copy();
        let contentOfCell = this.fluidHashGrid.getNeighbourOfParticleIdx(0);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].color = "#25b0ff";
        }

        if (contentOfCell !== undefined) {
            for (let i = 0; i < contentOfCell.length; i++) {
                let particles = contentOfCell[i];
                particles.color = "#FFb000";
            }
        }
      
    }

    // Algorithm 1 
    update(dt,mousePos){
       // console.log('Simulation update');
       this.applyGravity(dt); // line 1 - 3
       //this.predictPosition(dt);// line 6 - 10
       this.neighbourSearch(mousePos); 
       this.doubleDensityRelaxation(dt); // line 16
      // this.couputeNextVelocity(dt);// line 18 - 20

       this.worldBoundary();
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
          this.particles[i].position = Vector2.Add(this.particles[i].position, Vector2.Scale(this.particles[i].velosity,dt * this.VELOCITY_DAMPING));

        }
    }

    couputeNextVelocity(dt){
        for (let i = 0; i < this.particles.length; i++) {
           let p = this.particles[i]; 
           p.velosity = Vector2.Scale(Vector2.Sub(p.position, p.prevPosotion), 1/ dt );           
        }
    }

    applyGravity(dt){
		
	}

    doubleDensityRelaxation(dt){
		
	}


    draw(){

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i]
            DrawUtils.drawPoint(this.ctx,p.position, p.size,  p.color)
            
        }
       
    }
}