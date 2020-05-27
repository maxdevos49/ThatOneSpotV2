import { actioncontroller, flag, action } from "../../../util/ActionCommander/helpers/ActionDecorators.js";
import { CanvasService } from "../services/CanvasService.js";

@actioncontroller("canvas", "Manage the canvas")
export class Canvas {

    private readonly _canvas: CanvasService;

    constructor(canvas: CanvasService) {
        this._canvas = canvas;
    }

    @action("pan", "Pan the canvas", "Pan the canvas by an x or y offset.")
    public pan(
        @flag(["-x"]) x: number = 0,
        @flag(["-y"]) y: number = 0
    ): void {
        this._canvas.pan(x, y);
    }

    @action("position", "Position the canvas", "Position the canvas by an x or y position.")
    public position(
        @flag(["-x"]) x: number,
        @flag(["-y"]) y: number
    ): void {

        if (x)
            this._canvas.x = x;

        if (y)
            this._canvas.y = y;

    }

    @action("scale", "Scale the canvas", "Scale the canvas by an scalar.")
    public scale(
        @flag(["-s", "--scalar"]) scalar: number = 1
    ): void {
        this._canvas.setScale(scalar);
    }

    @action("center", "Center the canvas", "Center the canvas")
    public centerCanvas(): void {

        this._canvas.centerCanvas();
    }

    @action("resize", "Resize the canvas", "Resize the canvas")
    public resizeCanvas(
        @flag(["-w", "--width"]) width: number,
        @flag(["-h", "--height"]) height: number
    ): void {

        if (width)
            this._canvas.width = width;

        if (height)
            this._canvas.height = height;

        this.centerCanvas();
    }

}