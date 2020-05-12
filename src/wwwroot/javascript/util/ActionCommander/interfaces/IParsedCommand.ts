import { IActionController } from "./IActionController.js";
import { IAction } from "./IAction.js";

export interface IParsedCommmand {
    command: string;
    searchKey: string;
    isValid: boolean;
    controller: string;
    controllerMetaData: IActionController | null;
    action: string;
    actionMetaData: IAction | null;
    errors: string;
    searchIndex: number;
    rawValues: Map<string, string>;
    actionArguments: any[];
}