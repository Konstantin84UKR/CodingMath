console.log("Hello")
/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
console.log(canvas);

let ctx = canvas.getContext('2d');
let width = canvas.width = 450;
let height = (canvas.height = 300);

//ctx.fillRect(0,0,width,height);
ctx.strokeStyle = '#ff8855';
ctx.fillStyle ='#ff8855';
//ctx.scale(1,-1);
ctx.translate(0, height / 2);
for (let angel = 0; angel < Math.PI * 2; angel+=0.001) {
     let x = angel * 200;
     let y = Math.sin(angel*10) * 100;  
     ctx.fillRect(x, y, 5, 5);
}



