export class Vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    static Zero(){
        return new Vector2(0,0);
    }

    static Add(vecA, vecB) {
        return new Vector2(vecA.x + vecB.x , vecA.y + vecB.y);
    }
    
    static Sub(vecA,vecB){
        return new Vector2(vecA.x - vecB.x , vecA.y - vecB.y)
    }
    
    static Scale(vec, scalar){
        return new Vector2(vec.x * scalar , vec.y * scalar);
    }

    Normalize(){
        let length = this.Length();
        this.x /= length;
        this.y /= length;
    }

    Length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    GetNormal(){
        return new Vector2(this.y, -this.x);
    }

    Dot(vec){
        return this.x * vec.x + this.y * vec.y;
    }

    Copy(){
        return new Vector2(this.x, this.y);
    }

    Log(){
        console.log("Vector2 : ( " + this.x + ", " + this.y + ")");
    }
}

