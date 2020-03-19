import {Shape} from "./shape.js";

/**
 * @author Maxwell DeVos
 * Creates a triangle that can be drawn on a canvas
 */
export class Triangle extends Shape {
    /**
     * Contructs a Triangle Shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenWidth: number, givenHeight: number) {
        super(givenContext, givenX, givenY, givenWidth, givenHeight);
    }

    /**
     * Draws a Triangle.
     */
    draw() {
        super.draw((context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
            Triangle.draw(context, x, y, width, height);
        });
    }

    /**
     * Draws a Triangle.
     */
    static draw(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.lineTo(x + width / 2, y + height);
        context.closePath();
    }
}
