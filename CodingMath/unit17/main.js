import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';

const k = 0.05;
const grav = 0.5;
const radius = 5;

// const springPoint = new Vector({x: width / 2, y: height / 2});
const particleA = new Particle({
  x: Math.random() * width, 
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2, 
  grav});
particleA.radius = radius;
particleA.friction = 0.9;

const particleB = new Particle({
  x: Math.random() * width, 
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2, 
  grav});
particleB.radius = radius;
particleB.friction = 0.9;

const particleC = new Particle({
  x: Math.random() * width, 
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2, 
  grav});
particleC.radius = radius;
particleC.friction = 0.9;

const particleD = new Particle({
  x: Math.random() * width, 
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2, 
  grav});
particleD.radius = radius;
particleD.friction = 0.9;

const springLength = 100;

// canvas.addEventListener("mousemove", function(e){
//   springPoint.setX(e.clientX - 15);
//   springPoint.setY(e.clientY - 15);
// })

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

  edgeDetect(particleA);
  edgeDetect(particleB);
  edgeDetect(particleC);
  edgeDetect(particleD);

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

  requestAnimationFrame(update);
}

function spring(p0,p1,separation){

  const dx = p0.x - p1.x;
  const dy = p0.y - p1.y;
  const distansSQ = dx * dx + dy * dy;
  const distans = Math.sqrt(distansSQ);
  const springForce = (distans - separation) * k;
  
  const ax = ((dx == 0) ?  1 :  dx / distans) * springForce;
  const ay = ((dy == 0) ?  0 :  dy / distans) * springForce;

  p0.vx += ax * -1; 
  p0.vy += ay * -1; 
  p1.vx += ax; 
  p1.vy += ay;
}

function edgeDetect(p) {

  if (p.x + p.radius > width) {
    p.x = (width - p.radius);
    p.vx = p.vx * p.bounce;
  }
  if (p.x - p.radius < 0) {
    p.x = (p.radius);
    p.vx =p.vx * p.bounce;
  }
  if (p.y + p.radius > height) {
    p.y = (height - p.radius);

    const distVelocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (distVelocity > 0.1) {

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy *= p.bounce;

    } else {
      p.vx = 0;
      p.vy = 0;
    }
  }
  if (p.y - p.radius < 0) {
    p.y = (p.radius);
    p.vy = p.bounce * p.vy;
  }
}

function paintParticle(p){
  ctx.fillStyle ='#ff8855';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function paintLine(p0,p1){
  ctx.strokeStyle = '#7777ff';
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}
