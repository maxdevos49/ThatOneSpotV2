import { IActionCommander } from "../ActionCommander.js";

export interface IActionExtension {

    activate(): void;
    deactivate(): void;

    onError?(): void;
    onInput?(): void;
    onSubmit?(): void;
    onFocus?(): void;
    onBlur?(): void;

}

export interface IActionExtensionConstructor<T extends IActionExtension> {
    new(actionCommander: IActionCommander, ...args: any[]): T
}