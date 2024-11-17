import {Vector2} from "./Vector2.js"
import {Material} from "./Material.js"

export class Rigidbody{
    constructor(shape, mass){
        this.shape = shape;
        this.mass = mass;
        this.invMass = 0;
        this.isKinematic = false;
        if(mass>0){
            this.invMass = 1/mass;
        }else{
            this.invMass = 0;
            this.isKinematic = true;
        }

        this.forceAccumulator = new Vector2(0,0);
        this.velocity = new Vector2(0,0);
        this.material = new Material();

        this.angularVelocity = 0;
        this.inertia = this.shape.calculateInertia(this.mass);
        if(this.inertia > 0.00001){
            this.invInertia = 1 / this.inertia;
        }else{
            this.invInertia = 0;
        }
    }

    addForce(force){
        this.forceAccumulator.Add(force);
    }

    addVelocity(velocity){
        this.velocity.Add(velocity);
    }

    setVelocity(velocity){  
        this.velocity = velocity.Copy();
    }

    update(deltaTime){
        this.log();
        this.integrate(deltaTime);
    }

    integrate(deltaTime){
        this.semiImplicitEuler(deltaTime);
        // this.forwardEuler(deltaTime);
        // this.midPointMethod(deltaTime);
        //this.rungeKutta4(deltaTime);
       
        this.velocity.Scale(0.999);
        this.angularVelocity *= 0.999;
        this.forceAccumulator = new Vector2(0,0);
    }

    semiImplicitEuler(deltaTime){
        let acceleration  = Vector2.Scale(this.forceAccumulator,this.invMass);
        this.velocity = Vector2.Add(this.velocity,Vector2.Scale(acceleration , deltaTime));
        let deltaPosition = Vector2.Scale(this.velocity,deltaTime);
        this.shape.move(deltaPosition);

        let deltaRotation = this.angularVelocity * deltaTime;
		//console.log(deltaRotation);
		this.shape.rotate(deltaRotation);

    }
    
    forwardEuler(deltaTime){
        let acceleration  = Vector2.Scale(this.forceAccumulator,this.invMass);
        let deltaPosition =  Vector2.Scale(this.velocity, deltaTime);
        this.shape.move(deltaPosition);
        this.velocity = Vector2.Add(this.velocity, Vector2.Scale(acceleration, deltaTime));
    }

    midPointMethod(deltaTime){
        let acceleration  = Vector2.Scale(this.forceAccumulator,this.invMass);
        let halfAccelaration = Vector2.Scale(acceleration,0.5);
        this.velocity = Vector2.Add(this.velocity, Vector2.Scale(halfAccelaration,deltaTime));
        let deltaPosition = Vector2.Scale(this.velocity, deltaTime);
        this.shape.move(deltaPosition);
        this.velocity = Vector2.Add(this.velocity, Vector2.Scale(halfAccelaration,deltaTime));
    }

    rungeKutta4(deltaTime) {
        let k1, k2, k3, k4;

        const computeAcceleration = (force, invMass) =>{ return Vector2.Scale(force,invMass)};

        let acceleration = computeAcceleration(this.forceAccumulator,this.invMass);
        k1 = Vector2.Scale(acceleration, deltaTime);

        let tempForce = Vector2.Add(this.forceAccumulator, Vector2.Scale(k1, 0.5));
        acceleration = computeAcceleration(tempForce,this.invMass);
        k2 = Vector2.Scale(acceleration, deltaTime);

        tempForce = Vector2.Add(this.forceAccumulator, Vector2.Scale(k2,0.5));
        acceleration = computeAcceleration(tempForce,this.invMass);
        k3 = Vector2.Scale(acceleration, deltaTime);

        tempForce = Vector2.Add(this.forceAccumulator, Vector2.Scale(k3,0.5));
        acceleration = computeAcceleration(tempForce,this.invMass);
        k4 = Vector2.Scale(acceleration, deltaTime);

        let deltaVelocity = Vector2.Scale(Vector2.Add(Vector2.Add(k1,Vector2.Scale(k2,2)), Vector2.Add(Vector2.Scale(k3,2),k4)), 1/6)
        this.velocity = Vector2.Add(this.velocity, deltaVelocity);

        let deltaPosition = Vector2.Scale(this.velocity, deltaTime);
        this.shape.move(deltaPosition);
    }

    getShape(){
        return this.shape;
    }
    getCenter(){
        return this.shape.centroid.Copy();
    }

    getVelocity(){
        return this.velocity.Copy();
    }

    log(){
        console.log(
            "Force: x = "+this.forceAccumulator.x + " y = "+this.forceAccumulator.y+
            "\nVelocity: x = "+this.velocity.x+" y = "+this.velocity.y);
    
    }
}