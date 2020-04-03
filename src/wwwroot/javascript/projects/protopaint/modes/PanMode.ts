import { InteractionMode, ProtoPaint } from "../protopaint.js";

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

    constructor() {
        super("Pan", "Pan, zoom, and navigate the canvas.");
    }


    public onMouseDown(dependency: ProtoPaint, e: MouseEvent): void {
    }

    public onMouseUp(dependency: ProtoPaint, e: MouseEvent): void {
    }

    public onMouseMove(dependency: ProtoPaint, e: MouseEvent): void {
    }
    public onMouseClick(dependency: ProtoPaint, e: MouseEvent): void {
    }


}
