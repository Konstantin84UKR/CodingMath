import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
let target = document.querySelector("#target");

let ctx = canvas.getContext('2d');

let ctxTarget = target.getContext('2d');
let width = canvas.width = target.width =  800;
let height = canvas.height = target.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

const k = 0.01;
const grav = 0.5;

const particleA = new Particle(0, height / 2, 10, Math.random());
particleA.radius = 4;
particleA.friction = 1.0;

ctxTarget.fillStyle ='#ff8855';
ctxTarget.beginPath();
ctxTarget.arc(width / 2, height / 2, 100, 0, Math.PI * 2, 0);
ctxTarget.fill();

update();

function update() {
  
  ctx.clearRect(0, 0, width, height);
    
  particleA.update();
  edgeDetect(particleA);
  paintParticle(particleA);

  const imageData = ctxTarget.getImageData(particleA.position.getX(), particleA.position.getY(), 1, 1);
  if(imageData.data[3] > 0){
    ctxTarget.globalCompositeOperation = "destination-out";
    ctxTarget.beginPath();
    ctxTarget.arc(particleA.position.getX(), particleA.position.getY(), 30, Math.PI * 2, false);
    ctxTarget.fill();

    reserParticle(particleA);
  }else if( (particleA.position.getX() >= width - particleA.radius) || (particleA.position.getY() >= height - particleA.radius)){
    reserParticle(particleA);
  }

  requestAnimationFrame(update);
}

function reserParticle(p){
  p.position = new Vector(0 , height / 2);
  p.velocity = new Vector(Math.random() * 10 + 5, Math.random() - 0.5);
}

function spring(p0,p1,separation){
  const distans = Vector.subtract(p0.position,p1.position);
  distans.setLength(distans.getLength() - separation);
  distans.multiplyBy(k);
  p0.accelerate(distans.negativ());
  p1.accelerate(distans);
}

function edgeDetect(p) {

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

      p.velocity.multiplyBy(p.friction);
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

function paintParticle(p){
  ctx.fillStyle ='#008855';
  ctx.beginPath();
  ctx.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function paintLine(p0,p1){
  ctx.strokeStyle = '#7777ff';
  ctx.beginPath();
  ctx.moveTo(p0.position.getX(), p0.position.getY());
  ctx.lineTo(p1.position.getX(), p1.position.getY());
  ctx.stroke();
}
