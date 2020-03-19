import {Shape} from "./shape.js";

/**
 * @author Maxwell DeVos
 * Creates a rectangle that can be drawn on a canvas
 */
export class Rectangle extends Shape{
    
    /**
     * Contructs a Rectangle Shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY:number, givenWidth: number, givenHeight: number){
        super(givenContext, givenX, givenY, givenWidth, givenHeight);
    }

    /**
     * Draws a rectangle
     */
    draw(){
        super.draw((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
            Rectangle.draw(ctx, x, y, width, height);
        })
    }

    /**
     * Draws a Rectangle
     */
    static draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(width + x, y);
        ctx.lineTo(width + x, height + y);
        ctx.lineTo(x, height + y);
        ctx.closePath();
    }

}