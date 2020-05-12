// import { InteractionLayer } from "./services/InteractionService.js";
import { Vector } from "../../protoCore/math/vector.js";

export interface InteractionMode {


    init(): void;

    onMouseClick(e: MouseEvent): void;
    onMouseDblClick(e: MouseEvent): void;
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
    onContextMenu(e: MouseEvent): void;
    onWheel(e: WheelEvent): void;

}

// onWheel( e: WheelEvent): void {
    //     e.preventDefault();

    //     let c = d.canvas;

    //     if (e.altKey) {
    //         c.scaleCanvasToPoint(e.deltaY * -0.01, new Vector(e.offsetX, e.offsetY));
    //     } else {
    //         c.pan(e.deltaX * -0.2, e.deltaY * -0.2);
    //     }
    // }