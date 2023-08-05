console.log("Hello")
/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
console.log(canvas);

let ctx = canvas.getContext('2d');
let width = canvas.width = 450;
let height = (canvas.height = 300);

//ctx.fillRect(0,0,width,height);
ctx.strokeStyle = '#ff8857';
for (let index = 0; index < 100; index++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
}

