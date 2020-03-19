import { Renderable } from "./Renderable.js";

/**
 * This class contains all of the basic operations and
 * attributes all shapes have. This class can be extended to create
 * other shapes and is not intended to be used directly.
 * @author Maxwell DeVos
 */
export abstract class Shape extends Renderable {

    /**
     * The horizontal bounds of the shape.
     */
    public width: number;  

    /**
     * The vertical bounds of the shape.
     */
    public height: number;  

    /**
     *  Boolean property to tell if the bounds of the shape shpublic 
     */
    public  bounds : boolean;

    /**
     * Contructs a Abstact shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenWidth: number, givenHeight: number) {
        super(givenContext, givenX, givenY);

        this.width = givenWidth;
        this.height = givenHeight;

        this.bounds = false;
    }


    /**
     * Draws a shape and applies all the drawing attributes set for the shape
     */
    public draw(drawingInstructions: Function): void {
        super.draw((ctx: CanvasRenderingContext2D, x: number, y: number) => {
            let width = this.width;
            let height = this.height;

            if (this.bounds) {
                ctx.save();
                //Bounding Box
                ctx.globalAlpha = 1;
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.strokeRect(x, y, width, height);
                ctx.closePath();
                ctx.restore();

                // Anchor point
                ctx.save();
                ctx.fillStyle = "red";
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, 5, 5, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }

            drawingInstructions(ctx, x, y, width, height);
        });
    }
    /**
     * Shows the bounding box around a shape
     */
    showBounds() {
        this.bounds = true;
    }

    /**
     * Hides a bounding box around a shape
     */
    hideBounds() {
        this.bounds = true;
    }
}
