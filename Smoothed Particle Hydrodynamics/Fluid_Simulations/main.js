
import { Simulation } from "./Simulation.js";
import { Playground } from "./Playground.js";
import { Vector2 } from "./Vector2.js";
import { DrawUtils } from "./DrawUtils.js";


function main(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const color =  '#343434';

    let lastTime = performance.now();
    let currentTime = 0;
    let deltaTime = 0;

    let playground = new Playground(canvas);

    mainLoop();

    function updatePlayground(dt){
        DrawUtils.Cleare(ctx,canvas,color);       

        playground.update(0.3);
        playground.draw();
    }

    function mainLoop(){
        window.requestAnimationFrame(mainLoop);
        currentTime = performance.now();
        deltaTime = (currentTime - lastTime)/1000;
        
        updatePlayground(deltaTime);
        lastTime = currentTime;
    }

    function getMousePos(canvas,e){
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function(e){
        let mouse = getMousePos(canvas,e);
        playground.onMouseMove(new Vector2(mouse.x, mouse.y));
    }, false );

    canvas.addEventListener('mousedown', function(e){
       
        playground.onMouseDown(e.button);
    }, false );

    canvas.addEventListener('mouseup', function(e){
      
        playground.onMouseUp(e.button);
    }, false );

}
main();


