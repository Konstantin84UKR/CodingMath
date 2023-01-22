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
const weigth = new Particle(Math.random() * width, Math.random() * height, 50,  Math.random() * Math.PI * 2, 0.5);
weigth.radius = 20;
weigth.friction = 0.9;
const springLength = 100;


canvas.addEventListener("mousemove", function(e){
  springPoint.setX(e.clientX - 15);
  springPoint.setY(e.clientY - 15);
})



update();

function update() {
  
  ctx.clearRect(0, 0, width, height);
  const distans = Vector.subtract(springPoint,weigth.position);
  distans.setLength(distans.getLength() - springLength);
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

  //  ctx.strokeStyle = '#7777ff';
  // ctx.beginPath();
  // ctx.moveTo(weigth.position.getX(),weigth.position.getY());
  // ctx.lineTo(springPoint.getX(),springPoint.getY());
  // ctx.stroke();


  springStrokeDraw({ x: weigth.position.getX(), y: weigth.position.getY() }, { x: springPoint.getX(), y: springPoint.getY() });
  //springStrokeDraw({ x: 100, y: 200 }, { x: 200, y: 100 });

  requestAnimationFrame(update);
}

function springStrokeDraw(p1,p2) {
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

  for (let i = 0.3; i < 1 - 0.2; i = i + 0.1) {
    
    let step = i;
    let sizeSegment = Math.min(0.2 * k * k, 0.2);

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