import {Vector} from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

let p = new Particle(width / 2, height / 2, 5 , Math.random() * Math.PI * 2,0.1);
 p.radius = 20;
 p.bounce = -0.9;


update();

function update() {
     
   ctx.clearRect(0, 0, width, height);
   
   
   p.update();

   ctx.beginPath();
   ctx.fillStyle = "#ff8855";
   ctx.arc(p.position.getX(), p.position.getY(), 20, 0, Math.PI * 2, false);
   ctx.fill();

   if (p.position.getX() + p.radius > width) {
      p.position.setX(width - p.radius);
      p.velocity = new Vector(p.velocity.getX() * p.bounce, p.velocity.getY());
   }
   if (p.position.getX() - p.radius < 0 ) {
      p.position.setX(p.radius);
      p.velocity = new Vector(p.velocity.getX() * p.bounce, p.velocity.getY());      
   }
   if (p.position.getY() + p.radius > height) {
      p.position.setY(height - p.radius);
      p.velocity = new Vector(p.velocity.getX(), p.bounce * p.velocity.getY());
   }
   if (p.position.getY() - p.radius < 0 ) {
      p.position.setY(p.radius);
      p.velocity = new Vector(p.velocity.getX(), p.bounce*  p.velocity.getY());
   }
   
   
   requestAnimationFrame(update);
}


// document.body.addEventListener("mousemove",(e)=>{
//     dx = e.clientX - arrowX; 
//     dy = e.clientY - arrowY;
//     angle = Math.atan2(dy,dx); 
// })

