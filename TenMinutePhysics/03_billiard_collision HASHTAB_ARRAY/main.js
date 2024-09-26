import * as glMatrix from "../common/glm/index.js";

class HashWithMap{
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

	setGridArray(cell, ball) {
		
		let hashCode = this.hashCoords(cell.x, cell.y, 1);
		this.cellStart[hashCode]	+= 1; 
	}

	clearHashSet(){
		this.map.clear();
		this.cellStart.fill(0);
	}

	cellCoords(ball){
		
		let x = Math.max(Math.trunc((ball.pos.x * this.cScale / this.pixelOneCells)),0); //Math.trunc()
		let y = Math.max(Math.trunc((ball.pos.y * this.cScale / this.pixelOneCells)),0);	

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

	getGridArray(cell, ballsArr){
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


function main() {
    // Canvas setup --------------------------------
    
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const simMinWidth = 4.0;
    const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    const simWidth = canvas.width / cScale;
    const simHeight = canvas.height / cScale;
	const tablScale = 20;
	const numBalls = 5000;
	const radiusBall = 0.01;

    function cX(pos) {
        return pos.x * cScale;
    }
    function cY(pos) {
        return canvas.height - pos.y * cScale;
    }
    // vector math -------------------------------------------------------
    class Vector2 {
		constructor(x = 0.0, y = 0.0) {
			this.x = x; 
			this.y = y;
		}

		set(v) {
			this.x = v.x; this.y = v.y;
		}

		clone() {
			return new Vector2(this.x, this.y);
		}

		add(v, s = 1.0) {
			this.x += v.x * s;
			this.y += v.y * s;
			return this;
		}

		addVectors(a, b) {
			this.x = a.x + b.x;
			this.y = a.y + b.y;
			return this;
		}

		subtract(v, s = 1.0) {
			this.x -= v.x * s;
			this.y -= v.y * s;
			return this;
		}

		subtractVectors(a, b) {
			this.x = a.x - b.x;
			this.y = a.y - b.y;
			return this;			
		}

		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}

		scale(s) {
			this.x *= s;
			this.y *= s;
		}

		dot(v) {
			return this.x * v.x + this.y * v.y;
		}
	}

    class Ball{
        constructor(radius, mass, pos, vel,id){
            this.radius = radius;
            this.mass = mass;
            this.pos = pos.clone();
            this.vel = vel.clone();
			this.fillStyle = "#ff8855";
			this.marker = false;
			this.id = id;
        }
        simulate(dt, gravity) {
			this.vel.add(gravity, dt);
			this.pos.add(this.vel, dt);          
		}
    } 
    
    // Scene ---------------------------------------
    let physicsScene = 
	{
		gravity : new Vector2(0,0),
		dt : 1.0 / 60.0,
		worldSize : new Vector2(simWidth,simHeight),
		paused: true,
		balls: [],				
		restitution : .95
	};

    function setupScene(){
        physicsScene.balls = [];
                   
        for (let i = 0; i < numBalls; i++) {
           
            const radius = radiusBall //+ Math.random() * 0.01;
            const mass = Math.PI * radius * radius;
            
            const pos = new Vector2(Math.random() * simWidth, Math.random() * simHeight);
			const f = 1.0;
            const vel = new Vector2((-1.0 + 2.0 * Math.random())*f, (-1.0 + 2.0 * Math.random())*f);
            const id = i;
            physicsScene.balls.push(new Ball(radius, mass, pos, vel,id ));
            
        }

		physicsScene.balls[0].marker = true;
		physicsScene.balls[0].mass *= 5;
		physicsScene.balls[0].radius = radiusBall *2 

    }


	//HASH------------------------------------------

	let hashSet  = new HashWithMap(tablScale,simMinWidth,cScale,numBalls);
	    
    // Drawing -------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid()
        //ctx.fillStyle = "#ff8855";

        for (let i = 0; i < physicsScene.balls.length; i++) {
            const ball = physicsScene.balls[i];
			ctx.fillStyle = ball.fillStyle;

			
			if(ball.marker){
			 	ctx.fillStyle = "#00ffff";
			}
           
			ctx.beginPath();
            ctx.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
            ctx.closePath();
            ctx.fill();
	
        }

    }

	function drawGrid() {
        	

		for (let i = 0; i < hashSet.tableColumns ; i++) {
			for (let j = 0; j < hashSet.tableColumns; j++) {
				
				ctx.fillStyle = "#222222";

				//HASH TEST 
				let HG = hashSet.hashCoords(i , (j - hashSet.tableColumns  + 1) * -1 , 1);
				let b = physicsScene.balls[0];
				let CB = hashSet.cellCoords(b);
				for (let Hx = -1; Hx < 2; Hx++) {
					for (let Hy = -1; Hy < 2; Hy++) {						
						let HB = hashSet.hashCoords(CB.x + Hx, CB.y + Hy, 1);
						if(HG == HB){
							ctx.fillStyle = "#225522";
						}
					}					
				}
				
				const offset = (canvas.width / hashSet.tableColumns  *  0.1) ;
				const celllength =  (canvas.width / hashSet.tableColumns  * 0.8) ;

				ctx.beginPath();
				ctx.fillRect((i * hashSet.pixelOneCells  + offset) , (j * hashSet.pixelOneCells  + offset)  , celllength, celllength);
			}
		}

    }
    // collision handling -------------------------------------------------------
    function handleBallCollision(ball1, ball2, restitution) {

        let dir = new Vector2();
		dir.subtractVectors(ball2.pos, ball1.pos);
		let d = dir.length();
		if (d == 0.0 || d > ball1.radius + ball2.radius)
			return;

		dir.scale(1.0 / d);

		let corr = (ball1.radius + ball2.radius - d) / 2.0;
		ball1.pos.add(dir, -corr);
		ball2.pos.add(dir, corr);

		let v1 = ball1.vel.dot(dir);
		let v2 = ball2.vel.dot(dir);

		let m1 = ball1.mass;
		let m2 = ball2.mass;

		let newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
		let newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);

		ball1.vel.add(dir, newV1 - v1);
		ball2.vel.add(dir, newV2 - v2);

    }
    
    function handleWallCollision(ball, worldSize) 
	{
		if (ball.pos.x < ball.radius) {
			ball.pos.x = ball.radius;
			ball.vel.x = -ball.vel.x;
		}

		if (ball.pos.x > worldSize.x - ball.radius) {
			ball.pos.x = worldSize.x - ball.radius;
			ball.vel.x = -ball.vel.x;
		}

		if (ball.pos.y < ball.radius) {
			ball.pos.y = ball.radius;
			ball.vel.y = -ball.vel.y;
		}

		if (ball.pos.y > worldSize.y - ball.radius) {
			ball.pos.y = worldSize.y - ball.radius;
			ball.vel.y = -ball.vel.y;
		}
	}

    // ------------------------------------------------------

    // Simulation ----------------------------------
    function simulate() {
		
		for (let i = 0; i < physicsScene.balls.length; i++) {
			let ball = physicsScene.balls[i];
			let cell = hashSet.cellCoords(ball);
			ball.fillStyle = "#ff8855";
						
			hashSet.setGridArray(cell, ball);
		}

		// Заполняем пусте ячейки массива хешей
		hashSet.setPartialSumsArray();

		for (let ball_ID = 0; ball_ID < physicsScene.balls.length; ball_ID++) {
			let ball = physicsScene.balls[ball_ID];
			let cell = hashSet.cellCoords(ball);
			hashSet.queryIdsArray(cell,ball_ID);
		}
	
        for (let i = 0; i < physicsScene.balls.length; i++) {
			let ball1 = physicsScene.balls[i];

			ball1.simulate(physicsScene.dt, physicsScene.gravity);
		

			// Проверяем с хешами
			let cell = hashSet.cellCoords(ball1);
			let BallsForTestCollision = [];
			for (let xi = -1; xi < 2; xi++) {

				for (let yj = -1; yj < 2; yj++) {
					
					const Xh = cell.x + xi;
					const Yh = cell.y + yj;
					
					let arr = hashSet.getGridArray({x:Xh,y:Yh},physicsScene.balls);
					BallsForTestCollision.push(arr);
									
				}
			} 
		
			BallsForTestCollision = BallsForTestCollision.flat();
			for (let j = 0; j < BallsForTestCollision.length; j++) {			
				let ball2 = BallsForTestCollision[j];	
				
				if(ball1.marker){
					ball2.fillStyle = "#ffff55";
				}

				handleBallCollision(ball1, ball2, physicsScene.restitution);
			}

			handleWallCollision(ball1, physicsScene.worldSize);		
		}
		
		hashSet.clearHashSet();
	

    }
    // make browser to call repeatedly -------------
    function update() {
        simulate();
		draw();
		requestAnimationFrame(update);
    }
    setupScene();
	//createHashSet(); // HASH
    update();
}
main();
