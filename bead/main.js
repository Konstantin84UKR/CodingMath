import { Vector } from './Vector.js';

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext('2d');

let width = canvas.width = 800;
let height = canvas.height = 500;

var simMinWidth = 2.0;
var cScale = Math.min(width, height) / simMinWidth;
var simWidth = width / cScale;
var simHeight = height / cScale;

function cX(pos) {
  return pos.getX() * cScale;
}

function cY(pos) {
  return height - pos.getY() * cScale;
}

// scene -------------------------------------------------------

var physicsScene =
{
  gravity: new Vector(0.0, -10.0),
  dt: 1.0 / 60.0,
  numSteps: 1000,
  paused: false,
  wireCenter: new Vector(),
  wireRadius: 0.0,
  bead: null,
  analyticBead: null
};

// -------------------------------------------------------

class Bead {
  constructor(radius, mass, pos) {
    this.radius = radius;
    this.mass = mass;
    this.pos = pos.clone();
    this.prevPos = pos.clone();
    this.vel = new Vector();
  }
  startStep(dt, gravity) {

    gravity.multiplyBy(dt);
    this.vel.addTo(gravity);

    this.prevPos.setX(this.pos.getX());
    this.prevPos.setY(this.pos.getY());
    this.vel.multiplyBy(dt);
    this.pos.addTo(this.vel);
  }
  keepOnWire(center, radius) {
    var dir = new Vector();
    dir = Vector.subtract(this.pos, center);
    var len = dir.getLength();
    if (len == 0.0)
      return;
    dir.multiplyBy(1.0 / len);
    var lambda = physicsScene.wireRadius - len;
    this.pos.add(dir, lambda);
    return lambda;
  }
  endStep(dt) {
    this.vel = Vector.subtract(this.pos, this.prevPos);
    this.vel.multiplyBy(1.0 / dt);
  }
}

// -------------------------------------------------------

class AnalyticBead {
  constructor(radius, beadRadius, mass, angle) {
    this.radius = radius;
    this.beadRadius = beadRadius;
    this.mass = mass;
    this.angle = angle;
    this.omega = 0.0;
  }
  simulate(dt, gravity) {
    var acc = -gravity / this.radius * Math.sin(this.angle);
    this.omega += acc * dt;
    this.angle += this.omega * dt;

    var centrifugalForce = this.omega * this.omega * this.radius;
    var force = centrifugalForce + Math.cos(this.angle) * Math.abs(gravity);
    return force;
  }
  getPos() {
    return new Vector(
      Math.sin(this.angle) * this.radius,
      -Math.cos(this.angle) * this.radius);
  }
}

// -----------------------------------------------------

function setupScene() {
  physicsScene.paused = true;

  physicsScene.wireCenter.setX(simWidth / 2.0);
  physicsScene.wireCenter.setY(simHeight / 2.0);
  physicsScene.wireRadius = simMinWidth * 0.4;

  var pos = new Vector(
    physicsScene.wireCenter.getX() + physicsScene.wireRadius,
    physicsScene.wireCenter.getY());

  physicsScene.bead = new Bead(0.1, 1.0, pos);

  physicsScene.analyticBead = new AnalyticBead(
  physicsScene.wireRadius, 0.1, 1.0, 0.5 * Math.PI);

  // document.getElementById("force").innerHTML = 0.0.toFixed(3);
  // document.getElementById("aforce").innerHTML = 0.0.toFixed(3);

}

// draw -------------------------------------------------------

function drawCircle(pos, radius, filled) {
  ctx.beginPath();
  ctx.arc(
    cX(pos), cY(pos), cScale * radius, 0.0, 2.0 * Math.PI);
  ctx.closePath();
  if (filled)
    ctx.fill();
  else
    ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FF0000";
  ctx.lineWidth = 4.0;
  drawCircle(physicsScene.wireCenter, physicsScene.wireRadius, false);

  ctx.fillStyle = "#FF0000";

  var bead = physicsScene.bead;
  drawCircle(bead.pos, bead.radius, true);

  ctx.fillStyle = "#00FF00";

  var analyticBead = physicsScene.analyticBead;
  var pos = analyticBead.getPos();
  pos.add(physicsScene.wireCenter);
  drawCircle(pos, analyticBead.beadRadius, true)
}

// ------------------------------------------------

function simulate() {
  //if (physicsScene.paused)
   // return;

  var sdt = physicsScene.dt / physicsScene.numSteps;
  var force, analyticForce;

  for (var step = 0; step < physicsScene.numSteps; step++) {

    physicsScene.bead.startStep(sdt, physicsScene.gravity);

    var lambda = physicsScene.bead.keepOnWire(
      physicsScene.wireCenter, physicsScene.wireRadius);

    force = Math.abs(lambda / sdt / sdt);

    physicsScene.bead.endStep(sdt);

    analyticForce = physicsScene.analyticBead.simulate(sdt, -physicsScene.gravity.getY());
  }

  // document.getElementById("force").innerHTML = force.toFixed(3);
  // document.getElementById("aforce").innerHTML = analyticForce.toFixed(3);
}

// --------------------------------------------------------

function run() {
  physicsScene.paused = false;
}

function step() {
  physicsScene.paused = false;
  simulate();
  physicsScene.paused = true;
}

function update() {
  simulate();
  draw();
  requestAnimationFrame(update);
}

setupScene();
update();

//run();