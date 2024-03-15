//import * as glMatrix from "../common/glm/index.js";
//import { copy } from "../common/glm/mat2.js";


function main() {
	// Canvas setup --------------------------------

	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas");
	canvas.width = 600;
	canvas.height = 600;
	const ctx = canvas.getContext('2d');

	const simMinWidth = 1.0;
	const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
	const simWidth = canvas.width / cScale;
	const simHeight = canvas.height / cScale;

	const center = {x: 0 , y: -200 };

	const lengths = [0.2, 0.2, 0.2, 0.2];
    const masses = [1.0, 0.5, 0.3, 0.2];
    const angles = [0.5 * Math.PI, Math.PI, Math.PI, Math.PI];

	function cX(pos) { return (center.x + (canvas.width / 2)) + pos.x * cScale; }
	function cY(pos) { return (center.y +(0.5 * canvas.height)) - pos.y * cScale; }
	// ----------------------------------------------------------------------
	class Pendulum {
        constructor(masses, lengths, angles) {
			this.masses = [0.0];
            this.lengths = [0.0];
            this.pos = [{x:0.0, y:0.0}];
            this.prevPos = [{x:0.0, y:0.0}];
            this.vel = [{x:0.0, y:0.0}];
			
			let x = 0.0, y = 0.0;
			for (let i = 0; i < masses.length; i++) {
				
				this.masses.push(masses[i]);
				this.lengths.push(lengths[i]);

				x += lengths[i] * Math.sin(angles[i]);
				y += lengths[i] * -Math.cos(angles[i]);

				this.pos.push({ x:x, y:y});
                this.prevPos.push({ x:x, y:y});
                this.vel.push({x:0, y:0});
			}
		}
		
		simulate(dt,gravity){
			let p = this;
			
			for (let i = 1; i < p.masses.length; i++) {
				
				p.vel[i].y += dt * gravity;
				
				p.prevPos[i].x = p.pos[i].x;
				p.prevPos[i].y = p.pos[i].y;
				
                p.pos[i].x += p.vel[i].x * dt;
                p.pos[i].y += p.vel[i].y * dt;
			}	

            //--------------
			for (let i = 1; i < p.masses.length; i++) {

				let dx = p.pos[i].x - p.pos[i-1].x;
				let dy = p.pos[i].y - p.pos[i-1].y;	
				
				let d = Math.sqrt(dx * dx + dy * dy);
				
				let w0 = p.masses[i-1] > 0 ? 1 /p.masses[i-1]: 0;
				let w1 = p.masses[i] > 0 ? 1 /p.masses[i]: 0;

				let corr = (p.lengths[i] - d) / d / (w0 + w1);

				p.pos[i-1].x -= w0 * corr * dx;
				p.pos[i-1].y -= w0 * corr * dy;
				
				p.pos[i].x += w1 * corr * dx;
				p.pos[i].y += w1 * corr * dy;
			}

			for (let i = 1; i < p.masses.length; i++) {
				p.vel[i].x = (p.pos[i].x - p.prevPos[i].x)/dt;	
				p.vel[i].y = (p.pos[i].y - p.prevPos[i].y)/dt;				
			}
 			//--------------
			
		}
	
	}

	// Scene ---------------------------------------
	let physicsScene =
	{
		gravity:  -9.78,
		dt: 0.01,  //1.0 / 60.0,
		numSteps : 100,
		pendulum : new Pendulum(masses, lengths, angles)
	};

	function setupScene() {		

	}

	// Drawing -------------------------------------
	function drawcircle(pos,radius,filled) {
		ctx.beginPath();
		ctx.arc(
			cX(pos),cY(pos), cScale * radius , 0.0 ,Math.PI * 2
		)
		ctx.closePath();
		if(filled){
			ctx.fill();
		}else{
			ctx.stroke();
		}
	}

	function drawLine(start,end,lineWidth, color) {
		
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo( cX(start), cY(start));
		ctx.lineTo( cX(end), cY(end));
		ctx.lineWidth =  cScale * lineWidth;
		ctx.stroke();
	}
	
	function draw() {
				
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		 
		let p = physicsScene.pendulum;
		
		for (let i = 1; i < p.masses.length; i++) {
			let start = p.pos[i-1];
			let end = p.pos[i]			
			drawLine(start,end, 0.01 , "#5588ff");
		}
		
		for (let i = 0; i < p.masses.length; i++) {
			ctx.fillStyle = "#FF8855";
			let start = p.pos[i];
			let radius = p.masses[i];	
			drawcircle(start, radius * 0.01 + 0.01, true)			
		}	
		
	}
	
	// ------------------------------------------------------
    
	// Simulation ----------------------------------
	function simulate() {
		let sdt = physicsScene.dt / physicsScene.numSteps;
        for (let step = 0; step < physicsScene.numSteps; step++){
			physicsScene.pendulum.simulate(sdt, physicsScene.gravity);
		} 	
	}

	// make browser to call repeatedly -------------
	function update() {
		simulate();
		draw();
		requestAnimationFrame(update);
	}
	setupScene();
	update();
}
main();
