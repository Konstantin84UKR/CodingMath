import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 500;

let MouseX = 0;
let MouseY = 0;
let Mousedown = false;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle = '#ff8855';

const k = 0.2;
const grav = 0.5;
const radius = 10;

// const springPoint = new Vector({x: width / 2, y: height / 2});
const particleA = new Particle({
  x: Math.random() * width,
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2,
  grav
});
particleA.radius = radius;
particleA.friction = 0.9;

const particleB = new Particle({
  x: Math.random() * width,
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2,
  grav
});
particleB.radius = radius;
particleB.friction = 0.9;

const particleC = new Particle({
  x: Math.random() * width,
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2,
  grav
});
particleC.radius = radius;
particleC.friction = 0.9;

const particleD = new Particle({
  x: Math.random() * width,
  y: Math.random() * height,
  speed: 50,
  direction: Math.random() * Math.PI * 2,
  grav
});
particleD.radius = radius;
particleD.friction = 0.9;

const springLength = 200;

canvas.addEventListener("mousemove", function (e) {
  // springPoint.setX(e.clientX - 15);
  // springPoint.setY(e.clientY - 15);

  MouseX = e.clientX - radius
  MouseY = e.clientY - radius

  let m = { x: MouseX, y: MouseY };

  if (Mousedown) {
    if (particleA.distanceTo(m) <= radius) {

      particleA.x = MouseX;
      particleA.y = MouseY;
      particleA.sellect = true

    } else if (particleB.distanceTo(m) <= radius) {

      particleB.x = MouseX;
      particleB.y = MouseY;
      particleB.sellect = true

    } else if (particleC.distanceTo(m) <= radius) {

      particleC.x = MouseX;
      particleC.y = MouseY;
      particleC.sellect = true

    } else if (particleD.distanceTo(m) <= radius) {

      particleD.x = MouseX;
      particleD.y = MouseY;
      particleD.sellect = true
    }
  }


})

canvas.addEventListener("mousedown", function (e) {

  Mousedown = true;


})

canvas.addEventListener("mouseup", function (e) {

  Mousedown = false;

  particleA.sellect = false
  particleB.sellect = false
  particleC.sellect = false
  particleD.sellect = false

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

  for (let index = 0; index < 1; index++) {
    particleA.update();
    particleB.update();
    particleC.update();
    particleD.update();
    
  }
  // particleA.update();
  // particleB.update();
  // particleC.update();
  // particleD.update();

  edgeDetect(particleA);
  edgeDetect(particleB);
  edgeDetect(particleC);
  edgeDetect(particleD);

  paintParticle(particleA);
  paintParticle(particleB);
  paintParticle(particleC);
  paintParticle(particleD);

  paintLine(particleA, particleB);
  paintLine(particleB, particleC);
  paintLine(particleC, particleA);
  paintLine(particleC, particleD);
  paintLine(particleD, particleB);
  paintLine(particleD, particleA);

  

  requestAnimationFrame(update);
}

function spring(p0, p1, separation) {

  const dx = p0.x - p1.x;
  const dy = p0.y - p1.y;
  const distansSQ = dx * dx + dy * dy;
  const distans = Math.sqrt(distansSQ);
  const springForce = (distans - separation) * k;

  const ax = ((dx == 0) ? 1 : dx / distans) * springForce;
  const ay = ((dy == 0) ? 0 : dy / distans) * springForce;

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
    p.vx = p.vx * p.bounce;
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

function paintParticle(p) {
  ctx.fillStyle = '#ff8855';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function paintLine(p0, p1) {
  // ctx.strokeStyle = '#7777ff';
  // ctx.beginPath();
  // ctx.moveTo(p0.x, p0.y);
  // ctx.lineTo(p1.x, p1.y);
  // ctx.stroke();

  springStrokeDraw({ x: p0.x, y: p0.y }, { x: p1.x, y: p1.y });
}


function springStrokeDraw(p1, p2) {
  ctx.strokeStyle = '#7777ff';
  console.log("Start")

  // flat line
  // ctx.strokeStyle = '#7777ff';
  // ctx.beginPath();
  // ctx.moveTo(p1.x, p1.y);
  // ctx.lineTo(p2.x, p2.y);
  // ctx.stroke();

  const xMid = (p2.x - p1.x)
  const yMid = (p2.y - p1.y)

  const newLength = Math.sqrt(xMid * xMid + yMid * yMid);

  const k = springLength / newLength;

  // rotation on 90 grad 
  // ctx.beginPath();
  // ctx.moveTo(p1.x, p1.y);
  // ctx.lineTo(p1.x - yMid, p1.y + xMid);
  // ctx.stroke();

  let p1Xstart = p1.x + xMid * 0.1;
  let p1Ystart = p1.y + yMid * 0.1;

  let p1Xend = p1.x + xMid * 0.9;
  let p1Yend = p1.y + yMid * 0.9;

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p1Xstart, p1Ystart);

  for (let i = 0.2; i < 1 - 0.2; i = i + 0.1) {

    let step = i;
    let lengthSegment = 0.1;
    let sizeSegment = Math.min(lengthSegment * k * k, lengthSegment);

    let newp1X = p1.x + xMid * step;
    let newp1Y = p1.y + yMid * step;

    let newp2X = p1.x - yMid * sizeSegment + xMid * step;
    let newp2Y = p1.y + xMid * sizeSegment + yMid * step;

    let deltaX = newp2X - newp1X;
    let deltaY = newp2Y - newp1Y;

    let springPoint1 = { x: newp1X - deltaX * 0.5, y: newp1Y - deltaY * 0.5 }
    let springPoint2 = { x: newp2X - deltaX * 0.5, y: newp2Y - deltaY * 0.5 }

    ctx.lineTo(springPoint1.x, springPoint1.y);
    ctx.lineTo(springPoint2.x, springPoint2.y);

  }
  ctx.lineTo(p1Xend, p1Yend);
  ctx.lineTo(p2.x, p2.y);

  ctx.stroke();

  console.log("Finish")
}