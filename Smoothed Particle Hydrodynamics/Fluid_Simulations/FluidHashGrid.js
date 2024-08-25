export class FluidHashGrid{
    constructor(cellSize){
        this.hashMap = new Map();
        this.particles = [];
        this.hashMapSize = 10000000;
        this.p1Prime = 6614058611;
        this.p2Prime = 6614058611;
        this.cellSize = cellSize;
        }

    initialize(particles){
        this.particles = particles;
    }    

    clearGrid(){
        this.hashMap.clear();
    }

    getGridFromPos(pos){
        let x = parseInt(pos.x/this.cellSize);
        let y = parseInt(pos.y/this.cellSize);
        
        return this.cellIndexToHash(x,y);
    }

    getGridHashFromPos(pos){
        let x = parseInt(pos.x/this.cellSize);
        let y = parseInt(pos.y/this.cellSize);
        
        return this.cellIndexToHash(x,y);
    }

    cellIndexToHash(x,y){
        let hash = (x* this.p1Prime ^ y * this.p2Prime)% this.hashMapSize;
        return hash;
    }

    getNeighbourOfParticleIdx(i){
        let neigbours = [];
        let pos = this.particles[i].position;

        let particleGridX = parseInt(pos.x/this.cellSize);
        let particleGridY = parseInt(pos.y/this.cellSize);

        for (let x = -1; x <= 1; x++){
            for (let y = -1; y <= 1; y++){
                let gridX = particleGridX + x; 
                let gridY = particleGridY + y; 

                let hashId = this.cellIndexToHash(gridX,gridY);
                let content = this.getContentofCell(hashId);

                neigbours.push(...content);
            }            
        }

        return neigbours;
    }

    getContentofCell(id){
        let content = this.hashMap.get(id);

        if(content == [] || content == undefined){
            return [];
        }else{
            return content;
        }
    }

    mapParticleToCell(){
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            let pos = p.position;
           
            let hash = this.getGridHashFromPos(pos);
            let entries = this.hashMap.get(hash);
           
            if(entries == null){
                let newArray = [this.particles[i]];
                this.hashMap.set(hash,newArray);
            }else{
                entries.push(this.particles[i]);
            }

        }
    }
}