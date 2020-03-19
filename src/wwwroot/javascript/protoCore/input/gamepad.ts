//imports
import { IllegalValueException } from "../errorHandling/IllegalValueException.js";

/**
 * Class to help with the gamepad
 * @author Maxwell DeVos
 */
export class GamePad {
    /**
     * Indicates whether gamepads are supported in the current browser
     */
    public static controllerSupport(): boolean {
        return "getGamepads" in navigator;
    }

    /**
     * Indicates whether or not atleast 1 controller in connected
     */
    public static controllerConnected(): boolean {
        if (this.controllerSupport()) {
            if (navigator.getGamepads()[0]) {
                //might not always be true but we will see for now
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the amount of controllers currently connected
     */
    public static controllerCount(): number {
        let gamepad = navigator.getGamepads();
        let count = 0;

        if (gamepad) {
            for (let i = 0; i < gamepad.length; i++) {
                if (gamepad[i] != null) count++;
            }

            return count;
        }

        return 0;
    }

    /**
     * Retrieves the given array of buttons and their respective values
     *
     * @param { Number } index Optional argument to determine what controller
     * you want. Defaults to the the first controller or index 0.
     *
     * @throws TypeError
     * @throws IllegalValueException
     *
     * @returns { Array } the given set of buttons for a specified index
     * @api public
     */
    public static getButtons(index: number = 0): GamepadButton[] {
        if (typeof index !== "number")
            throw new TypeError("Index must be a number");
        if (index < 0)
            throw new IllegalValueException("Index must be a number above 0");

        var gamepad: any = navigator.getGamepads();

        return gamepad[index].buttons;
    }

    /**
     * Retrieves the given array of Axes and their respective values
     *
     * @param { Number } index Optional argument to determine what controller
     * you want. Defaults to the the first controller or index 0.
     *
     * @throws TypeError
     * @throws IllegalValueException
     *
     * @returns { Array } the given set of axes for a specified controller index
     * @api public
     */
    static getAxes(index = 0) {
        if (typeof index !== "number")
            throw new TypeError("Index must be a number");
        if (index < 0)
            throw new IllegalValueException("Index must be a number above 0");

        var gamepad = navigator.getGamepads();

        return gamepad[index].axes;
    }
}
