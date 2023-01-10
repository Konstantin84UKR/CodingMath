import {Vector} from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

let MouseX = 0;
let MouseY = 0;

let particles = [];

for (let index = 0; index < 20; index++) {
    ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
  let p = new Particle(width / 2, height / 2, 0, 0.0, 0.0);
   p.radius = 5;//Math.random() * 10 + 5;
   p.bounce = -0.8;
   p.color = `rgb(${Math.random() * 255},${Math.random() * 255},${
       Math.random() * 255
     })`;

   particles.push(p);
}

const friction = 0.97;


let particles2 = [];
for (let index = 0; index < 20; index++) {
  ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
  let p = new Particle(width / 2, height / 2, 0, 0.0, 0.0);
  p.radius = 5;
  p.bounce = -0.8;
  p.color = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;

  particles2.push(p);
}

update();

function update() {
     
   ctx.clearRect(0, 0, width, height);

    particles2.forEach((p,i)=>{
      ctx.strokeStyle = "#ff8855";
      if(i == 0){

        p.position.setX(MouseX);
        p.position.setY(MouseY);   
             
       
      }else if(p.distanceTo(particles2[i-1]) > 25){
         p.lerp(particles2[i-1].position,0.3);
      }   

      ctx.beginPath();
      ctx.fillStyle = "#ff8855";
      //ctx.fillStyle = p.color;
      ctx.arc(
        p.position.getX() - p.radius,
        p.position.getY() - p.radius,
        p.radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      
      if(i != 0){
        ctx.moveTo(p.position.getX() - p.radius, p.position.getY() - p.radius);
        ctx.lineTo(
          particles2[i - 1].position.getX() - particles2[i - 1].radius,
          particles2[i - 1].position.getY() - particles2[i - 1].radius
        );
        ctx.stroke();
      }

      edgeDetect(p);

    });


   //////////////////////
    for (let i = particles.length - 1; i >= 0; i--) {
     
    let p = particles[i]; 
    let p0 = new Vector(MouseX, MouseY);  
    if(i){
       p0 = new Vector(
         particles[i - 1].position._x,
         particles[i - 1].position._y
       ); 
    } 
    p.lerp(p0,0.9);

   

    ctx.beginPath();
    ctx.fillStyle = "#00bb00";
    //ctx.fillStyle = p.color;
    ctx.arc(
      p.position.getX() - p.radius,
      p.position.getY() - p.radius,
      p.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
    
    ctx.strokeStyle = "#00bb00";
    if (i != particles.length - 1) {
      ctx.moveTo(p.position.getX() - p.radius, p.position.getY() - p.radius);
      ctx.lineTo(
        particles[i + 1].position.getX() - particles[i + 1].radius,
        particles[i + 1].position.getY() - particles[i + 1].radius
      );
      ctx.stroke();
    }
   
    edgeDetect(p);
    }  

   requestAnimationFrame(update);
}

document.body.addEventListener("mousemove", (e) => {
  MouseX = e.clientX
  MouseY = e.clientY 
  //angle = Math.atan2(dy, dx);
});

function edgeDetect(p){
   
    if (p.position.getX() + p.radius > width) {
      p.position.setX(width - p.radius);
      p.velocity = new Vector(p.velocity.getX() * p.bounce, p.velocity.getY());
    }
    if (p.position.getX() - p.radius < 0) {
      p.position.setX(p.radius);
      p.velocity = new Vector(p.velocity.getX() * p.bounce, p.velocity.getY());
    }
    if (p.position.getY() + p.radius > height) {
      p.position.setY(height - p.radius);
      if (p.velocity.getLength() > 0.1) {

       p.velocity.multiplyBy(friction);
       p.velocity = new Vector(p.velocity.getX(), p.velocity.getY() * p.bounce);
      } else {
        p.velocity = new Vector(0, 0);
      }
    }
    if (p.position.getY() - p.radius < 0) {
      p.position.setY(p.radius);
      p.velocity = new Vector(p.velocity.getX(), p.bounce * p.velocity.getY());
    }
}

