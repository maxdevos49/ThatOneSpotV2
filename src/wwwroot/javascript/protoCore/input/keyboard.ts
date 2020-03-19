/**
 * Makes retrieving input from the keyboard super easy
 * @Deprecrate
 * @author Maxwell DeVos
 */
export class Keyboard {

    private isPressed: boolean;
    private isUp: boolean;
    private isDown: boolean;

    private keyPressed: number;
    private _keyUp: number;
    private _keyDown: number

    /**
     * Sets up the instance
     */
    constructor() {
        this.isPressed = false;
        this.isUp = false;
        this.isDown = false;

        this.keyPressed = null;
        this._keyUp = null;
        this._keyDown = null;

        window.addEventListener("keypress", e => {
            e.preventDefault();

            this.isPressed = true;
            this.keyPressed = e.keyCode;
        });

        window.addEventListener("keydown", e => {
            e.preventDefault();

            this.isDown = true;
            this._keyDown = e.keyCode;
        });

        window.addEventListener("keyup", e => {
            e.preventDefault();

            this.isUp = true;
            this._keyUp = e.keyCode;
        });
    }

    /**
     * Indicates if a key was isPressed
     */
    public pressed() : boolean {
        return this.isPressed;
    }

    /**
     * Returns the key that was last pressed
     */
    public keyPress() : number{
        this.isPressed = false;
        return this.keyPressed;
    }

    /**
     * Indicates if a key was released
     */
    public up() : boolean {
        return this.isUp;
    }

    /**
     * Returns the last key that was released
     */
    public keyUp() : number {
        this.isUp = false;
        return this._keyUp;
    }

    /**
     * Indicates if a key is down
     */
    public down(): boolean {
        return this.isDown;
    }

    /**
     * Returns the last key pressed down
     */
    public keyDown(): number {
        this.isDown = false;
        return this._keyDown;
    }
}
