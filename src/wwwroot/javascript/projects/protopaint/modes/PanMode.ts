import { InteractionMode, ProtoPaint } from "../protopaint.js";
import { Vector } from "../../../protoCore/math/vector.js";

/**
 * 
 * Canvas Grab Mode
 * * Scroll moves canvas in the direction of the scroll
 * * Scroll + CtrlKey zooms or unzooms on the mouse point
 * * Click and drag moves the canvas by amount of the mouse move
 * 
 * 
 */
export class PanMode extends InteractionMode {

    private _mouseDown: boolean;

    private _previousPosition: Vector;

    constructor() {
        super("Pan", "Pan, zoom, and navigate the canvas.");

        this._mouseDown = false;
        this._previousPosition = new Vector();
    }

    public init(dependency: ProtoPaint): void{
        dependency.canvas.interactionLayer.style.cursor = "grab";
    }


    public onMouseDown(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();
        this._mouseDown = true;

    }

    public onMouseUp(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();
        this._mouseDown = false;
    }

    public onMouseMove(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();
        if (this._mouseDown) {
            dependency.canvas.pan(e.offsetX - this._previousPosition.x, e.offsetY - this._previousPosition.y);
        }

        this._previousPosition.x = e.offsetX;
        this._previousPosition.y = e.offsetY;
    }
    public onMouseClick(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();
    }

    public onMouseLeave(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();
        this._mouseDown = false;
    }

    public onMouseDblClick(dependency: ProtoPaint, e: MouseEvent): void {
        e.preventDefault();

        let c = dependency.canvas;

        if (e.altKey) {
            c.scaleCanvasToPoint(-c.dblClickScale, new Vector(e.offsetX, e.offsetY));
        } else {
            c.scaleCanvasToPoint(c.dblClickScale, new Vector(e.offsetX, e.offsetY));
        }
    }


}
