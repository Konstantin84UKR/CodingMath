export class Simulation{
    constructor(canvas){
        this.ctx = canvas.getContext('2d');
    }
    update(dt){
       // console.log('Simulation update');
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.rect(20,20,50,50);
        this.ctx.fillStyle = '#ff8800';
        this.ctx.fill();
        this.ctx.closePath();
    }
}