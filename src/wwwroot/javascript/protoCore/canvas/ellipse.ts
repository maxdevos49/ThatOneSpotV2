import {Shape} from "./shape.js";

/**
 * @author Maxwell DeVos
 * Creates a rectangle that can be drawn on a canvas
 */
export class Ellipse extends Shape {
    /**
     * Contructs a Ellipse Shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenWidth: number, givenHeight: number) {
        super(givenContext, givenX, givenY, givenWidth, givenHeight);
    }

    /**
     * Draws an Ellipse
     */
    draw() {
        super.draw((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
            Ellipse.draw(ctx, x, y, width, height);
        });
    }

    /**
     * Draws an Ellipse on an html 5 canvas
     */
    static draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number){
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, 2 * Math.PI);
        ctx.closePath();
    }
}
