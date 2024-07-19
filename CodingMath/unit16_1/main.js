import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

const k = 0.01;
const grav = 0.5;

const springPoint = new Vector(width / 2, height / 2);
const particleA = new Particle(Math.random() * width, Math.random() * height, 50,  Math.random() * Math.PI * 2, grav);
particleA.radius = 20;
particleA.friction = 0.9;

const particleB = new Particle(Math.random() * width, Math.random() * height, 50,  Math.random() * Math.PI * 2, grav);
particleB.radius = 20;
particleB.friction = 0.9;

const particleC = new Particle(Math.random() * width, Math.random() * height, 50,  Math.random() * Math.PI * 2, grav);
particleC.radius = 20;
particleC.friction = 0.9;

const particleD = new Particle(Math.random() * width, Math.random() * height, 50,  Math.random() * Math.PI * 2, grav);
particleD.radius = 20;
particleD.friction = 0.9;

const springLength = 100;

canvas.addEventListener("mousemove", function(e){
  springPoint.setX(e.clientX - 15);
  springPoint.setY(e.clientY - 15);
})

update();

function update() {
  
  ctx.clearRect(0, 0, width, height);
  
  spring(particleA, particleB, springLength);
  spring(particleB, particleC, springLength);
  spring(particleC, particleA, springLength);
  spring(particleC, particleD, springLength);
  spring(particleD, particleB, springLength);
  spring(particleA, particleD, springLength);
  
  particleA.update();
  particleB.update();
  particleC.update();
  particleD.update();

  paintParticle(particleA);
  paintParticle(particleB);
  paintParticle(particleC);
  paintParticle(particleD);

  paintLine(particleA,particleB);
  paintLine(particleB,particleC);
  paintLine(particleC,particleA);
  paintLine(particleC,particleD);
  paintLine(particleD,particleB);
  paintLine(particleD,particleA);

  edgeDetect(particleA);
  edgeDetect(particleB);
  edgeDetect(particleC);
  edgeDetect(particleD);

  requestAnimationFrame(update);
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
  ctx.fillStyle ='#ff8855';
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
