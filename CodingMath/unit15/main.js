import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';


const k = 0.1;
const springPoint = new Vector(width / 2, height / 2);
const weigth = new Particle(Math.random() * width , Math.random() * height , 50,  Math.random() * Math.PI * 2);
weigth.radius = 20;
weigth.friction = 0.9;

canvas.addEventListener("mousemove", function(e){
  springPoint.setX(e.clientX);
  springPoint.setY(e.clientY);
})

update();

function update() {
  
  ctx.clearRect(0, 0, width, height);
  const distans = Vector.subtract(springPoint,weigth.position);
  distans.multiplyBy(k);
  weigth.accelerate(distans);
  weigth.update();

  ctx.fillStyle ='#ff8855';
  ctx.beginPath();
  ctx.arc(weigth.position.getX(), weigth.position.getY(), weigth.radius, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.fillStyle ='#008855';
  ctx.beginPath();
  ctx.arc(springPoint.getX(), springPoint.getY(), 10, 0, Math.PI * 2, false);
  ctx.fill();  

  ctx.strokeStyle = '#7777ff';
  ctx.beginPath();
  ctx.moveTo(weigth.position.getX(),weigth.position.getY());
  ctx.lineTo(springPoint.getX(),springPoint.getY());
  ctx.stroke();

  requestAnimationFrame(update);
}

