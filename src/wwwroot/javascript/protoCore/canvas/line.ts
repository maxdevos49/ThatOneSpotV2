import {Renderable} from "./Renderable.js";

/**
 * @author Maxwell DeVos
 * Creates a Line that can be drawn on a canvas
 */
export class Line extends Renderable {

    public length: number;

    /**
     * Contructs a Triangle Shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenLength: number) {
        super(givenContext, givenX, givenY);

        this.length = givenLength;
    }

    /**
     * Draws a line for the current instance onto a html canvas
     */
    draw() {
        super.draw((ctx: CanvasRenderingContext2D, x: number, y: number) => {
            Line.draw(ctx, x, y, this.lineWidth + x, y);
        });
    }

    /**
     * Draws a line
     */
    static draw(ctx: CanvasRenderingContext2D, x: number, y: number, x2: number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.closePath();
    }
}
