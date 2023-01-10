import {Vector} from './Vector.js';



/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
console.log(canvas);

let ctx = canvas.getContext('2d');
let width = canvas.width = 450;
let height = (canvas.height = 300);

ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';
update();

function update() {
     
   ctx.clearRect(0, 0, width, height);
     
   
   requestAnimationFrame(update);
}


// document.body.addEventListener("mousemove",(e)=>{
//     dx = e.clientX - arrowX; 
//     dy = e.clientY - arrowY;
//     angle = Math.atan2(dy,dx); 
// })

