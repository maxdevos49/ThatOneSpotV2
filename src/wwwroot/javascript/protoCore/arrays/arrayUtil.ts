import { IllegalValueException } from "../errorHandling/IllegalValueException.js";

/**
 * Static class that contains methods to help with arrays
 * @author Maxwell DeVos
 */
export class ArrayUtil {
    /**
     * Generates a randomly filled array based on a length and maximum number given
     */
    static randomArray1D(length: number, max: number): number[] {
        if (typeof length !== "number")
            throw new TypeError("length must be a number.");
        if (length <= 0)
            throw new IllegalValueException("Length must be greater then 0.");

        if (typeof max !== "number")
            throw new TypeError("length must be a number.");

            return Array<number>(length)
            .fill(0)
            .map(() => Math.round(Math.random() * max));
    }

    /**
     * Generates a randomly filled 2 dimensional array based on a given column size, row size, and maximum number.
     */
    static randomArray2D(columns: number, rows: number, max: number): number[][] {
        if (columns <= 0)
            throw new IllegalValueException("Length must be greater then 0.");
        if (rows <= 0)
            throw new IllegalValueException("Length must be greater then 0.");

        let array = [];
        for (let i = 0; i < columns; i++) {
            array[i] = this.randomArray1D(rows, max);
        }

        return array;
    }

    /**
     * Generates a filled array based on a length and a number given
     * @param { number } length
     * @param { number } num
     * 
     * @throws TypeError
     * @throws IllegalValueException
     * 
     * @api public
     */
    static array1D(length: number, num: number): number[] {
        if (length <= 0)
            throw new IllegalValueException("Length must be greater then 0.");

        return Array<number>(length)
            .fill(0)
            .map(() => num);
    }

    /**
     * Generates a filled 2 dimensional array based on a given column size, row size, and a number.
     * @param { number } columns
     * @param { number } rows
     * @param { number } num
     * 
     * @throws TypeError
     * @throws IllegalValueException
     * 
     * @api public
     */
    static array2D(columns: number, rows: number, num: number) : number[][] {
        if (columns <= 0)
            throw new IllegalValueException("Length must be greater then 0.");

        if (rows <= 0)
            throw new IllegalValueException("Length must be greater then 0.");

        let array = [];
        for (let i = 0; i < columns; i++) {
            array[i] = this.array1D(rows, num);
        }

        return array;
    }
}
