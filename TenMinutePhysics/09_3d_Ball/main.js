
import { Ball } from "./Ball.js";
import { Grabber } from "./Grabber.js";

function main() {

    let threeScene;
    let renderer;
    let camera;
    let cameraControl;
    let grabber;

    let gMouseDown = false;

    const button = document.querySelector('#buttonRestart');
        button.addEventListener('click', function () {
            location.reload();
    });

    // phisics scene --------------------------------------

    const phisicsScene = {
        gravity: new THREE.Vector3(0.0, -10.0, 0.0),
        dt: 1.0 / 60.0,
        worldSize: { x: 2.0, z: 2.0 },
        pause: false,
        friction: 0.01,
        object: []
    }

    function initPhisics(scene) {
        const ball1 = new Ball(new THREE.Vector3(0, 1, 0), 0.2, new THREE.Vector3(-20.1, 0, 10.0),0x0088ff);
        const ball2 = new Ball(new THREE.Vector3(0, 2, 0), 0.2, new THREE.Vector3(10.0, 10., -10.0),0xff8800);
        
        const ball3 = new Ball(new THREE.Vector3(1, 2, 0), 0.2, new THREE.Vector3(
            (Math.random() -0.5 ) * 2 * 10,
            (Math.random() -0.5 )* 2 * 10,
            (Math.random() -0.5 )* 2 * 10),
            0x008800);

        const ball4 = new Ball(new THREE.Vector3(2, 10, 0), 0.2, new THREE.Vector3(
            (Math.random() -0.5 )* 2* 50,
            (Math.random() -0.5 )* 2* 10,
            (Math.random() -0.5 )* 2* 10),
            0x008800);
        const ball5 = new Ball(new THREE.Vector3(1, 1, 1), 0.2, new THREE.Vector3(15.0, 0, -10.0),0xff8800);

        threeScene.add(ball1.vismesh);
        threeScene.add(ball2.vismesh);
        threeScene.add(ball3.vismesh);
        threeScene.add(ball4.vismesh);
        threeScene.add(ball5.vismesh);


        phisicsScene.object.push(ball1);
        phisicsScene.object.push(ball2);
        phisicsScene.object.push(ball3);
        phisicsScene.object.push(ball4);
        phisicsScene.object.push(ball5);

    }

    function simulate() {
        if (phisicsScene.pause) {
            return;
        }

        for (let i = 0; i < phisicsScene.object.length; i++) {
            phisicsScene.object[i].simulate(phisicsScene);
        }
    }

    // draw -----------------------------------------------
    function initThreeScene() {
        threeScene = new THREE.Scene();

        // Ligths

        // Lights

        threeScene.add(new THREE.AmbientLight(0x505050));
        threeScene.fog = new THREE.Fog(0x000000, 0, 15);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.angle = Math.PI / 5;
        spotLight.penumbra = 0.2;
        spotLight.position.set(2, 3, 3);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 3;
        spotLight.shadow.camera.far = 10;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        threeScene.add(spotLight);

        var dirLight = new THREE.DirectionalLight(0x55505a, 1);
        dirLight.position.set(0, 3, 0);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 10;

        dirLight.shadow.camera.right = 1;
        dirLight.shadow.camera.left = - 1;
        dirLight.shadow.camera.top = 1;
        dirLight.shadow.camera.bottom = - 1;

        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        threeScene.add(dirLight);

        // Geometry

        var ground = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(20, 20, 1, 1),
            new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
        );

        ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        ground.receiveShadow = true;
        threeScene.add(ground);

        var helper = new THREE.GridHelper(20, 20);
        helper.material.opacity = 1.0;
        helper.material.transparent = true;
        helper.position.set(0, 0.002, 0);
        threeScene.add(helper);

        // Renderer

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(0.8 * window.innerWidth, 0.8 * window.innerHeight);
       // window.addEventListener('resize', onWindowResize, false);
        const container = document.querySelector("#container")
        container.appendChild(renderer.domElement);

        // Camera

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.set(0, 1, 4);
        camera.updateMatrixWorld();

        threeScene.add(camera);

        cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
        cameraControl.zoomSpeed = 2.0;
        cameraControl.panSpeed = 0.4;

        grabber = new Grabber(renderer,camera,threeScene,phisicsScene);
        container.addEventListener('pointerdown', onPointer, false);
        container.addEventListener('pointermove', onPointer, false);
        container.addEventListener('pointerup', onPointer, false);
    }
   
   
    const onPointer = (e)=>{
       
        e.preventDefault();
        if (e.type == "pointerdown") {
            grabber.start(e.clientX, e.clientY);
            gMouseDown = true;
            if (grabber.physicsObject) {
                cameraControl.saveState();
                cameraControl.enabled = false;
            }
        }
        else if (e.type == "pointermove" && gMouseDown) {
            grabber.move(e.clientX, e.clientY);
        }
        else if (e.type == "pointerup") {
            if (grabber.physicsObject) {
                grabber.end();
                cameraControl.reset();
            }
            gMouseDown = false;
            cameraControl.enabled = true;
        }
    }; 
   
    // make browser to call us repeatedl ------------------
    function update() {
        simulate();
        renderer.render(threeScene,camera);
        cameraControl.update();

        requestAnimationFrame(update);
    }
    
   
    initThreeScene();
    initPhisics();
    update();

}
main();
