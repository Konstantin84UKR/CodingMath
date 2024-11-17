import { Vector2 } from "./Vector2.js";
import { Simulation } from "./Simulation.js";

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext("2d");

    // ctx.beginPath();
    // ctx.rect(20,40,50,50);
    // ctx.fillStyle = '#FF5500';
    // ctx.fill();
    // ctx.closePath();

let currentTime = 0;
let dt = 0; 
let lastTime = 0; 

let mousePos = [0,0];
let mouseDownLeft = false;
let mouseDownRigth = false;

let simulation = new Simulation(ctx,new Vector2(canvas.width,canvas.height));

function getMousePos(canvas,e){
    let rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }

}



function addEventListener(){
  canvas.addEventListener('mousemove',(e)=>{
    const mouse = getMousePos(canvas,e);
    mousePos = [mouse.x,mouse.y];

   // console.log(mouse)
})

window.addEventListener('mousedown',(e)=>{
    if(e.button == 0) mouseDownLeft = true;
    if(e.button == 1) mouseDownRigth = true;

    //console.log(mouseDownLeft)
})

window.addEventListener('mouseup',(e)=>{
    if(e.button == 0) mouseDownLeft = false;
    if(e.button == 1) mouseDownRigth = false;

   // console.log(mouseDownLeft)
})

window.addEventListener('keydown',	function(e){
    simulation.onKeyboardPressed(e);
},false);  
}

addEventListener();
mainLoop();

function updateSimulation(dt) {
   
    simulation.update(dt);
    simulation.draw();

}

function clear(){
    ctx.fillStyle = "#575757";
    ctx.fillRect(0,0,canvas.width,canvas.height);	
}


function mainLoop() {
    window.requestAnimationFrame(mainLoop);  

    //CleanScreen
    clear();
    //TIME
    currentTime = performance.now();
    dt = (currentTime - lastTime) /1000;
    lastTime = currentTime;

    //SIMULATION
    updateSimulation(dt);
}
