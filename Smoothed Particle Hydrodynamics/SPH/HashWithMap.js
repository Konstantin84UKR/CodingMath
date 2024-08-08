import {vec2} from '../../common/wgpu-matrix.module.js';

export class HashWithMap{
	constructor(tablScale,simMinWidth,cScale){
		
		this.tablScale = tablScale;
		this.map = new Map();		
		this.tableColumns = tablScale * simMinWidth;
		this.cells = tablScale * tablScale;
		this.pixelOneCells = cScale / tablScale;
		this.cScale = cScale;

	}
    	
	hashCoords(xi, yi, zi) {


		if(xi == undefined){
			zi= 1;
		}

		if(yi == undefined){
			zi= 1;
		}
	
		var h = 'x'+xi+'y'+yi;	// fantasy function
		return h; 
	}


	getGrid(cell) {
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		if(this.map.has(hashCode)){
			return this.map.get(hashCode)	
		}else{
			let arr = [];
			this.map.set(hashCode , arr);
			return this.map.get(hashCode)	
		}	
	}

	setGrid(cell, ball) {
		
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		let arr = [];
		if(this.map.has(hashCode)){
			arr = this.getGrid(cell);
			arr.push(ball);	
		}else{
			arr.push(ball);	
			this.map.set(hashCode , arr);
		}		
	}

	clearHashSet(){
		this.map.clear();
	}

	cellCoords(ball){
		
		let x = Math.max(Math.trunc((ball.pos[0] * this.cScale / this.pixelOneCells)),0); //Math.trunc()
		let y = Math.max(Math.trunc((ball.pos[1] * this.cScale / this.pixelOneCells)),0);	

		return {x,y}
	}
	
    setPartialSumsArray(){

    }

    queryIdsArray(){

    }
}
