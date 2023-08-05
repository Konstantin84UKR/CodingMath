
function main() {
    // Canvas setup --------------------------------
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const simMinWidth = 20.0;
    const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    const simWidth = canvas.width / cScale;
    const simHeight = canvas.height / cScale;

    function cX(pos) {
        return pos.x * cScale;
    }
    function cY(pos) {
        return canvas.height - pos.y * cScale;
    }
    // Scene ---------------------------------------
    const gravity = { x: 0.0, y: -10.0 };
    const timeStep = 1.0 / 60.0;

    const ball = {
        radius: 0.2,
        pos: { x: 0.2, y: 0.2 },
        vel: { x: 10.0, y: 15.0 }
    };
    // Drawing -------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff8855";

        ctx.beginPath();
        ctx.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    // Simulation ----------------------------------
    function simulation() {

        ball.vel.x += gravity.x * timeStep;
        ball.vel.y += gravity.y * timeStep;

        ball.pos.x += ball.vel.x * timeStep;
        ball.pos.y += ball.vel.y * timeStep;

        if (ball.pos.x < 0.0) {
            ball.pos.x = 0.0;
            ball.vel.x = -ball.vel.x;
        }

        if (ball.pos.x > simWidth) {
            ball.pos.x = simWidth;
            ball.vel.x = -ball.vel.x;
        }

        if (ball.pos.y < 0.0) {
            ball.pos.y = 0.0;
            ball.vel.y = -ball.vel.y;
        }
    }
    // make browser to call repeatedly -------------
    function update() {
        simulation();
        draw();
        requestAnimationFrame(update);
    }
    update();
}
main();
