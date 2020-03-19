/**
 * Exception for illegal values
 * @author Maxwell DeVos
 */
export class IllegalValueException extends Error {

    constructor(message: string) {
        super(message);
        this.name = "Illegal Value Exception";
    }
}
