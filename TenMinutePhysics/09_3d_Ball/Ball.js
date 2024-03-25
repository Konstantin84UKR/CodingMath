export class Ball{
    constructor(pos,radius,vel,color){
        this.pos = pos;
        this.radius = radius;
        this.vel = vel;
        this.color = color;
        this.grabbed = false;
        
        const geometry = new THREE.SphereGeometry(radius,32,32);
        const material = new THREE.MeshPhongMaterial({color: this.color});
        this.vismesh = new THREE.Mesh(geometry,material);
        this.vismesh.position.copy(pos);
		this.vismesh.userData = this;		// for raycasting
		this.vismesh.layers.enable(1);
    }

    simulate(physicsScene){

        if (this.grabbed) 	return;

        this.vel.addScaledVector(physicsScene.gravity, physicsScene.dt);
        this.vel.multiplyScalar( 1 - physicsScene.friction);
        this.pos.addScaledVector(this.vel, physicsScene.dt);

        if (this.pos.x < -physicsScene.worldSize.x) {
            this.pos.x = -physicsScene.worldSize.x; this.vel.x = -this.vel.x;
        }
        if (this.pos.x >  physicsScene.worldSize.x) {
            this.pos.x =  physicsScene.worldSize.x; this.vel.x = -this.vel.x;
        }
        if (this.pos.z < -physicsScene.worldSize.z) {
            this.pos.z = -physicsScene.worldSize.z; this.vel.z = -this.vel.z;
        }
        if (this.pos.z >  physicsScene.worldSize.z) {
            this.pos.z =  physicsScene.worldSize.z; this.vel.z = -this.vel.z;
        }
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius; this.vel.y = -this.vel.y;
        }

        this.vismesh.position.copy(this.pos);
        this.vismesh.geometry.computeBoundingSphere();
    }

    startGrab(pos) 
        {
            this.grabbed = true;
            this.pos.copy(pos);
            this.vismesh.position.copy(pos);
        }
    
    moveGrabbed(pos, vel) 
        {
            this.pos.copy(pos);
            this.vismesh.position.copy(pos);
        } 
    
    endGrab(pos, vel) 
        {
            this.grabbed = false;
            this.vel.copy(vel);
        }   
        
    }