//Imports
import { IllegalValueException } from "./errorHandling/IllegalValueException.js";
import {toggleFullScreen} from "./input/fullscreen.js";

/**
 * Creates a canvas prototyping project
 * @author Maxwell DeVos
 */
export class protoCore {

    public canvasWidth: number;

    public canvasHeight: number;

    private _targetId: string;

    private _canvas: HTMLCanvasElement;

    private _fullScreenId: string;

    private _context: CanvasRenderingContext2D;

    private _setup: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;

    private _update: (canvas: HTMLCanvasElement) => void;

    private _draw: ( ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

    private _framerate : number;
    
    private _rate : number;

    private _looping : boolean;

    private _keyListener : (e: KeyboardEvent) => void;

    private _animationFrameId: number;

    private _then : number;


    /**
     * Initilizes the canvas project object
     */
    constructor(givenOptions: any) {//TODO
        //Canvas Size
        this.canvasWidth = givenOptions.width ?? 1200;
        this.canvasHeight = givenOptions.height ?? 700;

        //Canvas element
        this._targetId = givenOptions.targetId ?? "canvas";
        this._canvas = document.getElementById(this._targetId) as HTMLCanvasElement;
        this._fullScreenId = givenOptions.fullScreenId ?? false;
        //Apply settings to canvas
        this._setupUI();

        //Get canvas drawing context
        this._context = this._canvas.getContext("2d");

        //Lifecycle functions
        this._setup = givenOptions.setup;
        this._update = givenOptions.update;
        this._draw = givenOptions.draw;

        //Animation settings
        this._framerate = givenOptions.framerate || 60;
        this._rate = 1000 / this._framerate;
        this._looping = false;

        this._keyListener = (e) => {
            switch (e.keyCode) {
                case 70:
                    this.fullScreen();
                    break;
                case 82:
                    this.reset();
                    break;
                default:
                    console.log(e.keyCode);
                    break;
            }
        }

        //Call setup to take initial inputs
        this._setup(this._canvas, this._context);

        if (givenOptions.autoStart ?? true) {
            this.start();
        }
    }

    /**
     * Setup Canvas based on the given options
     */
    private _setupUI(): void {
        this._canvas.width = this.canvasWidth;
        this._canvas.height = this.canvasHeight;

        //setup full screen
        if (this._fullScreenId) {
            let trigger = document.getElementById(this._fullScreenId);
            trigger.addEventListener("click", () => this.fullScreen());
        }

        if(this._keyListener)
            window.removeEventListener("keydown", this._keyListener);

        window.addEventListener("keydown", this._keyListener);
    }

    /**
     * Starts the canvas animation loop
     */
    public start(): void {
        if (!this._looping) {
            this._looping = true;

            //Get proper requestAnimationFrame
            var requestAnimationFrame =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame;

            this._animationFrameId = requestAnimationFrame(now => this.loop(now));
        }
    }

    /**
     * Stops the canvas animation loop
     */
    public stop():void {
        this._looping = false;
        cancelAnimationFrame(this._animationFrameId);
    }

    /**
     * Resets the entire project
     */
    public reset():void {
        this.stop();
        this._setup(this._canvas, this._context);
        this.start();
    }

    /**
     * Updates the framerate of the current animation
     */
    public set framerate(value: number) {

        if (value < 0 || value > 60) throw new IllegalValueException("Framerate can only be set to a value between 0 and 60.");

        this._framerate = value;
        this._rate = 100 / this._framerate;

        if (this._looping) {
            this.stop();
            this.start();
        }
    }
    /**
     * Calls all needed methods for a single cycle
     */
    private loop(now: number): void {
        if (this._looping) {
            if (!this._then) 
                this._then = now;

            let requestAnimationFrame =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame;

            //request next frame
            requestAnimationFrame(now => this.loop(now));

            let delta = now - this._then;

            //only draw for the desired framerate
            if (delta > this._rate) {
                this._then = now - (delta % this._rate);

                this._update(this._canvas);
                this._draw(this._context, this._canvas);
            }
        }
    }

    /**
     * Gets the current framerate
     */
    public get framerate() {
        return this._framerate;
    }
    /**
     * Gets the canvas element context
     * @api public
     */
    public getCanvas(): HTMLCanvasElement {
        return this._canvas;
    }

    /**
     * Gets the canvas elements drawing context
     */
    public getContext(): CanvasRenderingContext2D {
        return this._context;
        // Jeff was here, ayy lmao
    }

    /**
     * Toggles the canvas to be full screen or not. Due to security and
     * to prevent abuse this method will only work from a direct interaction
     * from a user such as a key, mouse, or button event
     */
    public fullScreen(): void {
        toggleFullScreen(this._canvas);
    }
}
