import {Vector} from './Vector.js';



/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
console.log(canvas);

let ctx = canvas.getContext('2d');
let width = canvas.width = 450;
let height = (canvas.height = 300);

//ctx.fillRect(0,0,width,height);

let v1 = new Vector(10,50);
let v2 = new Vector(20,-10);
let v = new Vector(0,0);

let v3 = Vector.add(v1, v2);

console.log(v3);

let arrowX = width/2;
let arrowY = height/2;

let dx = 0;
let dy = 0;

let angle = 0;

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';
render();

function render() {
     
   ctx.clearRect(0, 0, width, height);
   
   ctx.save();
   ctx.translate(arrowX,arrowY);
   ctx.rotate(angle);

   ctx.beginPath();
   ctx.moveTo(20,0);
   ctx.lineTo(-20,0);
   ctx.moveTo(20, 0);
   ctx.lineTo(10, -10);
   ctx.moveTo(20, 0);
   ctx.lineTo(10, 10);

   ctx.stroke();
   ctx.restore();
   
   requestAnimationFrame(render);
}


document.body.addEventListener("mousemove",(e)=>{
    dx = e.clientX - arrowX; 
    dy = e.clientY - arrowY;
    angle = Math.atan2(dy,dx); 
})

