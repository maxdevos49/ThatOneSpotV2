import {Shape} from "./protoCore/canvas/shape.js";
import {Triangle} from "./protoCore/canvas/triangle.js";
import {Vector} from "./protoCore/math/vector.js";


export class ship extends Shape{

    public velocity : Vector;
    public maxForce: number;
    public maxSpeed: number;
    public spaceship: Triangle;

    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenScale: number){
        super(givenContext, givenX, givenY, givenScale, givenScale * 2);
        this.velocity = new Vector(0,0);

        this.maxForce = Math.random();
        this.maxSpeed = Math.floor(Math.random() * 10);
        
        this.spaceship = new Triangle(givenContext, givenX, givenY,givenScale,givenScale * 2);
        this.spaceship.setFillStyle("red");
        this.spaceship.noStroke();
        this.spaceship.setAnchor((givenScale)/2,(givenScale * 2)/2);
    }

    public applySteering(desiredVector: Vector):void {
        desiredVector.setMagnitude(this.maxSpeed);
        let steering = Vector.sub(desiredVector, this.velocity);
        
        steering.limit(this.maxForce);

        this.velocity.add(steering);

        this.spaceship.x += this.velocity.x;
        this.spaceship.y += this.velocity.y;

        this.spaceship.setRotation(this.velocity.getDegrees() - 90);
    }

    public draw(): void{
        this.spaceship.draw();
    }

}