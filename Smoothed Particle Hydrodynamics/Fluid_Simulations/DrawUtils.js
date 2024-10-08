import { Vector2 } from "./Vector2.js";

export class DrawUtils{
    constructor(){

    }

    static drawPoint(ctx, position, radius, color){
        ctx.beginPath();
        ctx.arc(position.x,position.y,radius, 0 , Math.PI *2, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    static strokePoint(ctx, position, radius, color,lineWidth=1){
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0 , Math.PI *2, true);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle  = color;
        ctx.stroke();
        ctx.closePath();
    }

    static drawLine(ctx, startPosition, endPosition, color, lineThickness = 1){
        ctx.beginPath();
        ctx.strokeStyle  = color;
        ctx.lineWidth = lineThickness;
        ctx.moveTo(startPosition.x,startPosition.y);
        ctx.lineTo(endPosition.x, endPosition.y);
        ctx.stroke();
        ctx.closePath();
    }

    static drawRect(ctx, start,size, color){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.rect(start.x, start.y , size.x, size.y);
        ctx.stroke();
        ctx.closePath();
    }

    static drawText(ctx, position, size, color, text){
        ctx.font = size+"px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text,position.x,position.y);
    }

    static Cleare(ctx,canvas, color){
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(0, 0 , canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
    }
}