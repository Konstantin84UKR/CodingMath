import {vec2} from '../../common/wgpu-matrix.module.js';

export class HashTable{
	constructor(tablScale,simMinWidth,cScale,numBalls){
		
		this.tablScale = tablScale;
		this.map = new Map();		
		this.tableColumns = tablScale * simMinWidth;
		this.cells = tablScale * tablScale;
		this.pixelOneCells = cScale / tablScale;
		this.cScale = cScale;

		this.arrCount = new Int32Array(this.tablScale * this.tablScale);
		
		this.arrPartialSums = [];
		this.arrMain = [];

		this.tableSize = 2 * numBalls;
		this.cellStart = new Int32Array(this.cells + 1);
		this.cellEntries = new Int32Array(this.cells + 1);
		this.queryIds = new Int32Array(numBalls);
		this.querySize = 0;

	}

	hashCoords(xi, yi, zi) {

		xi = Math.trunc(xi);
		yi = Math.trunc(yi);
		zi = Math.trunc(zi);

		var h = (xi * 92837111) ^ (yi * 689287499) ^ (zi * 283923481);	// fantasy function
		return Math.abs(h) % this.cells; 
	}

	setGrid(cell, ball) {
		
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		this.cellStart[hashCode]	+= 1; 
	}

	clearHashSet(){
		this.map.clear();
		this.cellStart.fill(0);
	}

	cellCoords(ball){
		
		// let x = Math.max(Math.trunc((ball.pos.x * this.cScale / this.pixelOneCells)),0); //Math.trunc()
		// let y = Math.max(Math.trunc((ball.pos.y * this.cScale / this.pixelOneCells)),0);	

		let x = Math.max(Math.trunc((ball.pos[0] * this.cScale / this.pixelOneCells)),0); //Math.trunc()
		let y = Math.max(Math.trunc((ball.pos[1] * this.cScale / this.pixelOneCells)),0);	

		return {x,y}
	}

	setPartialSumsArray(){
		let entrie = 0;

		for (let index = 0; index < this.cellStart.length -1; index++) {
			this.cellEntries[index] = this.cellStart[index] + entrie; 	
			entrie += this.cellStart[index];		
		}
	}

	queryIdsArray(cell,ball_ID){
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		this.cellEntries[hashCode] -= 1; 
		const indexID = this.cellEntries[hashCode];
		this.queryIds[indexID] = ball_ID;
	}

	getGrid(cell, ballsArr){
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		const indexOfCell = this.cellEntries[hashCode];
		const countOfCell = this.cellStart[hashCode];

		const arrIDofCell = this.queryIds.slice(indexOfCell, indexOfCell + countOfCell);
        let arrBalls = [] 
		for (let index = 0; index < arrIDofCell.length; index++) {
			const ballindex =arrIDofCell[index];
			const ball = ballsArr[ballindex];
			arrBalls.push(ball);
		}

		return arrBalls;
	}
	
}