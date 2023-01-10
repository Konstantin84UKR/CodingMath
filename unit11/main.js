import {Vector} from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

let sun = new Particle(width / 2, height / 2,0,0);
let planet = new Particle(width / 2 + 200, height / 2, 10.0, -Math.PI/2);

sun.mass = 20000; 

update();

function update() {
     
   ctx.clearRect(0, 0, width, height);
   
   planet.gravityTo(sun);
   planet.update();

   ctx.beginPath();
   ctx.fillStyle = "#ff8855";
   ctx.arc(sun.position.getX(), sun.position.getY(), 20, 0, Math.PI*2,false);
   ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#00FFFF";
    ctx.arc(
      planet.position.getX(),
      planet.position.getY(),
      5,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
   
   requestAnimationFrame(update);
}


// document.body.addEventListener("mousemove",(e)=>{
//     dx = e.clientX - arrowX; 
//     dy = e.clientY - arrowY;
//     angle = Math.atan2(dy,dx); 
// })

