export class Ball{
    constructor(pos,radius,vel,color){
        this.pos = pos;
        this.radius = radius;
        this.vel = vel;
        this.color = color;
        
        const geometry = new THREE.SphereGeometry(radius,32,32);
        const material = new THREE.MeshPhongMaterial({color: this.color});
        this.vismesh = new THREE.Mesh(geometry,material);
        
    }

    simulate(physicsScene){
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
    }
}