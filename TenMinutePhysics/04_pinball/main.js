import * as glMatrix from "../common/glm/index.js";


function main() {
	// Canvas setup --------------------------------

	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas");
	canvas.width = 600;
	canvas.height = 600;
	const ctx = canvas.getContext('2d');

	const simMinWidth = 10.0;
	const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
	const simWidth = canvas.width / cScale;
	const simHeight = canvas.height / cScale;

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
		perp() {
			return new Vector2(-this.y, this.x);
		}
		negativ() {
			return new Vector2(-this.x, -this.y);
		}
		normalize(){
			let L = this.length();
			this.x = this.x / L;
			this.y = this.y / L;
		}
	}
	// ----------------------------------------------------------------------

	function closestPointOnSegment(p, a, b) {
		let ab = new Vector2();
		ab.subtractVectors(b, a);
		let t = ab.dot(ab);
		if (t == 0.0) {
			return a.clone();
		}

		//t = Math.max(0.0, Math.min(1.0, (p.dot(ab) - a.dot(ab)) / t));
		let ap = new Vector2();
		ap.subtractVectors(p, a);

		t = ab.dot(ap);


		const closest = a.clone();
		return closest.add(b, t);
	}


	class Ball {
		constructor(radius, mass, pos, vel, restitution) {
			this.radius = radius;
			this.mass = mass;
			this.restitution = restitution;
			this.pos = pos.clone();
			this.vel = vel.clone();
			this.sleep = false;
		}
		simulate(dt, gravity) {

			this.vel.add(gravity, dt);
		    this.vel.scale(physicsScene.friction)	
			this.pos.add(this.vel, dt);
		}
	}

	class Obstacle {
		constructor(radius, pos, pushVel) {
			this.radius = radius;
			this.pos = pos.clone();
			this.pushVel = pushVel;
		}
	}

	class Flipper {
		constructor(radius, pos, length, restAngle, maxRotation,
			angularVelocity, restitution) {
			// fixed
			this.radius = radius;
			this.pos = pos.clone();
			this.length = length;
			this.restAngle = restAngle;
			this.maxRotation = Math.abs(maxRotation);
			this.sign = Math.sign(maxRotation);
			this.angularVelocity = angularVelocity;
			// changing
			this.rotation = 0.0;
			this.currentAngularVelocity = 0.0;
			this.touchIdentifier = -1;
		}

		simulate(dt) {
			var prevRotation = this.rotation;
			var pressed = this.touchIdentifier >= 0;
			if (pressed)
				this.rotation = Math.min(this.rotation + dt * this.angularVelocity,
					this.maxRotation);
			else
				this.rotation = Math.max(this.rotation - dt * this.angularVelocity,
					0.0);
			this.currentAngularVelocity = this.sign * (this.rotation - prevRotation) / dt;
		}
		select(pos) {
			var d = new Vector2();
			d.subtractVectors(this.pos, pos);
			return d.length() < this.length;
		}

		getTip() {
			var angle = this.restAngle + this.sign * this.rotation;
			var dir = new Vector2(Math.cos(angle), Math.sin(angle));
			var tip = this.pos.clone();
			return tip.add(dir, this.length);
		}

	}

	// Scene ---------------------------------------
	let physicsScene =
	{
		gravity: new Vector2(0, -9.78),
		dt: 1.0 / 60.0,
		worldSize: new Vector2(simWidth, simHeight),
		paused: true,
		border: [],
		balls: [],
		obstacles: [],
		restitution: 0.5,
		score: 0,
		friction: 0.99,
	};

	function setupScene() {
		
		physicsScene.score = 0;

		// border
		physicsScene.border.push(new Vector2(0.05 * cScale, 0.05 * cScale));
		physicsScene.border.push(new Vector2(0.12 * cScale, 0.06 * cScale));

		// ball
		{
			physicsScene.balls = [];
			const numBalls = 200;

			for (let i = 0; i < numBalls; i++) {

				const radius = 0.1 + Math.random() * 0.01;
				const mass = Math.PI * radius * radius;

				const pos = new Vector2(Math.random() * simWidth, Math.random() * simHeight);
				const vel = new Vector2(-1.0 + 2.0 * Math.random(), -1.0 + 2.0 * Math.random());

				physicsScene.balls.push(new Ball(radius, mass, pos, vel,0.1));

			}
		}
		
		// obstacles 
		{

		}

		// flippers
		{

		}


	}



	// Drawing -------------------------------------
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// border
		if(physicsScene.border.length >= 2){
			ctx.strokeStyle = "#5588ff";
			ctx.lineWidth = 6;

			//ctx.beginPath();
			// var v = physicsScene.border[0];
			// ctx.moveTo(cX(v), cY(v));
			for (var i = 0; i < physicsScene.border.length + 0; i = i + 2) {
				ctx.beginPath();
				var v = physicsScene.border[i];
				ctx.moveTo(cX(v), cY(v));
				v = physicsScene.border[i + 1];
				ctx.lineTo(cX(v), cY(v));
				ctx.stroke();
			}
			//ctx.stroke();	
			ctx.lineWidth = 1;
		}


		ctx.fillStyle = "#ff8855";
		for (let i = 0; i < physicsScene.balls.length; i++) {
			const ball = physicsScene.balls[i];

			ctx.beginPath();
			if(ball.sleep){
				ctx.fillStyle = "#5588ff";
			}else{
				ctx.fillStyle = "#ff8855";
			}
			ctx.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
			ctx.closePath();
			ctx.fill();
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

	function handleWallCollision(ball, worldSize) {
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

	// ---------------------------------------------------------------------
	function handleBallBorderCollision(ball, border) 
	{
		if (border.length < 2)
			return;

		// find closest segment;

		var d = new Vector2();
		var closest = new Vector2();
		var ab = new Vector2();
		var reflect = new Vector2();
		var normal;

		var minDist = 25;
		var radius = 0.50;

		for (var i = 0; i < border.length; i++) {
			var a = border[i];
			var b = border[(i + 1) % border.length];
			var c = closestPointOnSegment(ball.pos, a, b); // ближайшая точка на сегменте к шарика
			d.subtractVectors(ball.pos, c); // вектор от ближайшей точки к центру шарика
			var dist = d.length(); // длина вектора от ближней точки к шарику 
			if (i == 0 ) {
				minDist = dist;
				closest.set(c);
				ab.subtractVectors(b, a);
				normal = ab.perp();
			}
		}

		// // push out
		d.subtractVectors(ball.pos, closest);
		var dist = d.length();
		if (dist < (ball.radius + radius)) {
			//d.set(normal);
			// dist = normal.length();

			if(c.x > ball.pos.x){
				//I - 2.0 * dot(N, I) * N.
				normal.normalize();
				let I =  ball.vel.negativ();
				I.normalize();
				let NdotI = I.dot(normal);
				normal.scale(2.0 * NdotI);
				reflect.subtractVectors(normal, I);

				reflect.scale(0.5); 
				// console.log(ball.vel.length());
				// console.log(reflect);

				ball.vel.x = reflect.x; 
				ball.vel.y = reflect.y;
			}
			else{
				// ball.vel.x *= -1; 
				// ball.vel.y *= -1;
			}


				//ball.vel.add(d, 1);
		}
		// d.scale(1.0 / dist);

		// if (d.dot(normal) >= 0.0) {
		// 	if (dist > (ball.radius)) 
		// 		return;
		// 	ball.pos.add(d, ball.radius - dist);
		// }
		// else
		// 	ball.pos.add(d, -(dist + ball.radius));

		// update velocity
		// var v = ball.vel.dot(d);
		// var vnew = Math.abs(v) * ball.restitution;

		//ball.vel.add(d, vnew - v);
	}


	// ------------------------------------------------------

	// Simulation ----------------------------------
	function simulate() {

		

		for (let i = 0; i < physicsScene.balls.length; i++) {
			var ball = physicsScene.balls[i];
			var ballOldpos = new Vector2(ball.pos.x,ball.pos.y);
			ball.simulate(physicsScene.dt, physicsScene.gravity);

			for (let j = i + 1; j < physicsScene.balls.length; j++) {
				var ball2 = physicsScene.balls[j];
				handleBallCollision(ball, ball2, physicsScene.restitution);
			}

			handleWallCollision(ball, physicsScene.worldSize);
			handleBallBorderCollision(ball, physicsScene.border);

			let posForSleep = new Vector2().subtractVectors(ballOldpos,ball.pos).length();
			if(posForSleep < 0.001){
			   ball.sleep = true;
			}else{
			   ball.sleep = false;
			}
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
