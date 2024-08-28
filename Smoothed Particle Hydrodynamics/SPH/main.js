import { vec2 } from '../../common/wgpu-matrix.module.js';
//import { HashTable } from './HashTable.js';
import { HashWithMap as HashTable } from './HashWithMap.js';
import { Particle } from './Particle.js';



function main() {
    // Canvas setup --------------------------------
    
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    const simMinWidth = 3.0;
    const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    const simWidth = canvas.width / cScale;
    const simHeight = canvas.height / cScale;
	const tablScale = 20;

	const numBalls = 2000;
	const radiusBall = 0.02;

	const radiusKernel = 0.04;

	const radiusKernelSq = radiusKernel * radiusKernel;

	const stiffness = 0.07;
	const stiffnessNear = 0.03;

	const restDensity = 1000;

	const mouseCoord = vec2.create();
	const rect = canvas.getBoundingClientRect();

    function cX(pos) {
       // return pos.x * cScale;

		return pos[0] * cScale;
    }
    function cY(pos) {
        return canvas.height - pos[1] * cScale;
    }

	function drawingToPhysics(v){	
		return vec2.create(v[0] / cScale, simMinWidth - v[1] / cScale);		
	}

	canvas.addEventListener('mousemove',(e)=>{
        //console.log(e)

        mouseCoord[0] = e.clientX - rect.left; 
        mouseCoord[1]  = e.clientY - rect.top;
        
        //console.log(mouseX + ' ' + mouseY)
    })
    // vector math -------------------------------------------------------
      
    // Scene ---------------------------------------
    let physicsScene = 
	{
		gravity : vec2.create(0, -1.0),
		dt : 1.0 / 60.0,
		worldSize :vec2.create(simWidth,simHeight),
		paused: true,
		balls: [],				
		restitution : .95
	};

    function setupScene(){
        physicsScene.balls = [];
                   
        for (let i = 0; i < numBalls; i++) {
           
            const radius = radiusBall //+ Math.random() * 0.01;
            const mass = Math.PI * radius * radius;
            
            const pos = vec2.create((Math.random() + 0.2) * simWidth * 0.5,(Math.random() + 0.5) * simHeight* 0.3);//   new Vector2(Math.random() * simWidth, Math.random() * simHeight);
		   	const vel = vec2.create(); 
            const id = i;
            physicsScene.balls.push(new Particle(radius, mass, pos, vel,id ));
            
        }

		physicsScene.balls[0].marker = true;
		physicsScene.balls[0].mass *= 5;
		physicsScene.balls[0].radius = radiusBall *2 

    }


	//HASH------------------------------------------

	let hashSet  = new HashTable(tablScale,simMinWidth,cScale,numBalls);
	    
    // Drawing -------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		//drawGrid()
        //ctx.fillStyle = "#ff8855";

        for (let i = 0; i < physicsScene.balls.length; i++) {
            const ball = physicsScene.balls[i];
			ctx.fillStyle = ball.fillStyle;
			
			let R = ball.density / 0.005;
			let V = Math.abs((ball.vel[0] +  ball.vel[1]) / 0.01);
		//	ctx.fillStyle = `rgba(${R},128,${256-R},1.0)`;
			
			if(ball.marker){
			 	ctx.fillStyle = "#ff0000";
			}else if(ball.fillStyle == "#ffff55"){
				ctx.fillStyle = ball.fillStyle;
			}else{
				ctx.fillStyle = `rgba(${R + V},${128 + V},${256 - R + V},1.0)`;
				//ctx.fillStyle = "#2288ff";
			}
           
			
			
			ctx.beginPath();
            ctx.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
		    ctx.closePath();
            ctx.fill();
	
        }

		mouseDraw();

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

	function mouseDraw() {
       		 ctx.beginPath();
            ctx.arc(mouseCoord[0], mouseCoord[1], 10, 0, Math.PI * 2);
			//ctx.arc(cX(mouseCoord), cY(mouseCoord), cScale * radiusBall * 10, 0.0, 2.0 * Math.PI);
            ctx.fillStyle = `rgba(128,256,128,0.9)`;
            ctx.fill();

    }
    // collision handling -------------------------------------------------------
     
    function handleWallCollision(ball, worldSize){
	

		if (ball.pos[0] < ball.radius) {
			ball.pos[0] = ball.radius;
			ball.vel[0] = -ball.vel[0];
		}

		if (ball.pos[0] > worldSize[0] - ball.radius) {
			ball.pos[0] = worldSize[0]- ball.radius;
			ball.vel[0] = -ball.vel[0];
		}

		if (ball.pos[1] < ball.radius) {
			ball.pos[1]= ball.radius;
			ball.vel[1] = -ball.vel[1];
		}

		if (ball.pos[1] > worldSize[1] - ball.radius) {
			ball.pos[1] = worldSize[1] - ball.radius;
			ball.vel[1] = -ball.vel[1];
		}
	}

	function findNeibors(ball1){
	
		// Проверяем с хешами
		let cell = hashSet.cellCoords(ball1);
		let BallsForTestCollision = [];
		for (let xi = -1; xi < 2; xi++) {

			for (let yj = -1; yj < 2; yj++) {

				const Xh = cell.x + xi;
				const Yh = cell.y + yj;

				let arr = hashSet.getGrid({ x: Xh, y: Yh }, physicsScene.balls);
				BallsForTestCollision.push(arr);

			}
		}

		BallsForTestCollision = BallsForTestCollision.flat();

		return BallsForTestCollision;
	}

	function mouseColisions() {

        for (let i = 0; i < physicsScene.balls.length; i++) {
            const partical_A = physicsScene.balls[i];
			
			const dir = vec2.sub(partical_A.pos,drawingToPhysics(mouseCoord));
			const dist = vec2.length(dir);
            
			if(dist < 0.2){
                const dirNormal = vec2.scale(vec2.normalize(dir),0.003);
                vec2.add(partical_A.pos, dirNormal, partical_A.pos);                
            }

        }    

    }

	function computeColision(){
	
		for (let i = 0; i < physicsScene.balls.length; i++) {
			const partical_A = physicsScene.balls[i];
			handleWallCollision(partical_A, physicsScene.worldSize);		
		}
		mouseColisions();

	}
	

    // SPH ------------------------------------------------------
	function applyGravity(){
		
		for (let i = 0; i < numBalls; i++) {
            //applyGravity
			const partical_A = physicsScene.balls[i];
			vec2.add(partical_A.vel, vec2.scale(physicsScene.gravity,physicsScene.dt), partical_A.vel);

			// //setPrevPos
            // partical_A.posPrev = vec2.clone(partical_A.pos);
			// partical_A.pos = vec2.add(partical_A.pos, vec2.scale(partical_A.vel,physicsScene.dt)); 
         
        }   
	}

	function applyVel(){
		for (let i = 0; i < numBalls; i++) {
            const partical_A = physicsScene.balls[i];
			//setPrevPos
            partical_A.posPrev = vec2.clone(partical_A.pos);
			partical_A.pos = vec2.add(partical_A.pos, vec2.scale(partical_A.vel,physicsScene.dt)); 
         
        }  
	}

	function computeDensityPressure() {
      
        for (let i = 0; i < numBalls; i++) {
            const partical_A= physicsScene.balls[i];
          
            
            partical_A.density = 0;
            partical_A.densityNear = 0;
			const BallsForTestCollision = findNeibors(partical_A);
			
			for (let j = 0; j < BallsForTestCollision.length; j++) {
                let partical_B = BallsForTestCollision[j];				
            
                if(partical_A === partical_B){
                    continue;
                }

				
				// let dist = vec2.distance(partical_B.pos, partical_A.pos)
                // let Q = dist / radiusKernel;
				
				const dist = vec2.distanceSq(partical_B.pos, partical_A.pos);
				const Q = dist / (radiusKernelSq);
				const invertQ = (1 - Q )
                if (1 > Q ) {
					
				   const paw2 =	Math.pow(invertQ,2)	
                   partical_A.density +=  paw2;//Math.pow((1 - Q ),2);
                   partical_A.densityNear +=  paw2 + invertQ;//Math.pow((1 - Q ),3);
                }
            }
            partical_A.pressure = stiffness * (partical_A.density - restDensity);
            partical_A.pressureNear = stiffnessNear * (partical_A.densityNear);
        }
	}

	function computeForces() {
       
        for (let i = 0; i < numBalls; i++) {
           
            const partical_A = physicsScene.balls[i];

			const BallsForTestCollision = findNeibors(partical_A);
          
			let F = vec2.create();

            for (let j = 0; j < BallsForTestCollision.length; j++) {
               
                    const partical_B = BallsForTestCollision[j];

                    if(partical_B === partical_A){
                        continue;
                    }

                    //let deltaXY = vec2.subtract(partical_B.pos,partical_A.pos);				                   
					//let dist = vec2.distance(partical_B.pos, partical_A.pos);

					const dist = vec2.distanceSq(partical_B.pos, partical_A.pos);
					const Q = dist / (radiusKernelSq);
                    
                    if (1 > Q ) {

						const invertQ = (1 - Q );
                                      
                        const deltaXY = vec2.subtract(partical_B.pos,partical_A.pos);		
						const deltaNormalXY = vec2.normalize(deltaXY);                        
                        const D = (partical_A.pressure * (invertQ ) + partical_A.pressureNear * Math.pow((invertQ ),2)) * physicsScene.dt * physicsScene.dt * 0.99;
                        
						partical_B.pos = vec2.add(partical_B.pos , vec2.scale(deltaNormalXY, -D * 0.5));
                        F = vec2.add(F,vec2.scale(deltaNormalXY, D * 0.5));

						// if(partical_A.marker){
						// 	partical_B.fillStyle = "#ffff55";
						// }

                    }

					if(partical_A.marker){
						partical_B.fillStyle = "#ffff55";
					}


               
            }           
            partical_A.pos = vec2.add(partical_A.pos,F);
        }
    }

	function computeVelocity() {
        for (let i = 0; i < numBalls; i++) {
            const partical_A = physicsScene.balls[i];
          
			let vel = vec2.subtract(partical_A.pos, partical_A.posPrev);
			partical_A.vel =  vec2.scale(vel,1/physicsScene.dt);
       
        }  
    }
	
	function springDisplacements() {
		for (let i = 0; i < numBalls; i++) {
            const partical_A= physicsScene.balls[i];
          
            
            partical_A.density = 0;
            partical_A.densityNear = 0;
			const BallsForTestCollision = findNeibors(partical_A);
			let F = vec2.create();

			for (let j = 0; j < BallsForTestCollision.length; j++) {
                const partical_B = BallsForTestCollision[j];				
            
                if(partical_A === partical_B){
                    continue;
                }
				
				const distSq = vec2.distanceSq(partical_B.pos, partical_A.pos);
				const Q = distSq / (radiusKernelSq);
				
				if (1 > Q ) {
					
					const deltaXY = vec2.subtract(partical_B.pos,partical_A.pos);		
					const deltaNormalXY = vec2.normalize(deltaXY); 
					const dist = vec2.distance(partical_B.pos, partical_A.pos);
					const invertQ = (1 - Q );

					const k = 0.9;
					const D =  physicsScene.dt * physicsScene.dt * k * (invertQ) * (dist - 0);
					
					partical_B.pos = vec2.add(partical_B.pos , vec2.scale(deltaNormalXY, D * 0.5));
					F = vec2.add(F,vec2.scale(deltaNormalXY, -D * 0.5));
				}											
            } 			
			partical_A.pos = vec2.add(partical_A.pos,F);
        }
	}
	//Hash -----------------------------------
	function computeHashTable(){
		
		for (let i = 0; i < physicsScene.balls.length; i++) {
			let ball = physicsScene.balls[i];
			let cell = hashSet.cellCoords(ball);
			ball.fillStyle = "#ff8855";
						
			hashSet.setGrid(cell, ball);
		}

		// Заполняем пусте ячейки массива хешей
		hashSet.setPartialSumsArray();

		for (let ball_ID = 0; ball_ID < physicsScene.balls.length; ball_ID++) {
			let ball = physicsScene.balls[ball_ID];
			let cell = hashSet.cellCoords(ball);
			hashSet.queryIdsArray(cell,ball_ID);
		}

	}

	function clearHash(){
		hashSet.clearHashSet();
	}
    
	// Simulation ----------------------------------
	function simulate() {
				
		computeHashTable();

		applyGravity();
		applyVel();

		springDisplacements(); 
		
		//doubleDensityRelaxation
		computeDensityPressure();
		computeForces();
		

		computeColision();
		computeVelocity();
		
		clearHash();
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
