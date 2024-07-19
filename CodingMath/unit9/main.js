import {Vector} from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
console.log(canvas);

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

let p = new Particle(100, height,20, -Math.PI / 2);
let accel = new Vector(0.1,0.5);

update();

function update() {
     
   ctx.clearRect(0, 0, width, height);
   
   p.accelerate(accel);
   p.update();

   ctx.beginPath();
   ctx.arc(p.position.getX(), p.position.getY(),10, 0, Math.PI * 2, false);
   ctx.fill();
   
   requestAnimationFrame(update);
}


// document.body.addEventListener("mousemove",(e)=>{
//     dx = e.clientX - arrowX; 
//     dy = e.clientY - arrowY;
//     angle = Math.atan2(dy,dx); 
// })

