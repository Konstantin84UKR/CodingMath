import {Vector} from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

let particles = [];

for (let index = 0; index < 100; index++) {
    ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
  let p = new Particle(
     width / 2,
     height / 2,
     Math.random() * 10,
     Math.random() * Math.PI * 2,
     0.1
   );
   p.radius = Math.random() * 10 + 5;
   p.bounce = -0.8;
   p.color = `rgb(${Math.random() * 255},${Math.random() * 255},${
       Math.random() * 255
     })`;

   particles.push(p);
}

// let p = new Particle(
//   width / 2,
//   height / 2,
//   Math.random() * 10,
//   Math.random() * Math.PI * 2,
//   0.1
// );
//  p.radius = Math.random() * 10 + 5;
//  p.bounce = -0.8;

// let p1 = new Particle(
//   width / 2,
//   height / 2,
//   Math.random() * 20,
//   Math.random() * Math.PI * 2,
//   0.1
// );

// p1.radius = Math.random() * 10 + 5;
// p1.bounce = -0.9; 

const friction = 0.97;


update();

function update() {
     
   ctx.clearRect(0, 0, width, height);
      
   //////////////////////
   particles.forEach(p=>{
    p.update();
    ctx.beginPath();
    //ctx.fillStyle = "#ff8855";
    ctx.fillStyle = p.color;
    ctx.arc(p.position.getX(),p.position.getY(),p.radius,0,Math.PI*2,false);
    ctx.fill();
    edgeDetect(p);
   })


  

   
   requestAnimationFrame(update);
}


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

