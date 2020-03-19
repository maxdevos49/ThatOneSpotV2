import {Vector} from "../math/vector.js";
/**
 * @author Maxwell DeVos
 * Base class for rendering objects and shapes to the HTML 5 Canvas
 */
export abstract class Renderable {


    /**
     *  The HTML 5 Drawing context
     */
    public context: CanvasRenderingContext2D;


    /**
     *  Represents the point of rotation for the renderable object.
     */
    public anchor: Vector;

    /**
     * Indicates the position of the renderable object
     */
    public position: Vector;

    /**
     *  Indicates the current roatation of the renderable object.
     */
    public rotation: number;

    /**
     * Indicates the current opacity of the object.
     */
    public globalOpacity: number;

    /**
     * Indicates the line width of strokes.
     */
    public lineWidth: number;

    /**
     *  Indicates the fillstyle color.
     */
    public fillStyle: string;

    /**
     * Indicates the strokestyle color.
     */
    public strokeStyle: string;

    /**
     *  Indicates whether to draw the shape if it is outside of the canvas frame.
     */
    public ignoreScreenBounds: boolean;

    /**
     *  Indicates whether the shape should be drawn or not.
     */
    public shown: boolean;

    private _fill: boolean;
    private _stroke: boolean;


    /**
     * Creates a new instance of a Renderable object. This class recieves a Canvas
     * rendering context object and a x position and y position.
     */
    constructor(givenContext: CanvasRenderingContext2D, givenX: number = 0, givenY: number = 0) {
        this.context = givenContext;

        //positioning
        this.position = new Vector(givenX, givenY);
        this.anchor = new Vector(0, 0);

        //context state properties
        this.rotation = 0;
        this.globalOpacity = 1;
        this.lineWidth = 1;

        //fill
        this.fillStyle = "black";
        this._fill = true;

        //stroke
        this.strokeStyle = "black";
        this._stroke = true;

        //drawing state properties
        this.ignoreScreenBounds = false;
        this.shown = true;

        //TODO
        // this.miterLimit = 10.0;
        // this.getLineDash();
        // this.setLineDash(segments);
        // this.lineDashOffset = 0.0;
        // this.lineCap = "butt";
        // this.lineJoin = "miter";
        // gradients
    }

    public set x(givenX) {
        this.position.x = givenX;
    }
    public get x() {
        return this.position.x;
    }

    public set y(givenY) {
        this.position.y = givenY;
    }
    public get y() {
        return this.position.y;
    }


    /**
     * Sets the anchor point for the the current renderable object to be drawn around
     */
    public setAnchor(givenX: number, givenY: number): void {
        this.anchor.x = givenX;
        this.anchor.y = givenY;
    }

    /**
     * Rotates the renderable object by the given angle. The default unit is degrees
     * but can be changed to radians by supplying an optional boolean value
     */
    public rotate(givenAngle: number, isRadians: boolean = false): void {

        if (isRadians) {
            //radians
            this.rotation += givenAngle;
        } else {
            //degrees
            this.rotation += givenAngle * (Math.PI / 180);
        }
    }

    /**
  * Rotates the renderable object to the given angle. The default unit is degrees
  * but can be changed to radians by supplying an optional boolean value
  */
    public setRotation(givenAngle: number, isRadians: boolean = false): void {

        if (isRadians) {
            //radians
            this.rotation = givenAngle;
        } else {
            //degrees
            this.rotation = givenAngle * (Math.PI / 180);
        }
    }

    /**
     * Sets the opacity of the renderable object. The valid range is between
     * 1 and 0 where 1 is opaque and 0 is clear.
     */
    public setOpacity(givenOpacity: number): void {
        this.globalOpacity = givenOpacity;
    }

    /**
     * Sets the lineWidth of the stroke
     */
    public setLineWidth(givenWidth: number): void {
        this.lineWidth = givenWidth;
    }

    /**
     * Sets the state of the renderable object to not be drawn on the screen.
     */
    public hide(): void {
        this.shown = false;
    }

    /**
     * Sets the state of the renderable object to be drawn on the screen.
     */
    public show(): void {
        this.shown = true;
    }

    /**
     * Sets the state to not fill in the renderable object.
     */
    public noFill(): void {
        this._fill = false;
    }

    /**
     * Sets the state to fill in the renderable object
     */
    public fill(): void {
        this._fill = true;
    }

    /**
     * Sets the state to not stroke in the renderable object.
     */
    public noStroke(): void {
        this._stroke = false;
    }

    /**
     * Sets the state to stroke in the renderable object
     */
    public stroke(): void {
        this._stroke = true;
    }

    /**
     * Sets the color of fill of the renderable object
     */
    public setFillStyle(givenColor: string): void {
        this.fillStyle = givenColor;
    }

    /**
     * Sets the color of stroke of the renderable object
     */
    public setStrokeStyle(givenColor: string): void {
        this.strokeStyle = givenColor;
    }

    /**
     * draw implements some of the basic actions needed for drawing a renderable object to the canvas
     */
    public draw(drawingInstructions: Function): void {
        //check to show the shape or nor
        if (this.shown) {
            let x = -this.anchor.x;
            let y = -this.anchor.y;
            let ctx = this.context;
            //save current context
            ctx.save();

            //fill
            ctx.fillStyle = this.fillStyle;

            //stroke
            ctx.strokeStyle = this.strokeStyle;

            //opacity
            ctx.globalAlpha = this.globalOpacity;

            //lineWidth
            ctx.lineWidth = this.lineWidth;

            //translate
            ctx.translate(this.x - x, this.y - y);

            //rotate
            ctx.rotate(this.rotation);

            //Call the custom drawing
            drawingInstructions(ctx, x, y);

            //stroke
            if (this._stroke) {
                ctx.stroke();
            }

            //fill
            if (this._fill) {
                ctx.fill();
            }

            //restore context to previous state
            ctx.restore();
        }
    }
}
