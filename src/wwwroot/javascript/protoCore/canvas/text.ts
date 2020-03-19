//Imports
import {Shape} from "./shape.js";

/**
 * @author Maxwell DeVos
 * Creates a Text shape that can be drawn on a canvas
 */
export class Text extends Shape {

    public text: string;

    public fontSize: number;

    public fontFamily: string;

    public textAlign: CanvasTextAlign;

    public textBaseline: CanvasTextBaseline;


    /**
     * Contructs a Text Shape
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number, givenY: number, givenText: string) {
        super(givenContext, givenX, givenY, 0, 0);

        this.text = givenText;
        this.fontSize = 20;
        this.fontFamily = "serif";
        this.textAlign = "start";
        this.textBaseline = "alphabetic";

        //get the proper width and height
        this.updateBounds();

    }

    /**
     * Updates the bounds of the text
     */
    private updateBounds(): void {
        //save context
        this.context.save();
        //apply font size and type
        this.context.font = this.getFont();
        //get width
        this.width = this.context.measureText(this.text).width;
        this.height = this.fontSize;
        //restore context
        this.context.restore();
    }

    /**
     * Set the font size
     */
    public setFontSize(givenSize: number): void {
        //change font size
        this.fontSize = givenSize;
        this.updateBounds();
    }

    /**
     * Sets the font Family
     */
    public setFontFamily(givenFamily: string): void {
        this.fontFamily = givenFamily;
        this.updateBounds();
    }

    /**
     * Sets the display text
     */
    public setText(givenText: string): void{
        this.text = givenText;
        this.updateBounds();
    }

    /**
     * Gets a text size and font family combo
     */
    public getFont(): string {
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    /**
     * Draws text on a canvas
     */
    draw() {
        super.draw((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
            //font
            ctx.font = this.getFont();

            //text align
            ctx.textAlign = this.textAlign;

            //text baseline
            ctx.textBaseline = this.textBaseline;

            
            //draw
            ctx.beginPath();
            if (this.fill) {
                ctx.fillText(this.text, x, y + height/(4/3));
            } else {
                ctx.strokeText(this.text, x, y + height/(4/3));
            }
            ctx.closePath();

        });
    }
}
