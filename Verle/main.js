import { Vector } from './Vector.js';
import { Particle } from "./Particle.js";
import { Stick } from "./Stick.js";

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
const  particleCount = 50;
let particles = [];
let sticks = [];
const springLength = 200;

// for (let index = 0; index < particleCount; index++) {

//     const particle = new Particle({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       speed: 50,
//       direction: Math.random() * Math.PI * 2,
//       grav
//     });
//     particle.radius = radius;
//     particle.friction = 0.97;

//     particles.push(particle);
  
// }

particles.push(new Particle({
  x: 100,
  y: 100,
  speed: 50,
  direction: Math.random() * Math.PI * 2,
  grav
}));
particles.push(new Particle({x: 200, y: 100}));
particles.push(new Particle({x: 200, y: 200}));
particles.push(new Particle({x: 100, y: 200}));

// sticks
sticks.push(new Stick(particles[0], particles[1]))
sticks.push(new Stick(particles[1], particles[2]))
sticks.push(new Stick(particles[2], particles[3]))
sticks.push(new Stick(particles[3], particles[0]))
sticks.push(new Stick(particles[3], particles[1]))
sticks.push(new Stick(particles[0], particles[2]))


canvas.addEventListener("mousemove", function (e) {

  MouseX = e.clientX - radius
  MouseY = e.clientY - radius

  let m = new Vector(MouseX,MouseY);

  if (Mousedown) {
    
    if (particleA.distanceToVector(m) <= radius) {

      sellectParticle(particleA,m);

    } else if (particleB.distanceToVector(m) <= radius) {
      sellectParticle(particleB,m);

    } else if (particleC.distanceToVector(m) <= radius) {
      sellectParticle(particleC,m);

    } else if (particleD.distanceToVector(m) <= radius) {

      sellectParticle(particleD,m);
    }
  }


})

canvas.addEventListener("mousedown", function (e) {

  Mousedown = true;
})

canvas.addEventListener("mouseup", function (e) {

  Mousedown = false;

  particles.forEach(element => {
    element.sellect = false;
  });
  
})

update();

function update() {

  ctx.clearRect(0, 0, width, height);

  // spring(particles[0], particles[1], springLength);
  // spring(particles[1], particles[2], springLength);
  // spring(particles[2], particles[3], springLength);


  // spring(particleC, particleD, springLength);
  // spring(particleD, particleB, springLength);
  // spring(particleA, particleD, springLength);

  for (let index = 0; index < 2; index++) {
    particles.forEach(particle => {
      particle.update();
      edgeDetect(particle);
    });

    sticks.forEach(stick => {
      stick.update();
    })
  }

  particles.forEach(particle => {
    paintParticle(particle);
  });

  sticks.forEach(stick => {
    paintLine(stick.startPoint, stick.endPoint);
  })


  // particleA.update();
  // particleB.update();
  // particleC.update();
  // particleD.update();

  // edgeDetect(particleA);
  // edgeDetect(particleB);
  // edgeDetect(particleC);
  // edgeDetect(particleD);

  // paintParticle(particleA);
  // paintParticle(particleB);
  // paintParticle(particleC);
  // paintParticle(particleD);

  // paintLine(particles[0], particles[1]);
  // paintLine(particles[1], particles[2]);
  // paintLine(particles[2], particles[3]);
  // paintLine(particleC, particleD);
  // paintLine(particleD, particleB);
  // paintLine(particleD, particleA);

  requestAnimationFrame(update);
}

function spring(p0, p1, separation) {

  const distans = p0.distanceTo(p1);
  const springForce = (distans - separation) * k;

  const delta = Vector.subtract(p0.position,p1.position);
  delta.divideBy(distans);
  delta.multiplyBy(springForce);
  
  p1.accelerate(delta);
  delta.multiplyBy(-1);
  p0.accelerate(delta);
}

function edgeDetect(p) {

  if (p.position.getX() + p.radius > width) {
    p.position.setX(width - p.radius);
    p.velocity.setX(p.velocity.getX() * p.bounce);
    if(isNaN(p.velocity._x)){
      let s =5;
    }
  }
  if (p.position.getX() - p.radius < 0) {
    p.position.setX(p.radius);
    p.velocity.setX(p.velocity.getX() * p.bounce);
    if(isNaN(p.velocity._x)){
      let s =5;
    }
  }
  if (p.position.getY() + p.radius > height) {
    p.position.setY(height - p.radius);

    const distVelocity = p.velocity.getLength();//  Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (distVelocity > 0.1) {
      
      p.velocity.multiplyBy(p.friction);
      p.velocity._y *= p.bounce;

    } else {
      p.velocity.setX(0);
      p.velocity.setY(0); 
    }

    if(isNaN(p.velocity._x)){
      let s =5;
    }
  }
  if (p.position.getY() - p.radius < 0) {
    p.position.setY(p.radius);
    p.velocity.setY(p.bounce *  p.velocity.getY());
    if(isNaN(p.velocity._x)){
      let s =5;
    }
  }
}

function paintParticle(p) {
  ctx.fillStyle = '#ff8855';
  ctx.beginPath();
  ctx.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function paintLine(p0, p1) {
  ctx.strokeStyle = '#7777ff';
  ctx.beginPath();
  ctx.moveTo(p0.position.getX(), p0.position.getY());
  ctx.lineTo(p1.position.getX(), p1.position.getY());
  ctx.stroke();

  // springStrokeDraw(p0.position, p1.position);
}


function springStrokeDraw(p1, p2) {
  ctx.strokeStyle = '#7777ff';
  // console.log("Start")

  // flat line
  // ctx.strokeStyle = '#7777ff';
  // ctx.beginPath();
  // ctx.moveTo(p1.x, p1.y);
  // ctx.lineTo(p2.x, p2.y);
  // ctx.stroke();

  // const xMid = (p2.x - p1.x)
  // const yMid = (p2.y - p1.y)

  const mid = Vector.subtract(p2,p1);
  const newLength = mid.getLength();

  // const newLength = Math.sqrt(xMid * xMid + yMid * yMid);

  const k = springLength / newLength;

  // rotation on 90 grad 
  // ctx.beginPath();
  // ctx.moveTo(p1.x, p1.y);
  // ctx.lineTo(p1.x - yMid, p1.y + xMid);
  // ctx.stroke();

  let p1Start = Vector.add(p1,Vector.multiplyByScalar(mid,0.1))
  let p1End = Vector.add(p1,Vector.multiplyByScalar(mid,0.9))

  ctx.beginPath();
  ctx.moveTo(p1.getX(), p1.getY());
  ctx.lineTo(p1Start.getX(), p1Start.getY());

  for (let i = 0.2; i < 1 - 0.2; i = i + 0.1) {

    let step = i;
    let lengthSegment = 0.1;
    let sizeSegment = Math.min(lengthSegment * k * k, lengthSegment);

    let newp1 = Vector.add(p1,Vector.multiplyByScalar(mid,step));
    let a1 = Vector.multiplyByScalar(mid,sizeSegment) 
    let a2 = Vector.multiplyByScalar(mid,step) 
    
    a1._y *= -1;
    let a3 = new Vector(a1._y,a1._x);

    let newp2 = Vector.add(p1, Vector.add(a3,a2) );
    let delta = Vector.subtract(newp2,newp1);
    delta.multiplyBy(0.5);

    let springPoint1 = Vector.subtract(newp1,delta)
    let springPoint2 = Vector.subtract(newp2,delta)

    ctx.lineTo(springPoint1.getX(), springPoint1.getY());
    ctx.lineTo(springPoint2.getX(), springPoint2.getY());

  }
  ctx.lineTo(p1End.getX(), p1End.getY());
  ctx.lineTo(p2.getX(), p2.getY());

  ctx.stroke();


}

function sellectParticle(p,m){
  p.position = m;
  p.sellect = true;
  p.velocity = new Vector(0,0);
  if(isNaN(p.velocity._x)){
    let s =5;
  }
} 